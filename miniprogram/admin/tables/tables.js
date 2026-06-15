const createAdminListPage = require('../_shared/crudPage.js');

createAdminListPage({
  title: '桌号管理',
  collection: 'tables',
  orderBy: { field: 'tableNo', direction: 'asc' },
  fields: [
    { key: 'tableNo', label: '桌号' },
    { key: 'qrCode', label: '二维码URL' },
    { key: 'status', label: '启用(true/false)', type: 'boolean', defaultValue: 'true' }
  ]
});
