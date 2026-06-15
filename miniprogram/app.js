// app.js
App({
  onLaunch() {
    console.log('小程序启动');
  },
  globalData: {
    userInfo: null,
    isMember: false,
    balance: 0,
    points: 0,
    mealInfo: null,
    userCoupons: [],
    // 配送费配置（商家在后台可手动切换节假日）
    deliveryConfig: {
      normalFee: 5,
      holidayFee: 10,
      freeThreshold: 50,
      isHoliday: false
    },
    adminPassword: '888888'
  }
});
