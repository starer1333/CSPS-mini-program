const orderService = require('../../services/orderService.js');

Page({
  data: {
    order: null
  },
  async onLoad(options) {
    const orderId = options.id;
    await this.loadOrder(orderId);
  },
  async loadOrder(orderId) {
    const order = await orderService.getOrder(orderId);
    this.setData({ order });
  },
  reorder() {
    const cart = orderService.buildCartFromOrder(this.data.order);
    wx.setStorageSync('cart', cart);
    wx.switchTab({ url: '/pages/order/order' });
  }
});
