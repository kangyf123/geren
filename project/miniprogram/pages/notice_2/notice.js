Page({
  data: {
    similarList: [],
    navHeight: '',
    showNavBut: true
  },
  onLoad: function (options) {
    const id = options.id;
    this.ajaxGetSimilarJobList(id);
    this.getNavHeight();
  },
  onShow() {
    this.getNavHeight();
  },
  mixins: [require('../../mixins/navigateTo.js'), require('../../utils/util.js')],
  ajaxGetSimilarJobList: function (id) {
    const _this = this;
    wx.$http({
      url: '/v1/Job/GetSimilarJobList',
      data: {
        srcJobID: id,
      },
    }).then(function (data) {
      _this.setData({
        similarList: data.Data
      });
    });
  },
  navigateBack: function () {
    // 首页
    wx.switchTab({
      url: '/pages/home/home'
    })
  },
})