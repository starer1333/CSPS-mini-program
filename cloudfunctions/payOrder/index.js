const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();

exports.main = async event => {
  const { orderId, payMethod = 'wechat' } = event;
  if (!orderId) throw new Error('orderId is required');

  await db.collection('orders').doc(orderId).update({
    data: {
      status: 'paid',
      payMethod,
      payTime: db.serverDate()
    }
  });

  return { success: true };
};
