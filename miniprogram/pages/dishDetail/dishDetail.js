const app = getApp();

Page({
  data: {
    dish: null,
    selectedSize: 0,
    selectedCrust: 0,
    selectedToppings: [],
    quantity: 1,
    memberPriceTotal: 0,
    normalPriceTotal: 0,
    isMember: false
  },

  onLoad(options) {
    const id = options.id;
    this.setData({ isMember: app.globalData.isMember });
    this.loadDish(id);
  },

  loadDish(id) {
    // 模拟数据，实际应从全局或数据文件获取
    const allDishes = {
      'p1': {
        id: 'p1',
        name: '招财进宝松茸火腿耗牛比萨',
        description: '松茸+火腿+耗牛，珍馐美味',
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=640',
        basePrice: 88,
        memberPrice: 78,
        specs: {
          sizes: [
            { name: '9寸', price: 0 },
            { name: '12寸', price: 29 }
          ],
          crusts: [
            { name: '经典手拍', price: 0 },
            { name: '芝香烤肠卷边', price: 15 },
            { name: '酸奶卷边', price: 12 },
            { name: '芋泥卷边', price: 15 },
            { name: '金沙咸蛋黄卷边', price: 15 },
            { name: '薯蓉卷边', price: 10 }
          ],
          toppings: [
            { name: '预炸裹浆虾仁', price: 8 },
            { name: '番茄炖牛腩', price: 10 },
            { name: '培根', price: 6 }
          ]
        }
      },
      // 其他菜品略（可按需添加）
    };
    const dish = allDishes[id] || allDishes['p1']; // 临时默认
    this.setData({ dish }, this.calcPrice);
  },

  calcPrice() {
    const dish = this.data.dish;
    if (!dish) return;

    const baseMemberPrice = dish.memberPrice || dish.basePrice;
    const baseNormalPrice = dish.basePrice;

    const sizePrice = dish.specs.sizes?.[this.data.selectedSize]?.price || 0;
    const crustPrice = dish.specs.crusts?.[this.data.selectedCrust]?.price || 0;
    let toppingsPrice = 0;
    (this.data.selectedToppings || []).forEach(index => {
      toppingsPrice += dish.specs.toppings?.[index]?.price || 0;
    });

    const extraTotal = sizePrice + crustPrice + toppingsPrice;

    this.setData({
      memberPriceTotal: ((baseMemberPrice + extraTotal) * this.data.quantity).toFixed(2),
      normalPriceTotal: ((baseNormalPrice + extraTotal) * this.data.quantity).toFixed(2)
    });
  },

  selectSize(e) {
    this.setData({ selectedSize: e.currentTarget.dataset.index }, this.calcPrice);
  },

  selectCrust(e) {
    this.setData({ selectedCrust: e.currentTarget.dataset.index }, this.calcPrice);
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
    const sizeName = dish.specs.sizes?.[this.data.selectedSize]?.name || '';
    const crustName = dish.specs.crusts?.[this.data.selectedCrust]?.name || '';
    const toppingsNames = this.data.selectedToppings.map(i => dish.specs.toppings[i].name).join('、');
    const specsDesc = [sizeName, crustName, toppingsNames].filter(s => s).join(' ');

    const finalPrice = this.data.isMember ? this.data.memberPriceTotal : this.data.normalPriceTotal;

    const cartItem = {
      dishId: dish.id,
      dishName: dish.name,
      imageUrl: dish.imageUrl,
      specsDesc: specsDesc,
      quantity: this.data.quantity,
      unitPrice: finalPrice / this.data.quantity,
      totalPrice: parseFloat(finalPrice)
    };

    let cart = wx.getStorageSync('cart') || {};
    const key = `${dish.id}-${this.data.selectedSize}-${this.data.selectedCrust}-${this.data.selectedToppings.join(',')}`;
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