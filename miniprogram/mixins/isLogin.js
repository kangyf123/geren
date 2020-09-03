const app = getApp();
module.exports = {
  data: {
    _isLogin: app.globalData.isLogin,
  },
  onShow: function () {
    if (this.data._isLogin !== app.globalData.isLogin) {
      this.setData({
        _isLogin: app.globalData.isLogin,
      });
    }
    console.log('添加此处是为了 验证微信真机调试 时候 莫名登录的问题',this.data._isLogin);
  },
}