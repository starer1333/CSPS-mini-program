const createAdminListPage = require('../_shared/crudPage.js');

createAdminListPage({
  title: '充值活动',
  collection: 'rechargePlans',
  orderBy: { field: 'amount', direction: 'asc' },
  fields: [
    { key: 'amount', label: '充值金额', type: 'number' },
    { key: 'giftAmount', label: '赠送金额', type: 'number' },
    { key: 'couponId', label: '赠送券ID' },
    { key: 'couponName', label: '赠送券名称' },
    { key: 'status', label: '启用(true/false)', type: 'boolean', defaultValue: 'true' }
  ]
});
