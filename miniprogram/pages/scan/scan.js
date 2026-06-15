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
        // 兼容后台生成的 table/tableNo 参数和纯桌号二维码。
        const match = res.result.match(/[?&](table|tableNo)=([^&]+)/);
        if (match) {
          tableNo = decodeURIComponent(match[2]);
        } else if (/^[A-Za-z0-9-]+$/.test(res.result)) {
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
