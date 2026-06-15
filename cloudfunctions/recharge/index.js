const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const _ = db.command;

exports.main = async event => {
  const wxContext = cloud.getWXContext();
  const plan = event.plan || {};
  const amount = Number(plan.amount || 0);
  const giftAmount = Number(plan.giftAmount || plan.gift || 0);
  const userId = event.userId || wxContext.OPENID;

  await db.collection('recharges').add({
    data: {
      userId,
      amount,
      giftAmount,
      payMethod: event.payMethod || 'wechat',
      payTime: db.serverDate()
    }
  });

  const users = await db.collection('users').where({ openid: userId }).limit(1).get();
  if (users.data[0]) {
    await db.collection('users').doc(users.data[0]._id).update({
      data: {
        balance: _.inc(amount + giftAmount),
        isMember: true
      }
    });
  }

  if (plan.couponId) {
    await db.collection('userCoupons').add({
      data: {
        userId,
        couponId: plan.couponId,
        name: plan.couponName || '充值赠券',
        status: 'unused',
        receiveTime: db.serverDate(),
        expireTime: '',
        usedOrderId: '',
        source: '充值赠送'
      }
    });
  }

  return { success: true };
};
