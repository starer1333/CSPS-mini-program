const app = getApp();
const storeService = require('../../services/storeService.js');
const rechargeService = require('../../services/rechargeService.js');
const userService = require('../../services/userService.js');

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

  async onLoad() {
    await this.loadPlans();
  },

  async onShow() {
    await this.loadPlans();
  },

  async loadPlans() {
    const rules = await storeService.getRechargePlans();
    this.setData({ rules, selectedRuleIndex: null });
  },

  selectRule(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ selectedRuleIndex: index });
  },

  async doRecharge() {
    const rule = this.data.rules[this.data.selectedRuleIndex];
    wx.showModal({
      title: '模拟支付',
      content: `支付 ¥${rule.amount}`,
      success: async (res) => {
        if (res.confirm) {
          const result = await rechargeService.recharge(rule);
          if (result.user) {
            userService.syncToGlobal(app, result.user);
          }
          wx.showToast({ title: '充值成功', icon: 'success' });
          setTimeout(() => wx.navigateBack(), 1500);
        }
      }
    });
  }
});
