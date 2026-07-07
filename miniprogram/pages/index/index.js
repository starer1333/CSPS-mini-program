const app = getApp();
const storeService = require('../../services/storeService.js');

Page({
  data: {
    banners: [],
    storeSettings: {}
  },
  onShow() {
    this.loadHomeData();
    wx.setStorageSync('configDirty', false);
  },
  async loadHomeData() {
    const [banners, storeSettings] = await Promise.all([
      storeService.getBanners(),
      storeService.getStoreSettings()
    ]);
    app.globalData.deliveryConfig = storeSettings.deliveryConfig;
    app.globalData.storeSettings = storeSettings;
    this.setData({ banners, storeSettings });
  },
  selectMeal(e) {
    const type = e.currentTarget.dataset.type;
    if (type === 'dinein') {
      // 堂食：跳转到扫码页面
      wx.navigateTo({ url: '/pages/scan/scan' });
    } else {
      // 外卖或自取：保存用餐方式到全局，直接跳点餐
      app.globalData.mealInfo = { type: type };
      wx.switchTab({ url: '/pages/order/order' });
    }
  }
});
