const foodService = require('../../services/foodService.js');

Page({
  data: {
    mainCategories: [],
    subCategories: {},
    allDishes: {},
    activeMainIndex: 0,
    activeSubName: '',
    currentDishes: [],
    cart: {},
    cartCount: 0,
    cartTotal: 0
  },

  onLoad() {
    this.loadMenu();
    this.loadCart();
  },

  onShow() {
    this.loadCart();
  },

  async loadMenu() {
    wx.showLoading({ title: '加载菜单' });
    try {
      const menu = await foodService.getMenuData();
      this.setData({
        mainCategories: menu.mainCategories,
        subCategories: menu.subCategories,
        allDishes: menu.allDishes
      }, () => {
        this.initMainCategory(0);
      });
    } finally {
      wx.hideLoading();
    }
  },

  initMainCategory(index) {
    const mainName = this.data.mainCategories[index];
    if (!mainName) return;
    let subName = '';
    if (this.data.subCategories[mainName] && this.data.subCategories[mainName].length > 0) {
      subName = this.data.subCategories[mainName][0];
    }
    this.setData({
      activeMainIndex: index,
      activeSubName: subName
    }, () => {
      this.loadDishesByCategory();
    });
  },

  loadDishesByCategory() {
    const mainName = this.data.mainCategories[this.data.activeMainIndex];
    let dishes = [];
    if (this.data.subCategories[mainName]) {
      dishes = this.data.allDishes[this.data.activeSubName] || [];
    } else {
      dishes = this.data.allDishes[mainName] || [];
    }
    this.setData({ currentDishes: dishes });
  },

  selectMainCategory(e) {
    const index = e.currentTarget.dataset.index;
    this.initMainCategory(index);
  },

  selectSubCategory(e) {
    const subName = e.currentTarget.dataset.name;
    this.setData({ activeSubName: subName }, () => {
      this.loadDishesByCategory();
    });
  },

  loadCart() {
    const cart = wx.getStorageSync('cart') || {};
    let count = 0;
    let total = 0;
    Object.keys(cart).forEach(key => {
      count += cart[key].quantity;
      total += parseFloat(cart[key].totalPrice);
    });
    this.setData({
      cart,
      cartCount: count,
      cartTotal: total.toFixed(2)
    });
  },

  addToCart(e) {
    e.stopPropagation();
    const dishId = e.currentTarget.dataset.id;
    const dish = this.data.currentDishes.find(d => d.id === dishId);
    if (dish) {
      wx.navigateTo({
        url: `/pages/dishDetail/dishDetail?id=${dishId}`
      });
    }
  },

  goToDetail(e) {
    const dishId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/dishDetail/dishDetail?id=${dishId}`
    });
  },

  goToCheckout() {
    wx.navigateTo({
      url: '/pages/checkout/checkout'
    });
  },

  // 显示购物车浮层（新增）
  showCartPopup() {
    const cartPopup = this.selectComponent('#cartPopup');
    if (cartPopup) {
      cartPopup.show();
    }
  }
});
