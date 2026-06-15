function isMember(user) {
  return Number(user && user.balance || 0) > 0;
}

function applyMemberPrice(food, memberEnabled) {
  if (!memberEnabled || !food || !food.hasMemberPrice) {
    return Number(food && food.basePrice || 0);
  }
  return Number(food.memberPrice || food.basePrice || 0);
}

module.exports = {
  isMember,
  applyMemberPrice
};
