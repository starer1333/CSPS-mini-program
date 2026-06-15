function hasCloud() {
  return typeof wx !== 'undefined' && wx.cloud && wx.cloud.database;
}

function db() {
  if (!hasCloud()) {
    return null;
  }
  try {
    return wx.cloud.database();
  } catch (err) {
    console.warn('云数据库未就绪', err);
    return null;
  }
}

async function list(collectionName, options = {}) {
  const database = db();
  if (!database) {
    throw new Error('cloud database unavailable');
  }

  let query = database.collection(collectionName);
  if (options.where) {
    query = query.where(options.where);
  }
  if (options.orderBy) {
    query = query.orderBy(options.orderBy.field, options.orderBy.direction || 'asc');
  }
  if (options.limit) {
    query = query.limit(options.limit);
  }

  const res = await query.get();
  return res.data || [];
}

async function add(collectionName, data) {
  const database = db();
  if (!database) {
    throw new Error('cloud database unavailable');
  }
  return database.collection(collectionName).add({ data });
}

async function update(collectionName, id, data) {
  const database = db();
  if (!database) {
    throw new Error('cloud database unavailable');
  }
  return database.collection(collectionName).doc(id).update({ data });
}

async function remove(collectionName, id) {
  const database = db();
  if (!database) {
    throw new Error('cloud database unavailable');
  }
  return database.collection(collectionName).doc(id).remove();
}

async function callFunction(name, data = {}) {
  if (!hasCloud() || !wx.cloud.callFunction) {
    throw new Error('cloud function unavailable');
  }
  const res = await wx.cloud.callFunction({ name, data });
  return res.result;
}

module.exports = {
  hasCloud,
  db,
  list,
  add,
  update,
  remove,
  callFunction
};
