Page({
  data: {
    orders: []
  },
  onShow() {
    this.loadOrders();
  },
  loadOrders() {
    const orders = wx.getStorageSync('orders') || [];
    this.setData({ orders });
  },
  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/orderDetail/orderDetail?id=${id}`
    });
  }
});