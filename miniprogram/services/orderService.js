const cloud = require('./cloudService.js');
const { COLLECTIONS, ORDER_STATUS_TEXT } = require('../config/database.js');
const { calcCart, buildOrderNo, money, moneyText } = require('../utils/price.js');

function normalizeDiningType(type, order) {
  if (type === 'takeout') return 'delivery';
  if (type === 'delivery' && order && order.pickupTime && !order.address) return 'pickup';
  return type || 'delivery';
}

function statusText(status) {
  return ORDER_STATUS_TEXT[status] || status || '已付款';
}

function orderStorage() {
  return wx.getStorageSync('orders') || [];
}

function saveOrders(orders) {
  wx.setStorageSync('orders', orders);
}

function selectedOptionsText(options) {
  return (options || []).map(item => item.item || item.name).filter(Boolean).join(' ');
}

function cartItemToOrderItem(item) {
  const selectedOptions = item.selectedOptions || [];
  return {
    foodId: item.foodId || item.dishId,
    foodName: item.foodName || item.dishName,
    image: item.image || item.imageUrl,
    imageUrl: item.imageUrl || item.image,
    basePrice: Number(item.basePrice || item.unitPrice || 0),
    quantity: Number(item.quantity || 1),
    finalPrice: Number(item.finalPrice || item.unitPrice || 0),
    unitPrice: Number(item.unitPrice || item.finalPrice || 0),
    totalPrice: moneyText(item.totalPrice || Number(item.unitPrice || 0) * Number(item.quantity || 1)),
    selectedOptions,
    specsDesc: item.specsDesc || selectedOptionsText(selectedOptions),
    key: item.key
  };
}

function normalizeOrder(order) {
  const diningType = normalizeDiningType(order.diningType || order.mealType, order);
  const items = (order.items || order.orderItems || []).map(cartItemToOrderItem);
  return {
    ...order,
    id: order._id || order.id || order.orderNo,
    orderNo: order.orderNo || order.id,
    status: statusText(order.status),
    statusCode: order.status,
    createTime: order.createTime || '',
    mealType: diningType,
    diningType,
    total: moneyText(order.totalAmount || order.total || 0),
    totalAmount: Number(order.totalAmount || order.total || 0),
    goodsAmount: Number(order.goodsAmount || (Number(order.totalAmount || order.total || 0) - Number(order.deliveryFee || 0))),
    goodsAmountText: moneyText(order.goodsAmount || (Number(order.totalAmount || order.total || 0) - Number(order.deliveryFee || 0))),
    deliveryFee: Number(order.deliveryFee || 0),
    payment: order.payMethod || order.payment || 'wechat',
    items
  };
}

async function createOrder(payload) {
  const cartList = payload.cartList || [];
  const cartSummary = calcCart(cartList);
  const diningType = normalizeDiningType(payload.diningType || payload.mealInfo && payload.mealInfo.type);
  const orderItems = cartList.map(cartItemToOrderItem);
  const orderNo = buildOrderNo();

  const orderPayload = {
    orderNo,
    userId: payload.userId || '',
    diningType,
    status: 'paid',
    tableNo: payload.tableNo || payload.mealInfo && payload.mealInfo.tableNo || '',
    address: payload.address || {},
    pickupTime: payload.pickupTime || '',
    remark: payload.remark || '',
    goodsAmount: cartSummary.goodsAmount,
    deliveryFee: Number(payload.deliveryFee || 0),
    couponDiscount: Number(payload.couponDiscount || 0),
    totalAmount: Number(payload.totalAmount || payload.total || 0),
    payMethod: payload.payMethod || payload.payment || 'wechat',
    payTime: new Date().toISOString(),
    createTime: new Date().toISOString(),
    hidden: false,
    items: orderItems
  };

  try {
    const result = await cloud.callFunction('createOrder', {
      order: orderPayload,
      items: orderItems
    });
    return normalizeOrder(result.order || orderPayload);
  } catch (err) {
    const localOrder = normalizeOrder({
      ...orderPayload,
      id: orderNo,
      createTime: new Date().toLocaleString()
    });
    const orders = orderStorage();
    orders.unshift(localOrder);
    saveOrders(orders);
    return localOrder;
  }
}

async function listOrders(userId) {
  try {
    const orders = await cloud.list(COLLECTIONS.orders, {
      where: userId ? { userId, hidden: false } : { hidden: false },
      orderBy: { field: 'createTime', direction: 'desc' }
    });
    return orders.map(normalizeOrder);
  } catch (err) {
    return orderStorage().filter(item => !item.hidden).map(normalizeOrder);
  }
}

async function getOrder(orderId) {
  const orders = await listOrders();
  return orders.find(order => order.id === orderId || order.orderNo === orderId);
}

function buildCartFromOrder(order) {
  const cart = {};
  (order.items || []).forEach((item, index) => {
    const key = `${item.foodId || item.dishId}-${Date.now()}-${index}`;
    cart[key] = {
      dishId: item.foodId || item.dishId,
      foodId: item.foodId || item.dishId,
      dishName: item.foodName || item.dishName,
      foodName: item.foodName || item.dishName,
      imageUrl: item.imageUrl || item.image,
      image: item.image || item.imageUrl,
      specsDesc: item.specsDesc,
      selectedOptions: item.selectedOptions || [],
      quantity: Number(item.quantity || 1),
      unitPrice: Number(item.unitPrice || item.finalPrice || 0),
      totalPrice: moneyText(item.totalPrice || Number(item.unitPrice || item.finalPrice || 0) * Number(item.quantity || 1))
    };
  });
  return cart;
}

module.exports = {
  createOrder,
  listOrders,
  getOrder,
  buildCartFromOrder,
  normalizeDiningType,
  normalizeOrder
};
