const cloud = require('./cloudService.js');
const { COLLECTIONS } = require('../config/database.js');

const DEFAULT_SETTINGS = {
  normalDeliveryFee: 5,
  holidayDeliveryFee: 10,
  freeDeliveryAmount: 50,
  pickupLeadMinutes: 40,
  servicePhone: '',
  serviceWechat: 'pizza123',
  serviceQr: '/images/wechat-qr.png',
  isHoliday: false
};

const DEFAULT_BANNERS = [
  { id: 'local-1', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=640', status: true, sort: 1 },
  { id: 'local-2', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=640', status: true, sort: 2 },
  { id: 'local-3', imageUrl: 'https://images.unsplash.com/photo-1561758033-7e924f619b47?w=640', status: true, sort: 3 }
];

function toRuntimeSettings(settings) {
  const merged = { ...DEFAULT_SETTINGS, ...(settings || {}) };
  return {
    ...merged,
    deliveryConfig: {
      normalFee: Number(merged.normalDeliveryFee || 0),
      holidayFee: Number(merged.holidayDeliveryFee || 0),
      freeThreshold: Number(merged.freeDeliveryAmount || 0),
      isHoliday: !!merged.isHoliday
    }
  };
}

async function getStoreSettings() {
  const local = wx.getStorageSync('admin_storeSettings') || [];
  if (local[0]) {
    return toRuntimeSettings(local[0]);
  }
  try {
    const list = await cloud.list(COLLECTIONS.storeSettings, { limit: 1 });
    return toRuntimeSettings(list[0]);
  } catch (err) {
    return toRuntimeSettings(DEFAULT_SETTINGS);
  }
}

async function getBanners() {
  const local = wx.getStorageSync('admin_banners') || [];
  if (local.length) {
    const active = normalizeBanners(local);
    if (active.length) return active;
  }
  try {
    const banners = await cloud.list(COLLECTIONS.banners, {
      orderBy: { field: 'sort', direction: 'asc' }
    });
    const active = normalizeBanners(banners);
    return active.length ? active : DEFAULT_BANNERS;
  } catch (err) {
    return DEFAULT_BANNERS;
  }
}

async function getRechargePlans() {
  const local = wx.getStorageSync('admin_rechargePlans') || [];
  if (local.length) {
    return normalizeRechargePlans(local);
  }
  try {
    const plans = await cloud.list(COLLECTIONS.rechargePlans, {
      orderBy: { field: 'amount', direction: 'asc' }
    });
    return normalizeRechargePlans(plans);
  } catch (err) {
    return [
      { amount: 300, gift: 30, coupon: '经典牛排券' },
      { amount: 500, gift: 60, coupon: '' },
      { amount: 1000, gift: 150, coupon: '小吃券' },
      { amount: 2000, gift: 400, coupon: '至尊披萨券' }
    ];
  }
}

function normalizeBanners(banners) {
  return (banners || [])
    .filter(item => item.status !== false)
    .sort((a, b) => Number(a.sort || 0) - Number(b.sort || 0))
    .map(item => ({
      id: item._id || item.id,
      imageUrl: item.image || item.imageUrl,
      link: item.link || ''
    }));
}

function normalizeRechargePlans(plans) {
  return (plans || [])
    .filter(item => item.status !== false)
    .sort((a, b) => Number(a.amount || 0) - Number(b.amount || 0))
    .map(item => ({
      id: item._id || item.id,
      amount: Number(item.amount || 0),
      gift: Number(item.giftAmount || item.gift || 0),
      giftAmount: Number(item.giftAmount || item.gift || 0),
      couponId: item.couponId || '',
      coupon: item.couponName || ''
    }));
}

module.exports = {
  getStoreSettings,
  getBanners,
  getRechargePlans,
  toRuntimeSettings
};
