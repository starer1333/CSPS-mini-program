# 城市比萨小程序架构说明

## 总体架构

顾客微信小程序通过微信云开发访问 Cloud Database、Cloud Storage、Cloud Functions。商家后台也运行在小程序内，后台页面修改数据库后，用户端通过服务层重新读取云端数据，无需重新上传小程序代码。

## 核心业务关系

- `users` 一对多 `orders`
- `orders` 一对多 `orderItems`
- `users` 一对多 `userCoupons`
- `users` 一对多 `recharges`
- `categories` 一对多 `foods`
- `foods` 一对多 `optionGroups`
- `optionGroups` 一对多 `optionItems`
- `foods` 一对多 `coupons`
- `storeSettings`、`banners`、`tables`、`dailyReports` 作为运营配置与统计集合

## 数据库集合

当前代码在 `miniprogram/config/database.js` 固化了 16 个集合名：

1. `users`
2. `categories`
3. `foods`
4. `optionGroups`
5. `optionItems`
6. `orders`
7. `orderItems`
8. `coupons`
9. `userCoupons`
10. `rechargePlans`
11. `recharges`
12. `banners`
13. `tables`
14. `storeSettings`
15. `paymentConfigs`
16. `dailyReports`

订单商品必须写入 `orderItems` 快照，字段包含 `foodName`、`image`、`basePrice`、`quantity`、`finalPrice`、`selectedOptions`。这样后续菜品涨价不会影响历史订单。

## 用户端页面流

- 首页：`pages/index/index`
- 点餐：`pages/order/order`
- 商品详情：`pages/dishDetail/dishDetail`
- 结算：`pages/checkout/checkout`
- 订单列表：`pages/orders/orders`
- 订单详情：`pages/orderDetail/orderDetail`
- 我的：`pages/my/my`
- 充值：`pages/recharge/recharge`
- 优惠券：`pages/coupon/coupon`
- 堂食扫码：`pages/scan/scan`

用餐方式统一为：

- `dinein`：在店堂食
- `delivery`：外卖配送
- `pickup`：到店自取

## 后台页面

后台页面位于 `miniprogram/admin`：

- `dashboard`：后台首页
- `foods`：菜品管理
- `foodEdit`：规格组管理
- `categories`：分类管理
- `orders`：订单管理
- `members`：会员管理
- `coupons`：优惠券模板
- `recharges`：充值活动
- `tables`：桌号管理
- `banners`：轮播图管理
- `settings`：门店、支付、打印配置
- `reports`：日报统计

## 云函数

云函数位于 `cloudfunctions`：

- `login`
- `createOrder`
- `payOrder`
- `cancelOrder`
- `reorder`
- `sendCoupon`
- `recharge`
- `generateTableQR`
- `printOrder`
- `dailyReport`
- `hideExpiredOrders`
- `alipayConfirm`

## 开发顺序

1. 用户登录、分类、菜品、购物车、订单、支付模拟。
2. 后台菜品管理、分类管理、订单管理。
3. 会员、余额、充值、优惠券。
4. 飞鹅打印、桌号二维码、日报统计、Excel 导出。
