const foodService = require('../../services/foodService.js');
const app = getApp();
const { applyMemberPrice } = require('../../utils/member.js');
const { moneyText } = require('../../utils/price.js');

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
    if (wx.getStorageSync('menuDirty')) {
      this.loadMenu(true);
    }
    this.loadCart();
  },

  async loadMenu(force = false) {
    wx.showLoading({ title: '加载菜单' });
    try {
      const menu = await foodService.getMenuData(force);
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
    const dishId = e.currentTarget.dataset.id;
    const dish = this.data.currentDishes.find(d => d.id === dishId);
    if (!dish) return;

    const cartItem = this.buildDefaultCartItem(dish);
    const key = this.buildCartKey(dish, cartItem.selectedOptions);
    const cart = wx.getStorageSync('cart') || {};
    if (cart[key]) {
      cart[key].quantity += 1;
      cart[key].totalPrice = moneyText(cart[key].unitPrice * cart[key].quantity);
    } else {
      cart[key] = cartItem;
    }
    wx.setStorageSync('cart', cart);
    this.loadCart();
    wx.showToast({ title: '已加入购物车', icon: 'success' });
  },

  buildDefaultCartItem(dish) {
    const selectedOptions = [];
    const specs = dish.specs || {};
    const singleGroups = [
      { key: 'sizes', label: '尺寸' },
      { key: 'crusts', label: '饼底/卷边' },
      { key: 'sauces', label: '酱料/口味' }
    ];

    singleGroups.forEach(group => {
      const item = specs[group.key] && specs[group.key][0];
      if (item) {
        selectedOptions.push({
          group: item.group || group.label,
          item: item.name,
          price: Number(item.price || 0)
        });
      }
    });

    const extraPrice = selectedOptions.reduce((sum, item) => sum + Number(item.price || 0), 0);
    const basePrice = applyMemberPrice(dish, app.globalData.isMember);
    const unitPrice = Number(basePrice || 0) + extraPrice;
    const specsDesc = selectedOptions.map(item => item.item).join(' ');

    return {
      dishId: dish.id,
      foodId: dish.id,
      dishName: dish.name,
      foodName: dish.name,
      imageUrl: dish.imageUrl,
      image: dish.imageUrl,
      basePrice: dish.basePrice,
      specsDesc,
      selectedOptions,
      quantity: 1,
      unitPrice,
      finalPrice: unitPrice,
      totalPrice: moneyText(unitPrice)
    };
  },

  buildCartKey(dish, selectedOptions) {
    const optionKey = selectedOptions.map(item => `${item.group}:${item.item}`).join('|');
    return `${dish.id}-${optionKey || 'default'}`;
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
