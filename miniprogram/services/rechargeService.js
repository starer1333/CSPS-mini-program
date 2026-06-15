const cloud = require('./cloudService.js');
const userService = require('./userService.js');
const couponService = require('./couponService.js');

async function recharge(plan, payMethod = 'wechat') {
  try {
    return await cloud.callFunction('recharge', { plan, payMethod });
  } catch (err) {
    const user = userService.localUser() || await userService.login();
    const amount = Number(plan.amount || 0);
    const giftAmount = Number(plan.giftAmount || plan.gift || 0);
    const nextUser = {
      ...user,
      balance: Number(user.balance || 0) + amount + giftAmount,
      isMember: true
    };
    userService.saveLocalUser(nextUser);

    const records = wx.getStorageSync('recharges') || [];
    records.unshift({
      id: Date.now().toString(),
      userId: nextUser._id || nextUser.openid,
      amount,
      giftAmount,
      payMethod,
      payTime: new Date().toISOString()
    });
    wx.setStorageSync('recharges', records);

    if (plan.coupon || plan.couponId) {
      await couponService.sendCoupon({
        userId: nextUser._id || nextUser.openid,
        couponId: plan.couponId,
        name: plan.coupon || '充值赠券',
        source: '充值赠送',
        expireDate: '2026-12-31'
      });
    }

    return { success: true, user: nextUser };
  }
}

module.exports = {
  recharge
};
