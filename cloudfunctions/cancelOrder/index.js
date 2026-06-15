const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async event => {
  const { orderId, reason = '' } = event;
  if (!orderId) throw new Error('orderId is required');

  await cloud.database().collection('orders').doc(orderId).update({
    data: {
      status: 'cancelled',
      cancelReason: reason,
      cancelTime: cloud.database().serverDate()
    }
  });

  return { success: true };
};
