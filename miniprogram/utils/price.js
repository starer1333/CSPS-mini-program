function money(value) {
  const num = Number(value || 0);
  return Math.round(num * 100) / 100;
}

function moneyText(value) {
  return money(value).toFixed(2);
}

function calcCart(cartList) {
  const goodsAmount = cartList.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0);
  const quantity = cartList.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  return {
    goodsAmount: money(goodsAmount),
    goodsAmountText: moneyText(goodsAmount),
    quantity
  };
}

function calcDeliveryFee(diningType, goodsAmount, deliveryConfig) {
  if (diningType !== 'delivery') {
    return 0;
  }
  const config = deliveryConfig || {};
  const baseFee = config.isHoliday ? config.holidayFee : config.normalFee;
  if (Number(goodsAmount) >= Number(config.freeThreshold || 0)) {
    return 0;
  }
  return money(baseFee || 0);
}

function buildOrderNo(prefix = 'CP') {
  const now = new Date();
  const pad = value => String(value).padStart(2, '0');
  const stamp = [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds())
  ].join('');
  return `${prefix}${stamp}${Math.floor(Math.random() * 9000 + 1000)}`;
}

module.exports = {
  money,
  moneyText,
  calcCart,
  calcDeliveryFee,
  buildOrderNo
};
