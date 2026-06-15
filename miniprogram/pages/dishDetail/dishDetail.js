const app = getApp();
const foodService = require('../../services/foodService.js');
const { applyMemberPrice } = require('../../utils/member.js');
const { moneyText } = require('../../utils/price.js');

Page({
  data: {
    dish: null,
    selectedSize: 0,
    selectedCrust: 0,
    selectedSauce: 0,
    selectedToppings: [],
    quantity: 1,
    memberPriceTotal: 0,
    normalPriceTotal: 0,
    isMember: false
  },

  async onLoad(options) {
    const id = options.id;
    this.setData({ isMember: app.globalData.isMember });
    await this.loadDish(id);
  },

  async loadDish(id) {
    wx.showLoading({ title: '加载商品' });
    try {
      const dish = await foodService.findFoodById(id);
      if (!dish) {
        wx.showToast({ title: '商品不存在', icon: 'none' });
        setTimeout(() => wx.navigateBack(), 800);
        return;
      }
      this.setData({ dish }, this.calcPrice);
    } finally {
      wx.hideLoading();
    }
  },

  calcPrice() {
    const dish = this.data.dish;
    if (!dish) return;

    const baseMemberPrice = applyMemberPrice(dish, true);
    const baseNormalPrice = dish.basePrice;

    const sizePrice = dish.specs.sizes?.[this.data.selectedSize]?.price || 0;
    const crustPrice = dish.specs.crusts?.[this.data.selectedCrust]?.price || 0;
    const saucePrice = dish.specs.sauces?.[this.data.selectedSauce]?.price || 0;
    let toppingsPrice = 0;
    (this.data.selectedToppings || []).forEach(index => {
      toppingsPrice += dish.specs.toppings?.[index]?.price || 0;
    });

    const extraTotal = sizePrice + crustPrice + saucePrice + toppingsPrice;

    this.setData({
      memberPriceTotal: moneyText((baseMemberPrice + extraTotal) * this.data.quantity),
      normalPriceTotal: moneyText((baseNormalPrice + extraTotal) * this.data.quantity)
    });
  },

  selectSize(e) {
    this.setData({ selectedSize: e.currentTarget.dataset.index }, this.calcPrice);
  },

  selectCrust(e) {
    this.setData({ selectedCrust: e.currentTarget.dataset.index }, this.calcPrice);
  },

  selectSauce(e) {
    this.setData({ selectedSauce: e.currentTarget.dataset.index }, this.calcPrice);
  },

  toggleTopping(e) {
    const index = e.currentTarget.dataset.index;
    let selected = this.data.selectedToppings;
    if (selected.includes(index)) {
      selected = selected.filter(i => i !== index);
    } else {
      selected.push(index);
    }
    this.setData({ selectedToppings: selected }, this.calcPrice);
  },

  decreaseQuantity() {
    if (this.data.quantity > 1) {
      this.setData({ quantity: this.data.quantity - 1 }, this.calcPrice);
    }
  },

  increaseQuantity() {
    this.setData({ quantity: this.data.quantity + 1 }, this.calcPrice);
  },

  addToCart() {
    const dish = this.data.dish;
    const selectedOptions = [];
    const size = dish.specs.sizes?.[this.data.selectedSize];
    const crust = dish.specs.crusts?.[this.data.selectedCrust];
    const sauce = dish.specs.sauces?.[this.data.selectedSauce];

    if (size) selectedOptions.push({ group: '尺寸', item: size.name, price: Number(size.price || 0) });
    if (crust) selectedOptions.push({ group: '饼底/卷边', item: crust.name, price: Number(crust.price || 0) });
    if (sauce) selectedOptions.push({ group: '酱料/口味', item: sauce.name, price: Number(sauce.price || 0) });
    this.data.selectedToppings.forEach(i => {
      const topping = dish.specs.toppings[i];
      if (topping) selectedOptions.push({ group: '附加配料', item: topping.name, price: Number(topping.price || 0) });
    });

    const specsDesc = selectedOptions.map(item => item.item).join(' ');

    const finalPrice = this.data.isMember ? this.data.memberPriceTotal : this.data.normalPriceTotal;
    const unitPrice = Number(finalPrice) / this.data.quantity;

    const cartItem = {
      dishId: dish.id,
      foodId: dish.id,
      dishName: dish.name,
      foodName: dish.name,
      imageUrl: dish.imageUrl,
      image: dish.imageUrl,
      basePrice: dish.basePrice,
      specsDesc: specsDesc,
      selectedOptions,
      quantity: this.data.quantity,
      unitPrice,
      finalPrice: unitPrice,
      totalPrice: parseFloat(finalPrice)
    };

    let cart = wx.getStorageSync('cart') || {};
    const key = `${dish.id}-${this.data.selectedSize}-${this.data.selectedCrust}-${this.data.selectedSauce}-${this.data.selectedToppings.join(',')}`;
    if (cart[key]) {
      cart[key].quantity += this.data.quantity;
      cart[key].totalPrice = (cart[key].unitPrice * cart[key].quantity).toFixed(2);
    } else {
      cart[key] = cartItem;
    }
    wx.setStorageSync('cart', cart);

    wx.showToast({ title: '已加入购物车', icon: 'success' });
    setTimeout(() => wx.navigateBack(), 1500);
  }
});
