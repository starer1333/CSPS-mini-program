const app = getApp();

Page({
  data: {
    rules: [
      { amount: 300, gift: 30, coupon: '经典牛排券' },
      { amount: 500, gift: 60, coupon: null },
      { amount: 1000, gift: 150, coupon: '小吃券' },
      { amount: 2000, gift: 400, coupon: '至尊披萨券' }
    ],
    selectedRuleIndex: null
  },

  selectRule(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ selectedRuleIndex: index });
  },

  doRecharge() {
    const rule = this.data.rules[this.data.selectedRuleIndex];
    wx.showModal({
      title: '模拟支付',
      content: `支付 ¥${rule.amount}`,
      success: (res) => {
        if (res.confirm) {
          // 增加余额
          const global = app.globalData;
          global.balance = (global.balance || 0) + rule.amount + rule.gift;
          global.isMember = true;
          
          // 赠送优惠券
          if (rule.coupon) {
            this.giveCoupon(rule.coupon);
          }
          
          wx.showToast({ title: '充值成功', icon: 'success' });
          setTimeout(() => wx.navigateBack(), 1500);
        }
      }
    });
  },

  giveCoupon(couponName) {
    const couponTemplates = {
      '经典牛排券': { dishId: 'st1', dishName: '澳洲谷饲牛排', value: 0 },
      '小吃券': { dishId: 's1', dishName: '香酥鸡翅', value: 0 },
      '至尊披萨券': { dishId: 'p1', dishName: '招财进宝松茸火腿耗牛比萨', value: 0 }
    };
    const template = couponTemplates[couponName];
    if (!template) return;
    
    const newCoupon = {
      id: Date.now() + Math.random().toString(36).substr(2, 5),
      name: couponName,
      dishId: template.dishId,
      dishName: template.dishName,
      value: template.value,
      status: 'unused',
      expireDate: '2025-12-31',
      source: '充值赠送'
    };
    
    let coupons = wx.getStorageSync('userCoupons') || [];
    coupons.push(newCoupon);
    wx.setStorageSync('userCoupons', coupons);
  }
});