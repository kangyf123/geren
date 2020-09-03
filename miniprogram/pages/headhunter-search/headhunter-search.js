Page({
  data: {
    navHeight: '',
    showNavBut: true,
    enName: '',
    historyList: [],
    searchTipList: [],
    filters: {
      page: 1,
      size: 10,
    },
    list: [],
    count: 0,

    isShowSearchTipPanel: false,
    isSearchTipReady: true,
  },
  mixins: [require('../../mixins/navigateTo.js'), require('../../utils/util.js')],
  onLoad: function (options) {
    this.ajaxGetSearchHistoryList();
    this.getNavHeight();
  },
  onShow: function () {
    this.getNavHeight();
  },
  clearEnName: function () {
    this.setData({
      enName:""
    })
  },
  getHeadhunterSearchText(e){
    this.setData({
      enName:e.detail.value
    })
  },
  ajaxGetHeadhunterSearch(e) {
    let enName = e.currentTarget.dataset.name ? e.currentTarget.dataset.name:this.data.enName;
    this.setData({
      enName:enName
    })
    let page = 1;
    
    const _this = this;
    this.ajaxGetJobList(enName, page, function () {
      _this.ajaxGetSearchHistoryList();
    });
  },
  ajaxGetJobList: function (enName,page, callback) {
    const _this = this;
    wx.$http({
      url: '/v1/Adviser/List',
      data: {
        enName: enName||'',
        page: page, 
        size: this.data.filters.size,
      },
    }).then(function (data) {
      if (data.Page === 1) {
        _this.setData({
          'list': data.Data,
          'count': data.RecordCount,
        });
        callback && callback();
      } else {
        _this.setData({
          'list': _this.data.list.concat(data.Data),
        });
      }
    });
  },
  ajaxGetSearchHistoryList: function () {
    const _this = this;
    wx.$http({
      url: '/v1/StaffSearchHistory/List',
      ignoreLogin: true,
      data: {
        page: 1,
        size: 20,
      },
    }).then(function (data) {
      _this.setData({
        historyList: data,
      });
    });
  },
  ajaxClearSearchHistory: function () {
    const _this = this;
    wx.$http({
      url: '/v1/StaffSearchHistory/ClearSearchHistory',
    }).then(function (data) {
      wx.showToast({
        title: '历史记录成功',
        icon: 'success',
        duration: 2000,
        success: function () {
          _this.setData({
            historyList: [],
          });
        },
      })
    });
  },
  onReachBottom: function () {
    if (this.data.isShowSearchTipPanel || !this.data.enName) {
      return;
    }
    this.setData({
      'filters.page': this.data.filters.page + 1,
    });
    this.ajaxGetJobList(this.data.enName, this.data.filters.page);
  },
})