const adminData = require('../../services/adminDataService.js');

Page({
  data: {
    cloudReady: false,
    foods: [],
    foodNames: [],
    selectedFoodIndex: 0,
    currentFood: null,
    groups: [],
    activeGroupId: '',
    activeGroupName: '',
    groupTypes: ['single', 'multiple'],
    groupTypeLabels: ['单选', '多选'],
    groupTypeIndex: 0,
    groupName: '',
    groupRequired: true,
    editingGroupId: '',
    itemName: '',
    itemPrice: '',
    editingItemId: ''
  },

  async onLoad() {
    await this.loadData();
  },

  async onShow() {
    if (wx.getStorageSync('menuDirty')) {
      await this.loadData();
    }
  },

  async loadData(activeGroupId) {
    wx.showLoading({ title: '加载规格' });
    try {
      const [foodsResult, groupsResult, itemsResult] = await Promise.all([
        adminData.list('foods', { orderBy: { field: 'sort', direction: 'asc' } }),
        adminData.list('optionGroups', { orderBy: { field: 'sort', direction: 'asc' } }),
        adminData.list('optionItems', { orderBy: { field: 'sort', direction: 'asc' } })
      ]);
      const foods = foodsResult.items.filter(item => item.status !== false);
      this._allGroups = groupsResult.items;
      this._allItems = itemsResult.items;
      this.setData({
        foods,
        foodNames: foods.map(item => item.name),
        cloudReady: foodsResult.cloudReady && groupsResult.cloudReady && itemsResult.cloudReady
      });
      this.refreshSelectedFood(activeGroupId);
    } finally {
      wx.hideLoading();
    }
  },

  onFoodChange(e) {
    this.setData({
      selectedFoodIndex: Number(e.detail.value),
      activeGroupId: '',
      activeGroupName: '',
      editingGroupId: '',
      editingItemId: ''
    });
    this.refreshSelectedFood();
  },

  refreshSelectedFood(activeGroupId) {
    const currentFood = this.data.foods[this.data.selectedFoodIndex] || null;
    if (!currentFood) {
      this.setData({ currentFood: null, groups: [] });
      return;
    }
    const foodId = currentFood._id || currentFood.id;
    const groups = (this._allGroups || [])
      .filter(group => group.foodId === foodId && group.status !== false)
      .map(group => {
        const id = group._id || group.id;
        return {
          ...group,
          id,
          typeLabel: group.type === 'multiple' ? '多选' : '单选',
          items: (this._allItems || [])
            .filter(item => item.groupId === id && item.status !== false)
            .map(item => ({ ...item, id: item._id || item.id }))
        };
      });
    const selectedId = activeGroupId || this.data.activeGroupId;
    const active = groups.find(group => group.id === selectedId);
    this.setData({
      currentFood,
      groups,
      activeGroupId: active ? active.id : '',
      activeGroupName: active ? active.name : ''
    });
  },

  onGroupNameInput(e) {
    this.setData({ groupName: e.detail.value });
  },

  onGroupTypeChange(e) {
    this.setData({ groupTypeIndex: Number(e.detail.value) });
  },

  onGroupRequiredChange(e) {
    this.setData({ groupRequired: e.detail.value });
  },

  async saveGroup() {
    const currentFood = this.data.currentFood;
    const name = this.data.groupName.trim();
    if (!currentFood || !name) {
      wx.showToast({ title: '请选择菜品并填写规格组名称', icon: 'none' });
      return;
    }
    const result = await adminData.save('optionGroups', this.data.editingGroupId, {
      foodId: currentFood._id || currentFood.id,
      name,
      type: this.data.groupTypes[this.data.groupTypeIndex],
      required: this.data.groupRequired,
      sort: this.data.groups.length + 1,
      status: true
    });
    this.resetGroupForm();
    await this.loadData(result.record._id || result.record.id);
  },

  selectGroup(e) {
    const id = e.currentTarget.dataset.id;
    const group = this.data.groups.find(item => item.id === id);
    this.setData({
      activeGroupId: id,
      activeGroupName: group ? group.name : '',
      editingItemId: '',
      itemName: '',
      itemPrice: ''
    });
  },

  editGroup(e) {
    const id = e.currentTarget.dataset.id;
    const group = this.data.groups.find(item => item.id === id);
    if (!group) return;
    this.setData({
      editingGroupId: id,
      groupName: group.name,
      groupTypeIndex: group.type === 'multiple' ? 1 : 0,
      groupRequired: group.required !== false,
      activeGroupId: id,
      activeGroupName: group.name
    });
  },

  async deleteGroup(e) {
    const id = e.currentTarget.dataset.id;
    const group = this.data.groups.find(item => item.id === id);
    if (!group) return;
    const confirmed = await confirmDelete(`删除“${group.name}”及其全部规格项？`);
    if (!confirmed) return;
    await Promise.all(group.items.map(item => adminData.remove('optionItems', item.id)));
    await adminData.remove('optionGroups', id);
    this.resetGroupForm();
    await this.loadData();
  },

  resetGroupForm() {
    this.setData({
      editingGroupId: '',
      groupName: '',
      groupTypeIndex: 0,
      groupRequired: true
    });
  },

  onItemNameInput(e) {
    this.setData({ itemName: e.detail.value });
  },

  onItemPriceInput(e) {
    this.setData({ itemPrice: e.detail.value });
  },

  async saveItem() {
    const name = this.data.itemName.trim();
    if (!this.data.activeGroupId || !name) {
      wx.showToast({ title: '请先选择规格组并填写规格项', icon: 'none' });
      return;
    }
    await adminData.save('optionItems', this.data.editingItemId, {
      groupId: this.data.activeGroupId,
      name,
      price: Number(this.data.itemPrice || 0),
      sort: this.activeItems().length + 1,
      status: true
    });
    const activeGroupId = this.data.activeGroupId;
    this.setData({ editingItemId: '', itemName: '', itemPrice: '' });
    await this.loadData(activeGroupId);
  },

  editItem(e) {
    const id = e.currentTarget.dataset.id;
    const item = this.activeItems().find(option => option.id === id);
    if (!item) return;
    this.setData({
      editingItemId: id,
      itemName: item.name,
      itemPrice: String(item.price || 0)
    });
  },

  async deleteItem(e) {
    const id = e.currentTarget.dataset.id;
    const confirmed = await confirmDelete('删除这个规格项？');
    if (!confirmed) return;
    const activeGroupId = this.data.activeGroupId;
    await adminData.remove('optionItems', id);
    await this.loadData(activeGroupId);
  },

  activeItems() {
    const group = this.data.groups.find(item => item.id === this.data.activeGroupId);
    return group ? group.items : [];
  }
});

function confirmDelete(content) {
  return new Promise(resolve => {
    wx.showModal({
      title: '确认删除',
      content,
      success: res => resolve(res.confirm),
      fail: () => resolve(false)
    });
  });
}
