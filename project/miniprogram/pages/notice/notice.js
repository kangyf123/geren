Page({
  data: {
    name: '',
    similarList: [],
    id:'',
    navHeight: '',
    showNavBut: true
  },
  mixins: [require('../../utils/util.js'), require('../../mixins/form.js')],
  onLoad: function (options) {
    this.getNavHeight();
    const id = options.id;
    this.setData({
      name: options.name,
      id: options.id
    });
    this.ajaxGetSimilarJobList(id);
    // 求职时候增加微信消息订阅提醒
    this.modalcnt();
  },
  onShow(){
    this.getNavHeight();
  },
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
    wx.navigateBack();
    const _this = this;
    // wx.navigateTo({
    //   url: '/pages/jobs/details/details?id=' + _this.data.id,
    // })
  },
})