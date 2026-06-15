const COLLECTIONS = {
  users: 'users',
  categories: 'categories',
  foods: 'foods',
  optionGroups: 'optionGroups',
  optionItems: 'optionItems',
  orders: 'orders',
  orderItems: 'orderItems',
  coupons: 'coupons',
  userCoupons: 'userCoupons',
  rechargePlans: 'rechargePlans',
  recharges: 'recharges',
  banners: 'banners',
  tables: 'tables',
  storeSettings: 'storeSettings',
  paymentConfigs: 'paymentConfigs',
  dailyReports: 'dailyReports'
};

const DINING_TYPES = {
  dinein: 'dinein',
  delivery: 'delivery',
  pickup: 'pickup'
};

const ORDER_STATUS_TEXT = {
  pending: '待支付',
  paid: '已付款',
  making: '制作中',
  completed: '已完成',
  cancelled: '已取消'
};

module.exports = {
  COLLECTIONS,
  DINING_TYPES,
  ORDER_STATUS_TEXT
};
