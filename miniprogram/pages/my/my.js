const app = getApp();
const userService = require('../../services/userService.js');
const couponService = require('../../services/couponService.js');

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
  async loadUserData() {
    let user = userService.localUser();
    if (!user && app.globalData.userInfo) {
      user = {
        nickname: app.globalData.userInfo.nickName,
        avatarUrl: app.globalData.userInfo.avatarUrl,
        balance: app.globalData.balance,
        points: app.globalData.points
      };
    }
    if (user) {
      const coupons = await couponService.listUserCoupons(user._id || user.openid);
      userService.syncToGlobal(app, user);
      this.setData({
        userInfo: {
          nickName: user.nickname,
          avatarUrl: user.avatarUrl
        },
        isMember: Number(user.balance || 0) > 0,
        balance: user.balance || 0,
        points: user.points || 0,
        couponCount: coupons.filter(item => item.status === 'unused').length
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
        userService.login().then(() => {
          return userService.updateProfile(res.userInfo);
        }).then(user => {
          userService.syncToGlobal(app, user);
          this.loadUserData();
          wx.showToast({ title: '登录成功', icon: 'success' });
        });
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
  },
  goToAdmin() {
    wx.navigateTo({ url: '/admin/dashboard/dashboard' });
  }
});
