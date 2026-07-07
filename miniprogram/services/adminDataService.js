const cloud = require('./cloudService.js');
const local = require('./localDataService.js');

async function list(collection, options = {}) {
  local.ensureCollection(collection);
  const localItems = local.getCollection(collection);
  if (local.hasPending(collection)) {
    return { items: localItems, cloudReady: false };
  }
  try {
    const remoteItems = await cloud.list(collection, options);
    if (remoteItems.length) {
      local.replaceCollection(collection, remoteItems);
      local.setLocalMode(collection, false);
      local.markPending(collection, false);
      return { items: remoteItems, cloudReady: true };
    }
    local.setLocalMode(collection, localItems.length > 0);
    return { items: localItems, cloudReady: false };
  } catch (err) {
    local.setLocalMode(collection, true);
    return { items: localItems, cloudReady: false };
  }
}

async function save(collection, id, data) {
  local.ensureCollection(collection);
  let recordId = id;
  let cloudReady = false;

  if (!local.isLocalMode(collection)) {
    try {
      if (id) {
        await cloud.update(collection, id, data);
      } else {
        const result = await cloud.add(collection, data);
        recordId = result._id;
      }
      cloudReady = true;
      local.markPending(collection, false);
    } catch (err) {
      local.markPending(collection, true);
      local.setLocalMode(collection, true);
    }
  } else {
    local.markPending(collection, true);
  }

  const record = local.upsert(collection, recordId, data);
  markDirty(collection);
  return { record, cloudReady };
}

async function remove(collection, id) {
  if (!local.isLocalMode(collection)) {
    try {
      await cloud.remove(collection, id);
    } catch (err) {
      local.markPending(collection, true);
      local.setLocalMode(collection, true);
    }
  }
  local.remove(collection, id);
  markDirty(collection);
}

function markDirty(collection) {
  if (['categories', 'foods', 'optionGroups', 'optionItems'].includes(collection)) {
    wx.setStorageSync('menuDirty', true);
  }
  if (['banners', 'storeSettings', 'rechargePlans', 'coupons'].includes(collection)) {
    wx.setStorageSync('configDirty', true);
  }
}

module.exports = {
  list,
  save,
  remove,
  markDirty
};
