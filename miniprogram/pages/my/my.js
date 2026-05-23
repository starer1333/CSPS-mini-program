const app = getApp();

Page({
  data: {
    userInfo: null,
    isMember: false,
    balance: 0,
    points: 0,
    couponCount: 0
  },

  onShow() {
    this.loadUserData();
  },

  // 加载用户数据（从全局或本地模拟）
  loadUserData() {
    const global = app.globalData;
    const userInfo = global.userInfo;
    if (userInfo) {
      this.setData({
        userInfo,
        isMember: global.balance > 0,
        balance: global.balance || 0,
        points: global.points || 0,
        // 模拟优惠券数量，实际应从存储获取
        couponCount: wx.getStorageSync('coupons')?.length || 0
      });
    } else {
      this.setData({ userInfo: null });
    }
  },

  // 登录（获取用户信息）
  login() {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        const userInfo = res.userInfo;
        app.globalData.userInfo = userInfo;
        // 模拟新用户数据
        app.globalData.balance = 0;
        app.globalData.points = 0;
        this.setData({
          userInfo,
          isMember: false,
          balance: 0,
          points: 0,
          couponCount: 0
        });
        wx.showToast({ title: '登录成功', icon: 'success' });
      },
      fail: () => {
        wx.showToast({ title: '您拒绝了授权', icon: 'none' });
      }
    });
  },

  // 功能入口跳转（可根据实际页面替换）
  goToRecharge() {
    wx.navigateTo({ url: '/pages/recharge/recharge' });
  },
  goToInfo() {
    wx.showToast({ title: '开发中', icon: 'none' });
  },
  goToTerms() {
    wx.showToast({ title: '开发中', icon: 'none' });
  },
  goToExchange() {
    wx.showToast({ title: '开发中', icon: 'none' });
  },
  goToCoupons() {
    wx.navigateTo({ url: '/pages/coupon/coupon' });
  }
});