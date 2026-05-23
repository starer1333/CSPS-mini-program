Component({
  data: {
    visible: false,
    cartList: [],
    total: 0
  },
  lifetimes: {
    attached() {
      this.loadCart();
    }
  },
  methods: {
    loadCart() {
      const cart = wx.getStorageSync('cart') || {};
      const cartList = Object.keys(cart).map(key => ({
        key,
        ...cart[key]
      }));
      let total = 0;
      cartList.forEach(item => {
        total += parseFloat(item.totalPrice);
      });
      this.setData({ cartList, total: total.toFixed(2) });
    },
    show() {
      this.setData({ visible: true });
      this.loadCart();
    },
    hide() {
      this.setData({ visible: false });
    },
    increase(e) {
      const key = e.currentTarget.dataset.key;
      let cart = wx.getStorageSync('cart') || {};
      if (cart[key]) {
        cart[key].quantity++;
        cart[key].totalPrice = (cart[key].unitPrice * cart[key].quantity).toFixed(2);
        wx.setStorageSync('cart', cart);
        this.loadCart();
        this.triggerEvent('cartchange'); // 通知页面更新底部栏
      }
    },
    decrease(e) {
      const key = e.currentTarget.dataset.key;
      let cart = wx.getStorageSync('cart') || {};
      if (cart[key] && cart[key].quantity > 1) {
        cart[key].quantity--;
        cart[key].totalPrice = (cart[key].unitPrice * cart[key].quantity).toFixed(2);
        wx.setStorageSync('cart', cart);
        this.loadCart();
        this.triggerEvent('cartchange');
      } else {
        delete cart[key];
        wx.setStorageSync('cart', cart);
        this.loadCart();
        this.triggerEvent('cartchange');
      }
    },
    remove(e) {
      const key = e.currentTarget.dataset.key;
      let cart = wx.getStorageSync('cart') || {};
      delete cart[key];
      wx.setStorageSync('cart', cart);
      this.loadCart();
      this.triggerEvent('cartchange');
    },
    goToCheckout() {
      wx.navigateTo({ url: '/pages/checkout/checkout' });
      this.hide();
    }
  }
});