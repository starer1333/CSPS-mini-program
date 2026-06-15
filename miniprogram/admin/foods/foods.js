const createAdminListPage = require('../_shared/crudPage.js');

createAdminListPage({
  title: '菜品管理',
  collection: 'foods',
  orderBy: { field: 'sort', direction: 'asc' },
  fields: [
    { key: 'name', label: '菜品名称' },
    { key: 'description', label: '详细介绍', type: 'textarea', placeholder: '例如：主料、口味、份量、推荐理由' },
    { key: 'categoryId', label: '主分类ID' },
    { key: 'categoryName', label: '主分类名称' },
    { key: 'subCategoryId', label: '子分类ID' },
    { key: 'subCategoryName', label: '子分类名称' },
    { key: 'normalPrice', label: '普通价', type: 'number' },
    { key: 'memberPrice', label: '会员价', type: 'number' },
    { key: 'image', label: '图片URL' },
    { key: 'sort', label: '排序', type: 'number' },
    { key: 'status', label: '上架(true/false)', type: 'boolean', defaultValue: 'true' }
  ]
});
