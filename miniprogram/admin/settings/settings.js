const createAdminListPage = require('../_shared/crudPage.js');

createAdminListPage({
  title: '门店与支付配置',
  collection: 'storeSettings',
  fields: [
    { key: 'normalDeliveryFee', label: '普通配送费', type: 'number', defaultValue: '5' },
    { key: 'holidayDeliveryFee', label: '节假日配送费', type: 'number', defaultValue: '10' },
    { key: 'freeDeliveryAmount', label: '免配送门槛', type: 'number', defaultValue: '50' },
    { key: 'pickupLeadMinutes', label: '自取提前分钟', type: 'number', defaultValue: '40' },
    { key: 'servicePhone', label: '客服电话' },
    { key: 'serviceWechat', label: '客服微信' },
    { key: 'serviceQr', label: '客服二维码' },
    { key: 'isHoliday', label: '节假日模式(true/false)', type: 'boolean', defaultValue: 'false' },
    { key: 'alipayQR', label: '支付宝收款码' },
    { key: 'feieUser', label: '飞鹅账号' },
    { key: 'feieKey', label: '飞鹅密钥' }
  ]
});
