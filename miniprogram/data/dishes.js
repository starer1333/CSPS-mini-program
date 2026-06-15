// data/dishes.js
// 菜品数据 —— 键名必须与 order.js 中的分类名称严格匹配
module.exports = {
  dishes: {

    // ========== 比萨子分类（main='比萨'时按此子分类展示） ==========
    '爆浆比萨招牌必吃': [
      {
        id: 'bp1',
        name: '芝心四重奏爆浆比萨',
        description: '四重芝士爆浆，一口惊艳',
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
        basePrice: 98,
        memberPrice: 85,
        sizes: [{ size: '9"', price: 98 }, { size: '12"', price: 128 }],
        category: 'pizza',
        specs: {
          sizes: [{ name: '9寸', price: 0 }, { name: '12寸', price: 30 }],
          crusts: [],  // 爆浆比萨招牌必吃分类：无卷边选项
          sauces: [
            { name: '经典番茄酱', price: 0 },
            { name: '奶油白酱', price: 5 }
          ],
          toppings: [
            { name: '培根碎', price: 6 },
            { name: '预炸虾仁', price: 8 }
          ]
        }
      },
      {
        id: 'bp2',
        name: '黄金流心牛肉爆浆比萨',
        description: '牛肉粒+流心芝士，厚实过瘾',
        imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
        basePrice: 108,
        memberPrice: 92,
        sizes: [{ size: '9"', price: 108 }, { size: '12"', price: 138 }],
        category: 'pizza',
        specs: {
          sizes: [{ name: '9寸', price: 0 }, { name: '12寸', price: 30 }],
          crusts: [],  // 无卷边
          sauces: [
            { name: '黑椒牛肉酱', price: 0 },
            { name: '经典番茄酱', price: 0 }
          ],
          toppings: [
            { name: '牛肉粒加量', price: 12 },
            { name: '马苏里拉加量', price: 8 }
          ]
        }
      }
    ],

    '12寸比萨': [
      {
        id: '12p1',
        name: '超级至尊12寸',
        description: '多种肉类+时令蔬菜，料足量大',
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
        basePrice: 108,
        memberPrice: 92,
        sizes: [{ size: '12"', price: 108 }],
        category: 'pizza',
        specs: {
          sizes: [{ name: '12寸', price: 0 }],
          crusts: [
            { name: '经典手拍', price: 0 },
            { name: '芝香烤肠卷边', price: 15 },
            { name: '芋泥卷边', price: 15 },
            { name: '金沙咸蛋黄卷边', price: 15 }
          ],
          sauces: [
            { name: '经典番茄酱', price: 0 },
            { name: '奶油白酱', price: 5 }
          ],
          toppings: [
            { name: '预炸虾仁', price: 8 },
            { name: '培根', price: 6 },
            { name: '蘑菇', price: 4 }
          ]
        }
      },
      {
        id: '12p2',
        name: '招财进宝松茸火腿比萨',
        description: '松茸+火腿+耗牛，臻选食材',
        imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
        basePrice: 128,
        memberPrice: 108,
        sizes: [{ size: '12"', price: 128 }],
        category: 'pizza',
        specs: {
          sizes: [{ name: '12寸', price: 0 }],
          crusts: [
            { name: '经典手拍', price: 0 },
            { name: '薯蓉卷边', price: 10 },
            { name: '酸奶卷边', price: 12 }
          ],
          sauces: [
            { name: '西班牙风味肉肠酱', price: 0 },
            { name: '经典番茄酱', price: 0 }
          ],
          toppings: [
            { name: '松茸加量', price: 15 },
            { name: '番茄炖牛腩', price: 10 }
          ]
        }
      }
    ],

    '9英寸铁盘比萨': [
      {
        id: '9iron1',
        name: '经典玛格丽特铁盘',
        description: '番茄酱+马苏里拉+罗勒叶，意式经典',
        imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
        basePrice: 68,
        memberPrice: 58,
        sizes: [{ size: '9"', price: 68 }],
        category: 'pizza',
        specs: {
          sizes: [{ name: '9寸铁盘', price: 0 }],
          crusts: [
            { name: '经典手拍', price: 0 },
            { name: '芝香烤肠卷边', price: 12 },
            { name: '酸奶卷边', price: 10 }
          ],
          sauces: [{ name: '经典番茄酱', price: 0 }],
          toppings: [
            { name: '加蘑菇', price: 4 },
            { name: '加培根', price: 6 }
          ]
        }
      },
      {
        id: '9iron2',
        name: '马德里风情牛腩大虾',
        description: '牛腩+大虾，双重鲜味',
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
        basePrice: 88,
        memberPrice: 76,
        sizes: [{ size: '9"', price: 88 }],
        category: 'pizza',
        specs: {
          sizes: [{ name: '9寸铁盘', price: 0 }],
          crusts: [
            { name: '经典手拍', price: 0 },
            { name: '芋泥卷边', price: 12 },
            { name: '薯蓉卷边', price: 10 }
          ],
          sauces: [
            { name: '西班牙番茄酱', price: 0 },
            { name: '奶油白酱', price: 5 }
          ],
          toppings: [
            { name: '虾仁加量', price: 8 },
            { name: '牛腩加量', price: 10 }
          ]
        }
      }
    ],

    '9英寸薄饼比萨': [
      {
        id: '9thin1',
        name: '超级至尊薄脆',
        description: '多种肉类+蔬菜，薄脆饼底',
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
        basePrice: 72,
        memberPrice: 62,
        sizes: [{ size: '9"', price: 72 }],
        category: 'pizza',
        specs: {
          sizes: [{ name: '9寸薄饼', price: 0 }],
          crusts: [
            { name: '原味薄脆', price: 0 },
            { name: '海盐芝士边', price: 8 }
          ],
          sauces: [{ name: '经典番茄酱', price: 0 }],
          toppings: [
            { name: '加培根', price: 6 },
            { name: '加黑橄榄', price: 4 }
          ]
        }
      },
      {
        id: '9thin2',
        name: '照烧鸡肉薄脆',
        description: '日式照烧+嫩鸡肉+青椒',
        imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
        basePrice: 68,
        memberPrice: 58,
        sizes: [{ size: '9"', price: 68 }],
        category: 'pizza',
        specs: {
          sizes: [{ name: '9寸薄饼', price: 0 }],
          crusts: [
            { name: '原味薄脆', price: 0 }
          ],
          sauces: [
            { name: '照烧酱', price: 0 },
            { name: '蛋黄酱', price: 0 }
          ],
          toppings: [{ name: '加芝士', price: 5 }]
        }
      }
    ],

    // ========== 其他主分类（无子分类，直接展示菜品） ==========
    '牛排·沙拉': [
      {
        id: 'ns1',
        name: '澳洲M5黑安格斯牛排',
        description: '200g，七分熟，附配菜',
        imageUrl: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=400',
        basePrice: 138,
        memberPrice: 118,
        sizes: [{ size: '200g', price: 138 }],
        category: 'steak',
        specs: {
          sizes: [],
          crusts: [],
          sauces: [
            { name: '黑椒酱', price: 0 },
            { name: '蘑菇酱', price: 0 },
            { name: '香草黄油', price: 0 }
          ],
          toppings: []
        }
      },
      {
        id: 'ns2',
        name: '澳洲羊排',
        description: '3根，法式香草腌制',
        imageUrl: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=400',
        basePrice: 98,
        memberPrice: 85,
        sizes: [{ size: '3根', price: 98 }],
        category: 'steak',
        specs: {
          sizes: [],
          crusts: [],
          sauces: [
            { name: '黑椒酱', price: 0 },
            { name: '薄荷酸辣酱', price: 0 }
          ],
          toppings: []
        }
      },
      {
        id: 'ns3',
        name: '凯撒沙拉',
        description: '罗马生菜+面包丁+帕玛森+培根碎',
        imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
        basePrice: 42,
        memberPrice: 36,
        sizes: [{ size: '单份', price: 42 }],
        category: 'salad',
        specs: { sizes: [], crusts: [], sauces: [], toppings: [] }
      }
    ],

    '炸鸡·鱼饼火鸡面': [
      {
        id: 'fc1',
        name: '蜂蜜芥末韩式炸鸡',
        description: '6块，外酥里嫩',
        imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400',
        basePrice: 48,
        memberPrice: 42,
        sizes: [{ size: '6块', price: 48 }, { size: '12块', price: 88 }],
        category: 'chicken',
        specs: { sizes: [], crusts: [], sauces: [], toppings: [] }
      },
      {
        id: 'fc2',
        name: '辣炒火鸡面',
        description: '韩式辣炒，配溏心蛋',
        imageUrl: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400',
        basePrice: 28,
        memberPrice: 24,
        sizes: [{ size: '单份', price: 28 }],
        category: 'noodle',
        specs: { sizes: [], crusts: [], sauces: [], toppings: [] }
      },
      {
        id: 'fc3',
        name: '韩式鱼饼汤',
        description: '正宗釜山风味',
        imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400',
        basePrice: 22,
        memberPrice: 18,
        sizes: [{ size: '碗', price: 22 }],
        category: 'soup',
        specs: { sizes: [], crusts: [], sauces: [], toppings: [] }
      }
    ],

    '国潮炸鸡': [
      {
        id: 'cc1',
        name: '国潮脆皮半只鸡',
        description: '秘制香料腌制，外酥里嫩',
        imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400',
        basePrice: 48,
        memberPrice: 42,
        sizes: [{ size: '半只', price: 48 }, { size: '整只', price: 88 }],
        category: 'chicken',
        specs: {
          sizes: [],
          crusts: [],
          sauces: [
            { name: '原味', price: 0 },
            { name: '香辣', price: 0 },
            { name: '麻辣', price: 0 }
          ],
          toppings: []
        }
      },
      {
        id: 'cc2',
        name: '麻辣藤椒炸鸡腿',
        description: '2只，藤椒麻香',
        imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400',
        basePrice: 32,
        memberPrice: 28,
        sizes: [{ size: '2只', price: 32 }],
        category: 'chicken',
        specs: { sizes: [], crusts: [], sauces: [], toppings: [] }
      }
    ],

    '甜品·蛋挞': [
      {
        id: 'dt1',
        name: '葡式蛋挞',
        description: '正宗澳门风味，酥脆细腻',
        imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400',
        basePrice: 18,
        memberPrice: 15,
        sizes: [{ size: '2只', price: 18 }, { size: '6只', price: 46 }],
        category: 'dessert',
        specs: { sizes: [], crusts: [], sauces: [], toppings: [] }
      },
      {
        id: 'dt2',
        name: '巧克力熔岩蛋糕',
        description: '流心巧克力，配香草冰淇淋',
        imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400',
        basePrice: 32,
        memberPrice: 26,
        sizes: [{ size: '单份', price: 32 }],
        category: 'dessert',
        specs: { sizes: [], crusts: [], sauces: [], toppings: [] }
      }
    ],

    '意面·焗饭·炒饭': [
      {
        id: 'nf1',
        name: '经典肉酱意面',
        description: '番茄慢炖肉酱，帕玛森芝士',
        imageUrl: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400',
        basePrice: 42,
        memberPrice: 36,
        sizes: [{ size: '单份', price: 42 }],
        category: 'pasta',
        specs: { sizes: [], crusts: [], sauces: [], toppings: [] }
      },
      {
        id: 'nf2',
        name: '芝士焗海鲜饭',
        description: '满满芝士+鲜虾+扇贝',
        imageUrl: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400',
        basePrice: 56,
        memberPrice: 48,
        sizes: [{ size: '单份', price: 56 }],
        category: 'rice',
        specs: { sizes: [], crusts: [], sauces: [], toppings: [] }
      },
      {
        id: 'nf3',
        name: '培根蛋炒饭',
        description: '粒粒分明，香气四溢',
        imageUrl: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400',
        basePrice: 28,
        memberPrice: 24,
        sizes: [{ size: '单份', price: 28 }],
        category: 'rice',
        specs: { sizes: [], crusts: [], sauces: [], toppings: [] }
      }
    ],

    '汉堡': [
      {
        id: 'hb1',
        name: '双层牛肉芝士堡',
        description: '双层纯牛肉饼+车打芝士',
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        basePrice: 38,
        memberPrice: 32,
        sizes: [{ size: '单份', price: 38 }],
        category: 'burger',
        specs: { sizes: [], crusts: [], sauces: [], toppings: [] }
      },
      {
        id: 'hb2',
        name: '脆皮炸鸡堡',
        description: '厚切鸡腿肉，自制特调酱',
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        basePrice: 32,
        memberPrice: 27,
        sizes: [{ size: '单份', price: 32 }],
        category: 'burger',
        specs: { sizes: [], crusts: [], sauces: [], toppings: [] }
      }
    ],

    '休闲小吃·拼盘': [
      {
        id: 'sk1',
        name: '香酥鸡翅',
        description: '秘制腌料，烤制金黄',
        imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400',
        basePrice: 28,
        memberPrice: 24,
        sizes: [{ size: '6个', price: 28 }, { size: '12个', price: 52 }],
        category: 'snack',
        specs: { sizes: [], crusts: [], sauces: [], toppings: [] }
      },
      {
        id: 'sk2',
        name: '芝士薯条',
        description: '厚切薯条+融化芝士',
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
        basePrice: 18,
        memberPrice: 15,
        sizes: [{ size: '单份', price: 18 }],
        category: 'snack',
        specs: { sizes: [], crusts: [], sauces: [], toppings: [] }
      },
      {
        id: 'sk3',
        name: '四拼小吃盘',
        description: '鸡翅+薯条+洋葱圈+鱼柳',
        imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400',
        basePrice: 58,
        memberPrice: 50,
        sizes: [{ size: '单份', price: 58 }],
        category: 'snack',
        specs: { sizes: [], crusts: [], sauces: [], toppings: [] }
      }
    ],

    // ========== 饮品子分类（main='饮品'时按此子分类展示） ==========
    '超级果蔬': [
      {
        id: 'dr1',
        name: '胡萝卜苹果姜汁',
        description: '新鲜果蔬冷压，营养满满',
        imageUrl: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400',
        basePrice: 22,
        memberPrice: 18,
        sizes: [{ size: '大杯', price: 22 }],
        category: 'drink',
        specs: { sizes: [], crusts: [], sauces: [], toppings: [] }
      }
    ],
    '手作鲜榨': [
      {
        id: 'dr2',
        name: '现榨西瓜汁',
        description: '新鲜西瓜现榨',
        imageUrl: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400',
        basePrice: 18,
        memberPrice: 15,
        sizes: [{ size: '大杯', price: 18 }],
        category: 'drink',
        specs: { sizes: [], crusts: [], sauces: [], toppings: [] }
      }
    ],
    '古法烤梨': [
      {
        id: 'dr3',
        name: '古法冰糖烤梨',
        description: '古方炖制，润喉去燥',
        imageUrl: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400',
        basePrice: 25,
        memberPrice: 20,
        sizes: [{ size: '单份', price: 25 }],
        category: 'drink',
        specs: { sizes: [], crusts: [], sauces: [], toppings: [] }
      }
    ],
    '柠檬茶': [
      {
        id: 'dr4',
        name: '港式柠檬茶',
        description: '奉茶底+现榨柠檬，经典港味',
        imageUrl: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400',
        basePrice: 16,
        memberPrice: 13,
        sizes: [{ size: '中杯', price: 16 }, { size: '大杯', price: 20 }],
        category: 'drink',
        specs: { sizes: [], crusts: [], sauces: [], toppings: [] }
      }
    ],
    '水果茶': [
      {
        id: 'dr5',
        name: '满杯红柚水果茶',
        description: '满满新鲜水果，颜值口感并存',
        imageUrl: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400',
        basePrice: 22,
        memberPrice: 18,
        sizes: [{ size: '大杯', price: 22 }],
        category: 'drink',
        specs: { sizes: [], crusts: [], sauces: [], toppings: [] }
      }
    ],
    '原叶奶茶': [
      {
        id: 'dr6',
        name: '港式丝袜奶茶',
        description: '原叶红茶+新鲜全脂牛奶',
        imageUrl: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400',
        basePrice: 18,
        memberPrice: 15,
        sizes: [{ size: '中杯', price: 18 }, { size: '大杯', price: 22 }],
        category: 'drink',
        specs: { sizes: [], crusts: [], sauces: [], toppings: [] }
      }
    ],
    '咖啡(冷/热)': [
      {
        id: 'dr7',
        name: '手冲美式咖啡',
        description: '精品豆手冲，单品风味',
        imageUrl: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400',
        basePrice: 28,
        memberPrice: 24,
        sizes: [{ size: '单杯', price: 28 }],
        category: 'drink',
        specs: { sizes: [], crusts: [], sauces: [], toppings: [] }
      },
      {
        id: 'dr8',
        name: '生椰拿铁',
        description: '椰浆+浓缩咖啡，热带风情',
        imageUrl: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400',
        basePrice: 32,
        memberPrice: 27,
        sizes: [{ size: '单杯', price: 32 }],
        category: 'drink',
        specs: { sizes: [], crusts: [], sauces: [], toppings: [] }
      }
    ]
  }
};
