const createAdminListPage = require('../_shared/crudPage.js');

createAdminListPage({
  title: '轮播图管理',
  collection: 'banners',
  orderBy: { field: 'sort', direction: 'asc' },
  fields: [
    { key: 'image', label: '图片URL' },
    { key: 'link', label: '跳转链接' },
    { key: 'sort', label: '排序', type: 'number' },
    { key: 'status', label: '启用(true/false)', type: 'boolean', defaultValue: 'true' }
  ]
});
