const createAdminListPage = require('../_shared/crudPage.js');

createAdminListPage({
  title: '规格项管理',
  collection: 'optionItems',
  orderBy: { field: 'sort', direction: 'asc' },
  fields: [
    { key: 'groupId', label: '规格组ID' },
    { key: 'name', label: '规格项名称' },
    { key: 'price', label: '加价金额', type: 'number' },
    { key: 'sort', label: '排序', type: 'number' },
    { key: 'status', label: '启用(true/false)', type: 'boolean', defaultValue: 'true' }
  ]
});
