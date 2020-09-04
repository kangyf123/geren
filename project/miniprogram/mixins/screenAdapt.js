const app = getApp();
module.exports = {
  data: {
    _isScreenBottomRound: false,
  },
  onLoad: function () {
    this.setData({
      _isScreenBottomRound: app.globalData.isScreenBottomRound,
    });
  },
}