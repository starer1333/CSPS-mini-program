const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async event => {
  const { orderId } = event;
  if (!orderId) throw new Error('orderId is required');

  await cloud.database().collection('orders').doc(orderId).update({
    data: {
      printStatus: 'queued',
      printTime: cloud.database().serverDate()
    }
  });

  return {
    success: true,
    message: '已加入打印队列，请在此函数内接入飞鹅开放接口'
  };
};
