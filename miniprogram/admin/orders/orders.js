const createAdminListPage = require('../_shared/crudPage.js');

createAdminListPage({
  title: '订单管理',
  collection: 'orders',
  orderBy: { field: 'createTime', direction: 'desc' },
  fields: [
    { key: 'orderNo', label: '订单号' },
    { key: 'diningType', label: '用餐方式' },
    { key: 'status', label: '状态' },
    { key: 'tableNo', label: '桌号' },
    { key: 'totalAmount', label: '实付金额', type: 'number' },
    { key: 'deliveryFee', label: '配送费', type: 'number' },
    { key: 'hidden', label: '隐藏(true/false)', type: 'boolean', defaultValue: 'false' }
  ]
});
