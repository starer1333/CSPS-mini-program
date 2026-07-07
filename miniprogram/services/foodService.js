const dishData = require('../data/dishes.js');
const cloud = require('./cloudService.js');
const localData = require('./localDataService.js');
const { COLLECTIONS } = require('../config/database.js');

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

let menuCache = null;

function sortBySortField(a, b) {
  return Number(a.sort || 0) - Number(b.sort || 0);
}

function groupKey(name) {
  if (/尺寸|规格|份量/.test(name)) return 'sizes';
  if (/卷边|饼底/.test(name)) return 'crusts';
  if (/酱|口味/.test(name)) return 'sauces';
  if (/配料|加料|小料/.test(name)) return 'toppings';
  return 'extras';
}

function normalizeFood(food, groups = [], itemsByGroupId = {}) {
  const specs = {
    sizes: [],
    crusts: [],
    sauces: [],
    toppings: [],
    extras: []
  };

  groups.sort(sortBySortField).forEach(group => {
    const key = groupKey(group.name || '');
    const groupId = group._id || group.id;
    const items = (itemsByGroupId[groupId] || [])
      .filter(item => item.status !== false)
      .sort(sortBySortField)
      .map(item => ({
        id: item._id || item.id,
        name: item.name,
        price: Number(item.price || 0),
        group: group.name,
        type: group.type || 'single',
        required: group.required !== false
      }));
    specs[key] = specs[key].concat(items);
  });

  return {
    id: food._id || food.id,
    _id: food._id,
    categoryId: food.categoryId,
    subCategoryId: food.subCategoryId,
    name: food.name,
    description: food.description || '',
    imageUrl: food.image || food.imageUrl || '',
    basePrice: Number(food.normalPrice || food.basePrice || 0),
    memberPrice: Number(food.memberPrice || food.normalPrice || food.basePrice || 0),
    hasMemberPrice: food.hasMemberPrice !== false,
    salesCount: Number(food.salesCount || 0),
    status: food.status !== false,
    sort: Number(food.sort || 0),
    sizes: getDisplaySizes(food, specs),
    specs
  };
}

function getDisplaySizes(food, specs) {
  if (food.sizes && food.sizes.length) {
    return food.sizes;
  }
  if (specs.sizes && specs.sizes.length) {
    const basePrice = Number(food.normalPrice || food.basePrice || 0);
    return specs.sizes.map(item => ({
      size: item.name,
      price: basePrice + Number(item.price || 0)
    }));
  }
  return [{ size: '单份', price: Number(food.normalPrice || food.basePrice || 0) }];
}

function fallbackMenu() {
  const localMenu = localAdminMenu();
  if (localMenu) {
    return localMenu;
  }
  const allDishes = dishData.dishes;
  return {
    source: 'mock',
    mainCategories: MAIN_CATEGORIES,
    subCategories: SUB_CATEGORIES,
    allDishes
  };
}

function localAdminMenu() {
  localData.ensureCollection('foods');
  const foods = localData.getCollection('foods');
  if (!foods.length) {
    return null;
  }

  const categories = localData.getCollection('categories');
  const optionGroups = localData.getCollection('optionGroups');
  const optionItems = localData.getCollection('optionItems');

  const categoryById = {};
  categories.forEach(category => {
    const id = category._id || category.id;
    if (id) categoryById[id] = category;
  });

  const mainCategorySet = new Set();
  const subCategories = {};
  categories
    .filter(item => item.status !== false)
    .sort(sortBySortField)
    .forEach(category => {
      const isMain = Number(category.level || 1) === 1 || !category.parentId;
      if (isMain) {
        mainCategorySet.add(category.name);
      } else {
        const parent = categoryById[category.parentId];
        const parentName = parent && parent.name;
        if (!parentName) return;
        if (!subCategories[parentName]) subCategories[parentName] = [];
        subCategories[parentName].push(category.name);
      }
    });

  const groupsByFoodId = {};
  optionGroups.forEach(group => {
    if (group.status === false) return;
    const foodId = group.foodId;
    if (!groupsByFoodId[foodId]) groupsByFoodId[foodId] = [];
    groupsByFoodId[foodId].push(group);
  });

  const itemsByGroupId = {};
  optionItems.forEach(item => {
    const groupId = item.groupId;
    if (!itemsByGroupId[groupId]) itemsByGroupId[groupId] = [];
    itemsByGroupId[groupId].push(item);
  });

  const allDishes = {};
  foods.filter(food => food.status !== false).sort(sortBySortField).forEach(food => {
    const foodId = food._id || food.id;
    const category = categoryById[food.categoryId];
    const subCategory = categoryById[food.subCategoryId];
    const mainName = food.categoryName || category && category.name || food.categoryId || '未分类';
    const bucketName = food.subCategoryName || subCategory && subCategory.name || mainName;

    mainCategorySet.add(mainName);
    if (bucketName !== mainName) {
      if (!subCategories[mainName]) subCategories[mainName] = [];
      if (!subCategories[mainName].includes(bucketName)) subCategories[mainName].push(bucketName);
    }

    if (!allDishes[bucketName]) allDishes[bucketName] = [];
    allDishes[bucketName].push(normalizeFood(food, groupsByFoodId[foodId] || [], itemsByGroupId));
  });

  return {
    source: 'admin-local',
    mainCategories: Array.from(mainCategorySet),
    subCategories,
    allDishes
  };
}

async function cloudMenu() {
  const [categories, foods, optionGroups, optionItems] = await Promise.all([
    cloud.list(COLLECTIONS.categories),
    cloud.list(COLLECTIONS.foods),
    cloud.list(COLLECTIONS.optionGroups),
    cloud.list(COLLECTIONS.optionItems)
  ]);
  if (!foods.length) {
    throw new Error('cloud foods collection is empty');
  }

  const activeCategories = categories.filter(item => item.status !== false).sort(sortBySortField);
  const categoryById = {};
  activeCategories.forEach(category => {
    categoryById[category._id || category.id] = category;
  });

  const mainCategories = activeCategories
    .filter(category => Number(category.level || 1) === 1 || !category.parentId)
    .map(category => category.name);

  const subCategories = {};
  activeCategories
    .filter(category => category.parentId)
    .forEach(category => {
      const parent = categoryById[category.parentId];
      if (!parent) return;
      if (!subCategories[parent.name]) subCategories[parent.name] = [];
      subCategories[parent.name].push(category.name);
    });

  const groupsByFoodId = {};
  optionGroups.forEach(group => {
    const foodId = group.foodId;
    if (!groupsByFoodId[foodId]) groupsByFoodId[foodId] = [];
    groupsByFoodId[foodId].push(group);
  });

  const itemsByGroupId = {};
  optionItems.forEach(item => {
    const groupId = item.groupId;
    if (!itemsByGroupId[groupId]) itemsByGroupId[groupId] = [];
    itemsByGroupId[groupId].push(item);
  });

  const allDishes = {};
  foods.filter(food => food.status !== false).forEach(food => {
    const foodId = food._id || food.id;
    const normalized = normalizeFood(food, groupsByFoodId[foodId] || [], itemsByGroupId);
    const category = categoryById[food.subCategoryId] || categoryById[food.categoryId];
    const bucketName = food.subCategoryName || food.categoryName || category && category.name;
    if (!bucketName) return;
    if (!allDishes[bucketName]) allDishes[bucketName] = [];
    allDishes[bucketName].push(normalized);
  });

  Object.keys(allDishes).forEach(key => allDishes[key].sort(sortBySortField));

  return {
    source: 'cloud',
    mainCategories: mainCategories.length ? mainCategories : MAIN_CATEGORIES,
    subCategories,
    allDishes
  };
}

async function getMenuData(force = false) {
  if (menuCache && !force) {
    return menuCache;
  }
  const menuCollections = ['categories', 'foods', 'optionGroups', 'optionItems'];
  const useLocal = menuCollections.some(collection => localData.hasPending(collection));
  if (!useLocal) {
    try {
      menuCache = await cloudMenu();
    } catch (err) {
      console.warn('云端菜品加载失败，使用可编辑本地菜单', err);
      localData.setLocalMode('foods', true);
      menuCache = fallbackMenu();
    }
  } else {
    menuCache = fallbackMenu();
  }
  wx.setStorageSync('menuDirty', false);
  wx.setStorageSync('menuCache', menuCache);
  return menuCache;
}

async function findFoodById(id) {
  const menu = await getMenuData(!!wx.getStorageSync('menuDirty'));
  const buckets = menu.allDishes || {};
  let found = null;
  Object.keys(buckets).some(key => {
    found = (buckets[key] || []).find(item => item.id === id || item._id === id);
    return !!found;
  });
  return found;
}

module.exports = {
  getMenuData,
  findFoodById,
  normalizeFood,
  fallbackMenu
};
