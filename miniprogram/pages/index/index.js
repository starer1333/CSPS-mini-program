const app = getApp();

Page({
  data: {
    banners: [
      { id: 1, imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=640' },
      { id: 2, imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=640' },
      { id: 3, imageUrl: 'https://images.unsplash.com/photo-1561758033-7e924f619b47?w=640' }
    ]
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