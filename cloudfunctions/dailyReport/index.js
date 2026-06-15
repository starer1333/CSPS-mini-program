const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const _ = db.command;

exports.main = async event => {
  const date = event.date || new Date().toISOString().slice(0, 10);
  const start = new Date(`${date}T00:00:00.000+08:00`);
  const end = new Date(`${date}T23:59:59.999+08:00`);

  const orders = await db.collection('orders').where({
    createTime: _.gte(start).and(_.lte(end)),
    hidden: false
  }).get();

  const report = (orders.data || []).reduce((acc, order) => {
    acc.totalOrders += 1;
    acc.salesAmount += Number(order.totalAmount || 0);
    acc.deliveryIncome += Number(order.deliveryFee || 0);
    acc.couponDiscount += Number(order.couponDiscount || 0);
    return acc;
  }, {
    date,
    totalOrders: 0,
    salesAmount: 0,
    deliveryIncome: 0,
    couponDiscount: 0,
    rechargeAmount: 0
  });

  const recharges = await db.collection('recharges').where({
    payTime: _.gte(start).and(_.lte(end))
  }).get();
  report.rechargeAmount = (recharges.data || []).reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const old = await db.collection('dailyReports').where({ date }).limit(1).get();
  if (old.data[0]) {
    await db.collection('dailyReports').doc(old.data[0]._id).update({ data: report });
    return { success: true, reportId: old.data[0]._id, report };
  }
  const res = await db.collection('dailyReports').add({ data: report });
  return { success: true, reportId: res._id, report };
};
