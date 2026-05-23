// app.js
App({
  onLaunch() {
    console.log('小程序启动');
  },
  globalData: {
    userInfo: null,
    isMember: false, // 会员状态，余额>0时为true
    balance: 0,
    points: 0,
    mealInfo: null,
    userCoupons:[]
  }
});