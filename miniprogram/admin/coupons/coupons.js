const createAdminListPage = require('../_shared/crudPage.js');

createAdminListPage({
  title: '优惠券管理',
  collection: 'coupons',
  orderBy: { field: 'createTime', direction: 'desc' },
  fields: [
    { key: 'name', label: '券名称' },
    { key: 'foodId', label: '兑换菜品ID' },
    { key: 'foodName', label: '适用餐品名称' },
    { key: 'description', label: '使用说明', type: 'textarea' },
    { key: 'value', label: '券面值', type: 'number' },
    { key: 'validDays', label: '有效天数', type: 'number' },
    { key: 'expireDate', label: '固定到期日' },
    { key: 'status', label: '启用(true/false)', type: 'boolean', defaultValue: 'true' }
  ]
});
