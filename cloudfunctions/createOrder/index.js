const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();

exports.main = async event => {
  const wxContext = cloud.getWXContext();
  const order = {
    ...event.order,
    openid: wxContext.OPENID,
    userId: event.order.userId || wxContext.OPENID,
    hidden: false,
    createTime: db.serverDate(),
    payTime: db.serverDate()
  };
  const items = event.items || [];

  const orderRes = await db.collection('orders').add({ data: order });
  const orderId = orderRes._id;

  await Promise.all(items.map(item => db.collection('orderItems').add({
    data: {
      orderId,
      foodId: item.foodId,
      foodName: item.foodName,
      image: item.image,
      basePrice: Number(item.basePrice || 0),
      quantity: Number(item.quantity || 1),
      finalPrice: Number(item.finalPrice || item.unitPrice || 0),
      selectedOptions: item.selectedOptions || [],
      createTime: db.serverDate()
    }
  })));

  return {
    success: true,
    order: {
      ...order,
      _id: orderId,
      items
    }
  };
};
