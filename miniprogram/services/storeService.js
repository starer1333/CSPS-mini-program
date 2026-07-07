const cloud = require('./cloudService.js');
const localData = require('./localDataService.js');
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
  localData.ensureCollection(COLLECTIONS.storeSettings);
  if (localData.hasPending(COLLECTIONS.storeSettings)) {
    return toRuntimeSettings(localData.getCollection(COLLECTIONS.storeSettings)[0]);
  }
  try {
    const list = await cloud.list(COLLECTIONS.storeSettings, { limit: 1 });
    if (list[0]) {
      localData.replaceCollection(COLLECTIONS.storeSettings, list);
      return toRuntimeSettings(list[0]);
    }
    localData.setLocalMode(COLLECTIONS.storeSettings, true);
    return toRuntimeSettings(localData.getCollection(COLLECTIONS.storeSettings)[0]);
  } catch (err) {
    localData.setLocalMode(COLLECTIONS.storeSettings, true);
    return toRuntimeSettings(localData.getCollection(COLLECTIONS.storeSettings)[0] || DEFAULT_SETTINGS);
  }
}

async function getBanners() {
  localData.ensureCollection(COLLECTIONS.banners);
  if (localData.hasPending(COLLECTIONS.banners)) {
    return normalizeBanners(localData.getCollection(COLLECTIONS.banners));
  }
  try {
    const banners = await cloud.list(COLLECTIONS.banners, {
      orderBy: { field: 'sort', direction: 'asc' }
    });
    const active = normalizeBanners(banners);
    if (active.length) {
      localData.replaceCollection(COLLECTIONS.banners, banners);
      return active;
    }
    localData.setLocalMode(COLLECTIONS.banners, true);
    return normalizeBanners(localData.getCollection(COLLECTIONS.banners));
  } catch (err) {
    localData.setLocalMode(COLLECTIONS.banners, true);
    return normalizeBanners(localData.getCollection(COLLECTIONS.banners)) || DEFAULT_BANNERS;
  }
}

async function getRechargePlans() {
  localData.ensureCollection(COLLECTIONS.rechargePlans);
  if (localData.hasPending(COLLECTIONS.rechargePlans)) {
    return normalizeRechargePlans(localData.getCollection(COLLECTIONS.rechargePlans));
  }
  try {
    const plans = await cloud.list(COLLECTIONS.rechargePlans, {
      orderBy: { field: 'amount', direction: 'asc' }
    });
    if (plans.length) {
      localData.replaceCollection(COLLECTIONS.rechargePlans, plans);
      return normalizeRechargePlans(plans);
    }
    localData.setLocalMode(COLLECTIONS.rechargePlans, true);
    return normalizeRechargePlans(localData.getCollection(COLLECTIONS.rechargePlans));
  } catch (err) {
    localData.setLocalMode(COLLECTIONS.rechargePlans, true);
    return normalizeRechargePlans(localData.getCollection(COLLECTIONS.rechargePlans));
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
