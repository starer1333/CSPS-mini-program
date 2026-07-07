const cloud = require('./cloudService.js');
const localData = require('./localDataService.js');
const { COLLECTIONS } = require('../config/database.js');
const { normalizeUserCoupon } = require('../utils/coupon.js');

async function listUserCoupons(userId) {
  localData.ensureCollection(COLLECTIONS.coupons);
  const localTemplates = localData.getCollection(COLLECTIONS.coupons);
  try {
    const [userCoupons, templates] = await Promise.all([
      cloud.list(COLLECTIONS.userCoupons, {
        where: userId ? { userId } : undefined
      }),
      localData.hasPending(COLLECTIONS.coupons)
        ? Promise.resolve(localTemplates)
        : cloud.list(COLLECTIONS.coupons)
    ]);
    if (templates.length && !localData.hasPending(COLLECTIONS.coupons)) {
      localData.replaceCollection(COLLECTIONS.coupons, templates);
    }
    return mergeCoupons(userCoupons, templates.length ? templates : localTemplates);
  } catch (err) {
    const userCoupons = wx.getStorageSync('userCoupons') || [];
    return mergeCoupons(userCoupons, localTemplates);
  }
}

function mergeCoupons(userCoupons, templates) {
  const ownedTemplateIds = new Set((userCoupons || []).map(item => item.couponId).filter(Boolean));
  const campaignCoupons = (templates || [])
    .filter(item => item.status !== false && !ownedTemplateIds.has(item._id || item.id))
    .map(item => {
      const expireDate = item.expireDate || validDate(item.validDays);
      return {
        id: `template_${item._id || item.id}`,
        couponId: item._id || item.id,
        name: item.name,
        dishId: item.foodId || '',
        dishName: item.foodName || item.description || '指定餐品',
        value: Number(item.value || 0),
        status: 'unused',
        expireDate,
        source: '商家活动'
      };
    });
  return (userCoupons || []).map(normalizeUserCoupon).concat(campaignCoupons.map(normalizeUserCoupon));
}

function validDate(validDays) {
  const date = new Date(Date.now() + Number(validDays || 30) * 24 * 60 * 60 * 1000);
  return date.toISOString().slice(0, 10);
}

async function sendCoupon(data) {
  try {
    return await cloud.callFunction('sendCoupon', data);
  } catch (err) {
    const coupons = wx.getStorageSync('userCoupons') || [];
    coupons.push({
      id: Date.now() + Math.random().toString(36).slice(2, 7),
      status: 'unused',
      receiveTime: new Date().toISOString(),
      source: data.source || '系统发放',
      ...data
    });
    wx.setStorageSync('userCoupons', coupons);
    return { success: true };
  }
}

module.exports = {
  listUserCoupons,
  sendCoupon
};
