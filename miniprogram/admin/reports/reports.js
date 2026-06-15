const createAdminListPage = require('../_shared/crudPage.js');

createAdminListPage({
  title: '数据统计',
  collection: 'dailyReports',
  orderBy: { field: 'date', direction: 'desc' },
  fields: [
    { key: 'date', label: '日期' },
    { key: 'totalOrders', label: '订单数', type: 'number' },
    { key: 'salesAmount', label: '销售额', type: 'number' },
    { key: 'deliveryIncome', label: '配送收入', type: 'number' },
    { key: 'couponDiscount', label: '优惠金额', type: 'number' },
    { key: 'rechargeAmount', label: '充值金额', type: 'number' }
  ]
});
