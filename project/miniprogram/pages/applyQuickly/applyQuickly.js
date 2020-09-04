Page({

  /**
   * 页面的初始数据
   */
  data: {
    zeroList: false,
    isNewdate: true,
    hasHeadhunter: false,
    showNavBut: true,
    list: [],
    filters: {
      page: 1,
      size: 6
    },
    RecordCount: -1
  },
  onShow: function () {
    console.log(this.data.filters.page);
    this.getList();
  },
  getList: function () {
    let _this = this;
    wx.$http({
      url: '/v1/Account/GetPersonRecruitListById',
      data: this.data.filters,
      method: "get"
    }).then(function (res) {
      // 下拉刷新清空数据
      if(_this.data.filters.page == 1){
        _this.data.list = [];
      }
      _this.setData({
        list: _this.data.list.concat(res.Data),
        RecordCount: res.RecordCount
      });
    })
  },
  onPullDownRefresh: function () {
    this.setData({
      'filters.page': 1
    })
    this.getList();
    wx.stopPullDownRefresh();
  },
  onReachBottom: function () {
    let _this = this;
    if (_this.data.RecordCount <= _this.data.filters.page * _this.data.filters.size) {
      _this.setData({
        zeroList: true
      });
      return;
    } else {
      _this.setData({
        'filters.page': _this.data.filters.page + 1,
        zeroList: false
      });
      _this.getList();
    }
  },
  onShareAppMessage: function () {

  }
})