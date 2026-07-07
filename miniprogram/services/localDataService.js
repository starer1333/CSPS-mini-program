const dishData = require('../data/dishes.js');

const MAIN_CATEGORIES = [
  '比萨',
  '牛排·沙拉',
  '炸鸡·鱼饼火鸡面',
  '国潮炸鸡',
  '甜品·蛋挞',
  '意面·焗饭·炒饭',
  '汉堡',
  '休闲小吃·拼盘',
  '饮品'
];

const SUB_CATEGORIES = {
  '比萨': ['爆浆比萨招牌必吃', '12寸比萨', '9英寸铁盘比萨', '9英寸薄饼比萨'],
  '饮品': ['超级果蔬', '手作鲜榨', '古法烤梨', '柠檬茶', '水果茶', '原叶奶茶', '咖啡(冷/热)']
};

const CONFIG_SEEDS = {
  banners: [
    { id: 'banner_1', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=640', sort: 1, status: true },
    { id: 'banner_2', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=640', sort: 2, status: true },
    { id: 'banner_3', image: 'https://images.unsplash.com/photo-1561758033-7e924f619b47?w=640', sort: 3, status: true }
  ],
  rechargePlans: [
    { id: 'recharge_300', amount: 300, giftAmount: 30, couponName: '经典牛排券', status: true },
    { id: 'recharge_500', amount: 500, giftAmount: 60, couponName: '', status: true },
    { id: 'recharge_1000', amount: 1000, giftAmount: 150, couponName: '小吃券', status: true },
    { id: 'recharge_2000', amount: 2000, giftAmount: 400, couponName: '至尊披萨券', status: true }
  ],
  coupons: [
    { id: 'coupon_steak', name: '经典牛排券', foodName: '澳洲M5黑安格斯牛排', validDays: 30, status: true },
    { id: 'coupon_snack', name: '小吃券', foodName: '香酥鸡翅', validDays: 30, status: true },
    { id: 'coupon_pizza', name: '至尊披萨券', foodName: '招牌比萨', validDays: 30, status: true }
  ],
  storeSettings: [
    {
      id: 'store_settings',
      normalDeliveryFee: 5,
      holidayDeliveryFee: 10,
      freeDeliveryAmount: 50,
      pickupLeadMinutes: 40,
      serviceWechat: 'pizza123',
      servicePhone: '',
      isHoliday: false
    }
  ]
};

function storageKey(collection) {
  return `admin_${collection}`;
}

function getCollection(collection) {
  ensureCollection(collection);
  return wx.getStorageSync(storageKey(collection)) || [];
}

function replaceCollection(collection, items) {
  wx.setStorageSync(storageKey(collection), items || []);
  wx.setStorageSync(`adminSeeded_${collection}`, true);
}

function upsert(collection, id, data) {
  const items = getCollection(collection);
  const recordId = id || data._id || data.id || `${collection}_${Date.now()}`;
  const record = { ...data, id: recordId };
  const index = items.findIndex(item => (item._id || item.id) === recordId);
  if (index >= 0) {
    items[index] = { ...items[index], ...record };
  } else {
    items.unshift(record);
  }
  replaceCollection(collection, items);
  return record;
}

function remove(collection, id) {
  const items = getCollection(collection);
  replaceCollection(collection, items.filter(item => (item._id || item.id) !== id));
}

function markPending(collection, pending) {
  wx.setStorageSync(`adminPending_${collection}`, !!pending);
}

function hasPending(collection) {
  return !!wx.getStorageSync(`adminPending_${collection}`);
}

function setLocalMode(collection, enabled) {
  wx.setStorageSync(`adminLocalMode_${collection}`, !!enabled);
}

function isLocalMode(collection) {
  return !!wx.getStorageSync(`adminLocalMode_${collection}`);
}

function ensureCollection(collection) {
  if (['categories', 'foods', 'optionGroups', 'optionItems'].includes(collection)) {
    ensureMenuSeeded();
    return;
  }
  if (wx.getStorageSync(`adminSeeded_${collection}`)) return;
  const existing = wx.getStorageSync(storageKey(collection)) || [];
  replaceCollection(collection, mergeById(CONFIG_SEEDS[collection] || [], existing));
}

function ensureMenuSeeded() {
  if (wx.getStorageSync('adminMenuSeeded')) return;
  const seed = buildMenuSeed();
  Object.keys(seed).forEach(collection => {
    const existing = wx.getStorageSync(storageKey(collection)) || [];
    replaceCollection(collection, mergeById(seed[collection], existing));
  });
  wx.setStorageSync('adminMenuSeeded', true);
  wx.setStorageSync('menuDirty', true);
}

function buildMenuSeed() {
  const categories = [];
  const foods = [];
  const optionGroups = [];
  const optionItems = [];
  const categoryIds = {};

  MAIN_CATEGORIES.forEach((name, index) => {
    const id = `category_main_${index + 1}`;
    categoryIds[name] = id;
    categories.push({ id, name, parentId: '', level: 1, sort: index + 1, status: true });
  });

  Object.keys(SUB_CATEGORIES).forEach(mainName => {
    SUB_CATEGORIES[mainName].forEach((name, index) => {
      const id = `category_sub_${categoryIds[mainName]}_${index + 1}`;
      categoryIds[name] = id;
      categories.push({
        id,
        name,
        parentId: categoryIds[mainName],
        level: 2,
        sort: index + 1,
        status: true
      });
    });
  });

  Object.keys(dishData.dishes).forEach(bucketName => {
    const mainName = findMainCategory(bucketName);
    const categoryId = categoryIds[mainName];
    const subCategoryId = bucketName === mainName ? '' : categoryIds[bucketName];

    dishData.dishes[bucketName].forEach((dish, foodIndex) => {
      foods.push({
        id: dish.id,
        categoryId,
        categoryName: mainName,
        subCategoryId,
        subCategoryName: subCategoryId ? bucketName : '',
        name: dish.name,
        description: dish.description || '',
        image: dish.imageUrl || '',
        normalPrice: Number(dish.basePrice || 0),
        memberPrice: Number(dish.memberPrice || dish.basePrice || 0),
        hasMemberPrice: Number(dish.memberPrice || 0) > 0,
        salesCount: 0,
        status: true,
        sort: foodIndex + 1
      });

      const specs = { ...(dish.specs || {}) };
      if ((!specs.sizes || !specs.sizes.length) && dish.sizes && dish.sizes.length) {
        specs.sizes = dish.sizes.map(size => ({
          name: size.size,
          price: Number(size.price || 0) - Number(dish.basePrice || 0)
        }));
      }

      [
        { key: 'sizes', name: '尺寸', type: 'single' },
        { key: 'crusts', name: '饼底/卷边', type: 'single' },
        { key: 'sauces', name: '酱料/口味', type: 'single' },
        { key: 'toppings', name: '附加配料', type: 'multiple' }
      ].forEach((definition, groupIndex) => {
        const values = specs[definition.key] || [];
        if (!values.length) return;
        const groupId = `group_${dish.id}_${definition.key}`;
        optionGroups.push({
          id: groupId,
          foodId: dish.id,
          name: definition.name,
          type: definition.type,
          required: definition.type === 'single',
          sort: groupIndex + 1,
          status: true
        });
        values.forEach((item, itemIndex) => {
          optionItems.push({
            id: `option_${dish.id}_${definition.key}_${itemIndex + 1}`,
            groupId,
            name: item.name,
            price: Number(item.price || 0),
            sort: itemIndex + 1,
            status: true
          });
        });
      });
    });
  });

  return { categories, foods, optionGroups, optionItems };
}

function findMainCategory(bucketName) {
  const parent = Object.keys(SUB_CATEGORIES).find(name => SUB_CATEGORIES[name].includes(bucketName));
  return parent || bucketName;
}

function mergeById(seed, existing) {
  const map = {};
  (seed || []).forEach(item => {
    map[item._id || item.id] = item;
  });
  (existing || []).forEach(item => {
    map[item._id || item.id] = { ...(map[item._id || item.id] || {}), ...item };
  });
  return Object.keys(map).map(id => map[id]);
}

module.exports = {
  getCollection,
  replaceCollection,
  upsert,
  remove,
  markPending,
  hasPending,
  setLocalMode,
  isLocalMode,
  ensureCollection
};
