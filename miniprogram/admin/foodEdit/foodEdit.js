const createAdminListPage = require('../_shared/crudPage.js');

createAdminListPage({
  title: '规格组管理',
  collection: 'optionGroups',
  orderBy: { field: 'sort', direction: 'asc' },
  fields: [
    { key: 'foodId', label: '菜品ID' },
    { key: 'name', label: '规格组名称' },
    { key: 'type', label: '类型(single/multiple)', defaultValue: 'single' },
    { key: 'required', label: '必选(true/false)', type: 'boolean', defaultValue: 'true' },
    { key: 'sort', label: '排序', type: 'number' }
  ]
});
