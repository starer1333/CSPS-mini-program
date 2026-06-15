const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const _ = db.command;

exports.main = async event => {
  const days = Number(event.days || 90);
  const before = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const res = await db.collection('orders').where({
    createTime: _.lt(before),
    hidden: false
  }).update({
    data: {
      hidden: true,
      hiddenTime: db.serverDate()
    }
  });
  return { success: true, updated: res.stats && res.stats.updated };
};
