const createAdminListPage = require('../_shared/crudPage.js');

createAdminListPage({
  title: '分类管理',
  collection: 'categories',
  orderBy: { field: 'sort', direction: 'asc' },
  fields: [
    { key: 'name', label: '分类名称' },
    { key: 'parentId', label: '父分类ID' },
    { key: 'level', label: '层级', type: 'number', defaultValue: '1' },
    { key: 'sort', label: '排序', type: 'number' },
    { key: 'status', label: '启用(true/false)', type: 'boolean', defaultValue: 'true' }
  ]
});
