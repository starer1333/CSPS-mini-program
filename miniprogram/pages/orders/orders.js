const orderService = require('../../services/orderService.js');

Page({
  data: {
    orders: []
  },
  onShow() {
    this.loadOrders();
  },
  async loadOrders() {
    const orders = await orderService.listOrders();
    this.setData({ orders });
  },
  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/orderDetail/orderDetail?id=${id}`
    });
  }
});
