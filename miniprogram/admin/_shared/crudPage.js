const adminData = require('../../services/adminDataService.js');

function createAdminListPage(config) {
  Page({
    data: {
      title: config.title,
      collection: config.collection,
      fields: config.fields,
      rows: [],
      formFields: [],
      editingId: '',
      loading: true,
      cloudReady: false,
      relatedPath: config.relatedPath || '',
      relatedLabel: config.relatedLabel || ''
    },

    onLoad() {
      this.resetForm();
      this.loadData();
    },

    resetForm() {
      this.setData({
        editingId: '',
        formFields: config.fields.map(field => ({
          ...field,
          value: field.defaultValue || ''
        }))
      });
    },

    async loadData() {
      this.setData({ loading: true });
      try {
        const result = await adminData.list(config.collection, config.orderBy ? {
          orderBy: config.orderBy
        } : {});
        this.setRows(result.items);
        this.setData({ cloudReady: result.cloudReady });
      } finally {
        this.setData({ loading: false });
      }
    },

    setRows(items) {
      const rows = (items || []).map(item => ({
        id: item._id || item.id,
        raw: item,
        cells: [
          { label: '系统ID', value: item._id || item.id || '-' },
          ...config.fields.map(field => ({
            label: field.label,
            value: formatValue(item[field.key])
          }))
        ]
      }));
      this.setData({ rows });
    },

    onInput(e) {
      const key = e.currentTarget.dataset.key;
      const formFields = this.data.formFields.map(field => {
        if (field.key !== key) return field;
        return { ...field, value: e.detail.value };
      });
      this.setData({ formFields });
    },

    editItem(e) {
      const id = e.currentTarget.dataset.id;
      const row = this.data.rows.find(item => item.id === id);
      if (!row) return;
      const formFields = config.fields.map(field => ({
        ...field,
        value: row.raw[field.key] === undefined ? '' : row.raw[field.key]
      }));
      this.setData({ editingId: id, formFields });
    },

    async saveItem() {
      const data = {};
      this.data.formFields.forEach(field => {
        data[field.key] = castValue(field.value, field.type);
      });
      if (!data.createTime) {
        data.createTime = new Date().toISOString();
      }

      await adminData.save(config.collection, this.data.editingId, data);

      wx.showToast({ title: '已保存', icon: 'success' });
      this.resetForm();
      this.loadData();
    },

    async removeItem(e) {
      const id = e.currentTarget.dataset.id;
      wx.showModal({
        title: '确认删除',
        content: '删除后前台将不再展示该数据',
        success: async res => {
          if (!res.confirm) return;
          await adminData.remove(config.collection, id);
          this.loadData();
        }
      });
    },

    cancelEdit() {
      this.resetForm();
    },

    goRelated() {
      if (config.relatedPath) {
        wx.navigateTo({ url: config.relatedPath });
      }
    }
  });
}

function castValue(value, type) {
  if (type === 'number') return Number(value || 0);
  if (type === 'boolean') return value === true || value === 'true' || value === '1';
  return value;
}

function formatValue(value) {
  if (value === undefined || value === null || value === '') return '-';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

module.exports = createAdminListPage;
