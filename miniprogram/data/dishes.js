// 菜品数据（商家可在此自由增删修改）
module.exports = {
  // 一级分类（左侧主分类）
  mainCategories: [
    '爆浆比萨招牌必吃',
    '12寸比萨',
    '9英寸铁盘比萨',
    '9英寸薄饼比萨',
    '牛排·沙拉',
    '炸鸡·鱼饼火鸡面',
    '国潮炸鸡',
    '甜品·蛋挞'
  ],
  // 比萨子分类（仅前4个比萨分类显示）
  pizzaSubCategories: ['甄选尊享', '牛羊排/三文鱼', '面饭', '甜品', '汤类'],
  // 所有菜品数据，按分类组织（键名与主分类或子分类对应）
  dishes: {
    // 比萨子分类下的菜品
    '甄选尊享': [
      {
        id: 'p1',
        name: '招财进宝松茸火腿耗牛比萨',
        description: '松茸+火腿+耗牛，珍馐美味',
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=640',
        basePrice: 88,
        memberPrice: 78,
        sizes: [
          { size: '9"', price: 88 },
          { size: '12"', price: 117 }
        ],
        specs: {
          sizes: [
            { name: '9寸', price: 0 },
            { name: '12寸', price: 29 }
          ],
          crusts: [
            { name: '经典手拍', price: 0 },
            { name: '芝香烤肠卷边', price: 15 },
            { name: '酸奶卷边', price: 12 },
            { name: '芋泥卷边', price: 15 },
            { name: '金沙咸蛋黄卷边', price: 15 },
            { name: '薯蓉卷边', price: 10 }
          ],
          sauces: [
            { name: '西班牙风味肉肠酱', price: 0 },
            { name: '经典番茄酱', price: 0 },
            { name: '奶油白酱', price: 5 }
          ],
          toppings: [
            { name: '预炸裹浆虾仁', price: 8 },
            { name: '番茄炖牛腩', price: 10 },
            { name: '培根', price: 6 }
          ]
        }
      },
      {
        id: 'p2',
        name: '马德里风情牛腩大虾比萨',
        description: '牛腩+大虾，双饕臻享',
        imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=640',
        basePrice: 78,
        memberPrice: 68,
        sizes: [
          { size: '9"', price: 78 },
          { size: '12"', price: 107 }
        ],
        specs: {
          sizes: [
            { name: '9寸', price: 0 },
            { name: '12寸', price: 29 }
          ],
          crusts: [
            { name: '经典手拍', price: 0 },
            { name: '芝香烤肠卷边', price: 15 }
          ],
          sauces: [
            { name: '西班牙风味肉肠酱', price: 0 }
          ],
          toppings: [
            { name: '虾仁', price: 8 },
            { name: '牛腩', price: 10 }
          ]
        }
      }
    ],
    '牛羊排/三文鱼': [
      {
        id: 'st1',
        name: '澳洲谷饲牛排',
        description: '200g，七分熟',
        imageUrl: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=640',
        basePrice: 128,
        memberPrice: 108,
        sizes: [
          { size: '单份', price: 128 }
        ],
        specs: {
          sizes: [],
          crusts: [],
          sauces: [
            { name: '黑椒酱', price: 0 },
            { name: '蘑菇酱', price: 0 }
          ],
          toppings: []
        }
      }
    ],
    '面饭': [
      {
        id: 'nf1',
        name: '经典肉酱意面',
        description: '番茄肉酱，帕玛森芝士',
        imageUrl: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=640',
        basePrice: 42,
        memberPrice: 36,
        sizes: [
          { size: '单份', price: 42 }
        ],
        specs: {
          sizes: [],
          crusts: [],
          sauces: [],
          toppings: []
        }
      }
    ],
    '甜品': [
      {
        id: 'ts1',
        name: '巧克力熔岩蛋糕',
        description: '流心巧克力',
        imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=640',
        basePrice: 28,
        memberPrice: 22,
        sizes: [
          { size: '单份', price: 28 }
        ],
        specs: {
          sizes: [],
          crusts: [],
          sauces: [],
          toppings: []
        }
      }
    ],
    '汤类': [
      {
        id: 'sp1',
        name: '奶油蘑菇汤',
        description: '香浓顺滑',
        imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=640',
        basePrice: 22,
        memberPrice: 18,
        sizes: [
          { size: '碗', price: 22 }
        ],
        specs: {
          sizes: [],
          crusts: [],
          sauces: [],
          toppings: []
        }
      }
    ],
    // 其他主分类下的菜品
    '牛排·沙拉': [
      {
        id: 'ns1',
        name: '澳洲谷饲牛排',
        description: '200g，七分熟',
        imageUrl: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=640',
        basePrice: 128,
        memberPrice: 108,
        sizes: [
          { size: '单份', price: 128 }
        ],
        specs: {
          sizes: [],
          crusts: [],
          sauces: [],
          toppings: []
        }
      },
      {
        id: 'ns2',
        name: '凯撒沙拉',
        description: '罗马生菜+面包丁+帕玛森芝士',
        imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=640',
        basePrice: 42,
        memberPrice: 36,
        sizes: [
          { size: '单份', price: 42 }
        ],
        specs: {
          sizes: [],
          crusts: [],
          sauces: [],
          toppings: []
        }
      }
    ],
    '炸鸡·鱼饼火鸡面': [
      {
        id: 'fc1',
        name: '韩式炸鸡',
        description: '6块，甜辣酱',
        imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=640',
        basePrice: 48,
        memberPrice: 42,
        sizes: [
          { size: '6块', price: 48 },
          { size: '12块', price: 88 }
        ],
        specs: {
          sizes: [],
          crusts: [],
          sauces: [],
          toppings: []
        }
      },
      {
        id: 'fc2',
        name: '火鸡面',
        description: '辣味十足',
        imageUrl: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=640',
        basePrice: 28,
        memberPrice: 24,
        sizes: [
          { size: '单份', price: 28 }
        ],
        specs: {
          sizes: [],
          crusts: [],
          sauces: [],
          toppings: []
        }
      }
    ],
    '国潮炸鸡': [
      {
        id: 'cc1',
        name: '国潮脆皮炸鸡',
        description: '秘制香料，外酥里嫩',
        imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=640',
        basePrice: 38,
        memberPrice: 32,
        sizes: [
          { size: '半只', price: 38 },
          { size: '整只', price: 68 }
        ],
        specs: {
          sizes: [],
          crusts: [],
          sauces: [],
          toppings: []
        }
      }
    ],
    '甜品·蛋挞': [
      {
        id: 'dt1',
        name: '葡式蛋挞',
        description: '2只装',
        imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=640',
        basePrice: 18,
        memberPrice: 15,
        sizes: [
          { size: '2只', price: 18 },
          { size: '6只', price: 48 }
        ],
        specs: {
          sizes: [],
          crusts: [],
          sauces: [],
          toppings: []
        }
      }
    ],
    '爆浆比萨招牌必吃': [
      {
        id: 'bp1',
        name: '爆浆芝士比萨',
        description: '满满芝士，一口爆浆',
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=640',
        basePrice: 98,
        memberPrice: 88,
        sizes: [
          { size: '9"', price: 98 },
          { size: '12"', price: 128 }
        ],
        specs: {
          sizes: [],
          crusts: [],
          sauces: [],
          toppings: []
        }
      }
    ],
    '12寸比萨': [
      {
        id: '12p1',
        name: '超级至尊12寸',
        description: '多种肉类+蔬菜',
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=640',
        basePrice: 98,
        memberPrice: 88,
        sizes: [
          { size: '12"', price: 98 }
        ],
        specs: {
          sizes: [],
          crusts: [],
          sauces: [],
          toppings: []
        }
      }
    ],
    '9英寸铁盘比萨': [
      {
        id: '9p1',
        name: '经典玛格丽特',
        description: '番茄酱+马苏里拉芝士+罗勒',
        imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=640',
        basePrice: 68,
        memberPrice: 58,
        sizes: [
          { size: '9"', price: 68 }
        ],
        specs: {
          sizes: [],
          crusts: [],
          sauces: [],
          toppings: []
        }
      }
    ],
    '9英寸薄饼比萨': [
      {
        id: '9p2',
        name: '超级至尊薄脆',
        description: '多种肉类+蔬菜，薄脆饼底',
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=640',
        basePrice: 72,
        memberPrice: 62,
        sizes: [
          { size: '9"', price: 72 }
        ],
        specs: {
          sizes: [],
          crusts: [],
          sauces: [],
          toppings: []
        }
      }
    ]
  }
};