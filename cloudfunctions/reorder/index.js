const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async event => {
  const { orderId } = event;
  if (!orderId) throw new Error('orderId is required');

  const res = await cloud.database().collection('orderItems').where({ orderId }).get();
  return {
    success: true,
    items: res.data || []
  };
};
