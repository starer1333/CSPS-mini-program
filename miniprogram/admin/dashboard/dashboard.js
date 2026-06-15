Page({
  data: {
    menus: [
      { title: '菜品管理', desc: '菜品上下架与价格', path: '/admin/foods/foods' },
      { title: '分类管理', desc: '主分类和子分类', path: '/admin/categories/categories' },
      { title: '订单管理', desc: '订单状态与隐藏', path: '/admin/orders/orders' },
      { title: '会员管理', desc: '余额积分与状态', path: '/admin/members/members' },
      { title: '优惠券管理', desc: '券模板与发放', path: '/admin/coupons/coupons' },
      { title: '充值活动', desc: '金额赠送与赠券', path: '/admin/recharges/recharges' },
      { title: '桌号管理', desc: '堂食二维码桌号', path: '/admin/tables/tables' },
      { title: '轮播图管理', desc: '首页广告配置', path: '/admin/banners/banners' },
      { title: '打印机配置', desc: '飞鹅与支付宝配置', path: '/admin/settings/settings' },
      { title: '数据统计', desc: '日报销售统计', path: '/admin/reports/reports' }
    ]
  },

  goPage(e) {
    wx.navigateTo({ url: e.currentTarget.dataset.path });
  }
});
