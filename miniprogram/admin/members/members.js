const createAdminListPage = require('../_shared/crudPage.js');

createAdminListPage({
  title: '会员管理',
  collection: 'users',
  orderBy: { field: 'registerTime', direction: 'desc' },
  fields: [
    { key: 'nickname', label: '昵称' },
    { key: 'phone', label: '手机号' },
    { key: 'balance', label: '余额', type: 'number' },
    { key: 'points', label: '积分', type: 'number' },
    { key: 'status', label: '状态', defaultValue: 'normal' }
  ]
});
