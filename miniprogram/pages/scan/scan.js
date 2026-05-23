const app = getApp();

Page({
  data: {
    tableNo: ''
  },
  scan() {
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode'],
      success: (res) => {
        let tableNo = res.result;
        // 尝试从URL参数中提取桌号（假设二维码内容为 https://xxx?table=12）
        const match = res.result.match(/[?&]table=(\d+)/);
        if (match) {
          tableNo = match[1];
        } else if (/^\d+$/.test(res.result)) {
          tableNo = res.result;
        }
        this.setData({ tableNo });
        wx.showToast({ title: `桌号 ${tableNo}`, icon: 'success' });
      },
      fail: (err) => {
        console.error('扫码失败', err);
        wx.showToast({ title: '扫码失败', icon: 'none' });
      }
    });
  },
  goToOrder() {
    app.globalData.mealInfo = {
      type: 'dinein',
      tableNo: this.data.tableNo
    };
    wx.switchTab({
      url: '/pages/order/order'
    });
  }
});