const cloud = require('./cloudService.js');
const { COLLECTIONS } = require('../config/database.js');
const { normalizeUserCoupon } = require('../utils/coupon.js');

async function listUserCoupons(userId) {
  try {
    const coupons = await cloud.list(COLLECTIONS.userCoupons, {
      where: userId ? { userId } : undefined
    });
    return coupons.map(normalizeUserCoupon);
  } catch (err) {
    return (wx.getStorageSync('userCoupons') || []).map(normalizeUserCoupon);
  }
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
