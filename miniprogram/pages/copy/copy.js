const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navHeight: '',
    showNavBut: true,
  },
  mixins: [
    require('../../utils/util.js'),
    require('../../mixins/screenAdapt.js'),
  ],
  copyLink: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.url,
    })
  },
  scanCode: function () {
    wx.scanCode({
      scanType: 'qrCode',
      success: function (e) {
        var socketKey = e.result;
        wx.request({
          url: app.globalData.host + '/getLoginCode',
          method: 'POST',
          header: {
            "content-Type": "application/json; charset=utf-8",
            "Authorization": "Bearer " + app.globalData.token,
          },
          data: { socketKey: socketKey, token: app.globalData.token },
          success: function (e) {
            var result = e.data;
            if (result) {
              wx.showToast({
                title: '登录成功',
              })
            } else {
              wx.showModal({
                title: '登录失败',
                content: '该用户暂时没有权限',
                showCancel: false
              })
            }
          }
        })
      }
    })
  },
  onLoad: function (options) {
    this.getNavHeight();
  },
  onShow: function () {
    this.getNavHeight();
  }
})