App({
  onLaunch() {
    if (wx.cloud) {
      wx.cloud.init({
        traceUser: true
      });
    }
    this.loadRuntimeSettings();
  },
  async loadRuntimeSettings() {
    try {
      const storeService = require('./services/storeService.js');
      const settings = await storeService.getStoreSettings();
      this.globalData.deliveryConfig = settings.deliveryConfig;
      this.globalData.storeSettings = settings;
    } catch (err) {
      console.warn('门店配置加载失败，使用本地默认配置', err);
    }
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
    storeSettings: null,
    adminPassword: '888888'
  }
});
