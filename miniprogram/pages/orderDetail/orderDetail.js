Page({
  data: {
    order: null
  },
  onLoad(options) {
    const orderId = options.id;
    this.loadOrder(orderId);
  },
  loadOrder(orderId) {
    const orders = wx.getStorageSync('orders') || [];
    const order = orders.find(o => o.id === orderId);
    this.setData({ order });
  },
  reorder() {
    const cart = {};
    this.data.order.items.forEach(item => {
      const key = `${item.dishId}-${Date.now()}-${Math.random()}`;
      cart[key] = item;
    });
    wx.setStorageSync('cart', cart);
    wx.switchTab({ url: '/pages/order/order' });
  }
});