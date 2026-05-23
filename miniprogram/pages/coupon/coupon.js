Page({
  data: {
    currentTab: 0,
    coupons: [],
    filteredCoupons: []
  },

  onShow() {
    this.loadCoupons();
  },

  loadCoupons() {
    const coupons = wx.getStorageSync('userCoupons') || [];
    this.setData({ coupons }, () => {
      this.filterCoupons();
    });
  },

  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ currentTab: index }, () => {
      this.filterCoupons();
    });
  },

  filterCoupons() {
    const now = new Date();
    const all = this.data.coupons;
    let filtered = [];

    if (this.data.currentTab === 0) { // 未使用：状态为unused且未过期
      filtered = all.filter(c => c.status === 'unused' && new Date(c.expireDate) >= now);
    } else if (this.data.currentTab === 1) { // 已使用
      filtered = all.filter(c => c.status === 'used');
    } else if (this.data.currentTab === 2) { // 已过期：状态为expired或已过期
      filtered = all.filter(c => c.status === 'expired' || new Date(c.expireDate) < now);
    }
    this.setData({ filteredCoupons: filtered });
  }
});