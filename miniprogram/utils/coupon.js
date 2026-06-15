function isExpired(coupon) {
  const expire = coupon && (coupon.expireTime || coupon.expireDate);
  if (!expire) {
    return false;
  }
  return new Date(expire).getTime() < Date.now();
}

function normalizeUserCoupon(coupon) {
  const expire = coupon.expireTime || coupon.expireDate || '';
  return {
    ...coupon,
    id: coupon._id || coupon.id,
    couponId: coupon.couponId,
    status: isExpired(coupon) && coupon.status === 'unused' ? 'expired' : coupon.status,
    expireDate: expire ? String(expire).slice(0, 10) : ''
  };
}

module.exports = {
  isExpired,
  normalizeUserCoupon
};
