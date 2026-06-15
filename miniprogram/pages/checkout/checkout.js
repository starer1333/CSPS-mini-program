const app = getApp();
const orderService = require('../../services/orderService.js');
const { calcDeliveryFee, moneyText } = require('../../utils/price.js');

Page({
  data: {
    cartList: [],
    subTotal: 0,
    deliveryFee: 0,
    total: 0,
    remark: '',
    payment: 'wechat',
    mealInfo: null,
    address: '',
    pickupTime: '',
    deliveryConfig: null
  },
  onLoad() {
    this.setData({ deliveryConfig: app.globalData.deliveryConfig });
    this.loadCart();
    this.updateMealInfo();
  },
  onShow() {
    this.updateMealInfo();
    this.loadCart();
  },
  updateMealInfo() {
    const mealInfo = app.globalData.mealInfo;
    this.setData({ mealInfo }, () => {
      this.calcDeliveryFee();
    });
    if (mealInfo) {
      if (mealInfo.type === 'delivery') {
        this.setData({ address: '', pickupTime: '' });
      } else if (mealInfo.type === 'pickup') {
        this.setData({ address: '', pickupTime: '' });
      } else if (mealInfo.type === 'dinein') {
        this.setData({ address: '', pickupTime: '' });
      }
    }
  },
  loadCart() {
    const cart = wx.getStorageSync('cart') || {};
    const cartList = Object.keys(cart).map(key => ({
      key,
      ...cart[key]
    }));
    let subTotal = 0;
    cartList.forEach(item => {
      subTotal += parseFloat(item.totalPrice);
    });
    this.setData({
      cartList,
      subTotal: subTotal.toFixed(2)
    }, () => {
      this.calcDeliveryFee();
    });
  },
  calcDeliveryFee() {
    const { mealInfo, subTotal, deliveryConfig } = this.data;
    if (!deliveryConfig) return;

    const fee = calcDeliveryFee(mealInfo && mealInfo.type, subTotal, deliveryConfig);
    this.setData({
      deliveryFee: fee,
      total: moneyText(parseFloat(subTotal) + fee)
    });
  },
  onRemarkInput(e) {
    this.setData({ remark: e.detail.value });
  },
  onAddressInput(e) {
    this.setData({ address: e.detail.value });
  },
  // ✅ 新增：自取时间手动输入
  onPickupTimeInput(e) {
    this.setData({ pickupTime: e.detail.value });
  },
  selectPayment(e) {
    this.setData({ payment: e.currentTarget.dataset.type });
  },
  submitOrder() {
    if (!this.data.mealInfo) {
      wx.showToast({ title: '请先选择用餐方式', icon: 'none' });
      return;
    }
    const type = this.data.mealInfo.type;
    if (type === 'dinein' && !this.data.mealInfo.tableNo) {
      wx.showToast({ title: '请先扫描桌号', icon: 'none' });
      return;
    }
    if (type === 'delivery' && !this.data.address) {
      wx.showToast({ title: '请填写外卖地址', icon: 'none' });
      return;
    }
    if (type === 'pickup' && !this.data.pickupTime) {
      wx.showToast({ title: '请填写自取时间', icon: 'none' });
      return;
    }
    wx.showModal({
      title: '确认支付',
      content: `支付金额 ¥${this.data.total}`,
      success: (res) => {
        if (res.confirm) {
          this.createOrder();
        }
      }
    });
  },
  async createOrder() {
    await orderService.createOrder({
      cartList: this.data.cartList,
      mealInfo: this.data.mealInfo,
      diningType: this.data.mealInfo.type,
      tableNo: this.data.mealInfo.tableNo || '',
      address: this.data.address ? { detail: this.data.address } : {},
      pickupTime: this.data.pickupTime,
      remark: this.data.remark,
      payment: this.data.payment,
      deliveryFee: this.data.deliveryFee,
      totalAmount: Number(this.data.total)
    });
    wx.setStorageSync('cart', {});
    wx.showToast({ title: '下单成功', icon: 'success' });
    setTimeout(() => {
      wx.switchTab({ url: '/pages/orders/orders' });
    }, 1500);
  }
});
