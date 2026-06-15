const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();

exports.main = async event => {
  const wxContext = cloud.getWXContext();
  const coupon = {
    userId: event.userId || wxContext.OPENID,
    couponId: event.couponId || '',
    name: event.name || '优惠券',
    status: 'unused',
    receiveTime: db.serverDate(),
    expireTime: event.expireTime || event.expireDate || '',
    usedOrderId: '',
    source: event.source || '系统发放'
  };
  const res = await db.collection('userCoupons').add({ data: coupon });
  return { success: true, couponId: res._id };
};
