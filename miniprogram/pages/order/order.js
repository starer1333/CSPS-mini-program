const dishData = require('../../data/dishes.js');

Page({
  data: {
    mainCategories: [
      '比萨',
      '牛排·沙拉',
      '炸鸡·鱼饼火鸡面',
      '国潮炸鸡',
      '甜品·蛋挞',
      '意面·焗饭·炒饭',
      '汉堡',
      '休闲小吃·拼盘',
      '饮品'
    ],
    subCategories: {
      '比萨': ['爆浆比萨招牌必吃', '12寸比萨', '9英寸铁盘比萨', '9英寸薄饼比萨'],
      '饮品': ['超级果蔬', '手作鲜榨', '古法烤梨', '柠檬茶', '水果茶', '原叶奶茶', '咖啡(冷/热)']
    },
    allDishes: dishData.dishes,
    activeMainIndex: 0,
    activeSubName: '',
    currentDishes: [],
    cart: {},
    cartCount: 0,
    cartTotal: 0
  },

  onLoad() {
    this.initMainCategory(0);
    this.loadCart();
  },

  onShow() {
    this.loadCart();
  },

  initMainCategory(index) {
    const mainName = this.data.mainCategories[index];
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