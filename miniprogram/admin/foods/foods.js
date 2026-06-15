const createAdminListPage = require('../_shared/crudPage.js');

createAdminListPage({
  title: '菜品管理',
  collection: 'foods',
  orderBy: { field: 'sort', direction: 'asc' },
  fields: [
    { key: 'name', label: '菜品名称' },
    { key: 'categoryId', label: '主分类ID' },
    { key: 'subCategoryId', label: '子分类ID' },
    { key: 'normalPrice', label: '普通价', type: 'number' },
    { key: 'memberPrice', label: '会员价', type: 'number' },
    { key: 'image', label: '图片URL' },
    { key: 'sort', label: '排序', type: 'number' },
    { key: 'status', label: '上架(true/false)', type: 'boolean', defaultValue: 'true' }
  ]
});
