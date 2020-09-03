let app = getApp();
Page({
  data: {
    navHeight: '',
    showNavBut: true,
    kwd: '',
    historyList: [],
    searchTipList: [],
    filters: {
      page: 1,
      size: 10,
    },
    list: [],
    count: 0,
    tipKwd: '',
    isShowSearchTipPanel: false,
    isSearchTipReady: true,
  },
  mixins: [require('../../mixins/navigateTo.js'), require('../../utils/util.js')],
  onLoad: function(options) {
    let localData = wx.getStorageSync("localData");
    this.data.filters.Province = localData.Province || "";
    this.data.filters.City = localData.City || "";
    this.getNavHeight();
  
  },
  onShow:function(){
    this.getNavHeight();
    this.ajaxGetSearchHistoryList();
  },
  searchByKwd: function(e) {
    let name;
    if (e.type === 'confirm') {
      name = e.detail.value;
    } else {
      name = e.currentTarget.dataset.name;
      if (name instanceof Array) {
        name = name.join(this.data.kwd);
      }
    }

    this.setData({
      kwd: name,
    });
    if (name) {
      const _this = this;
      this.ajaxGetJobList(function () {
        _this.ajaxGetSearchHistoryList();
      });
      this.setData({
        isShowSearchTipPanel: false,
        'filters.page': 1,
        list: [],
      });
    }
    


  },
  clearKwd: function() {
    this.ajaxGetJobSearchTip("");
  },
  ajaxGetJobList: function(callback) {
    const _this = this;
    wx.$http({
      url: '/v1/Job/List',
      method: "post",
      data: {
        Province:this.data.filters.Province,
        City: this.data.filters.City,
        SearchKeyWord: this.data.kwd,
        page: this.data.filters.page,
        size: this.data.filters.size,
      },
    }).then(function(data) {
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
  ajaxGetJobSearchTip: function(e) {
    let val;
    if (typeof e === 'string') {
      val = e;
    } else {
      val = e.detail.value;
    }
    const tipKwd = val;
    this.setData({
      tipKwd: val,
    });
    if (!this.data.isSearchTipReady) {
      return;
    }
    if (val === "") {
      this.setData({
        isSearchTipReady: true,
        isShowSearchTipPanel: false,
        kwd: '',
      });
      return;
    }
    this.setData({
      isSearchTipReady: false,
      kwd: val,
      isShowSearchTipPanel: true,
    });
    const _this = this;
    wx.$http({
      url: '/v1/Job/GetJobSearchTips',
      data: {
        kwd: this.data.kwd,
        size: 5,
      },
    }).then(function(data) {
      let tipNameArr = [];
      data.forEach(function(elem) {
        // 搜索提示字段转换小写展示 11/8
        elem = elem.toLowerCase();
        tipNameArr.push(elem.split(_this.data.kwd));
      });
      _this.setData({
        searchTipList: tipNameArr,
        isSearchTipReady: true,
      });
      if (_this.data.kwd !== _this.data.tipKwd) {
        _this.ajaxGetJobSearchTip(_this.data.tipKwd);
      }
    });
  },
  ajaxGetSearchHistoryList: function() {
    if (!app.globalData.isLogin) return;
    const _this = this;
    wx.$http({
      url: '/v1/JobSearchHistory/List',
      ignoreLogin: true,
      data: {
        size: 20,
        page: 1,
      }
    }).then(function(data) {
      if (data) {
        _this.setData({
          historyList: data,
        });
      }
      
    });
  },
  ajaxClearSearchHistory: function() {
    const _this = this;
    wx.$http({
      url: '/v1/JobSearchHistory/ClearSearchHistory',
    }).then(function(data) {
      wx.showToast({
        title: '历史记录成功',
        icon: 'success',
        duration: 2000,
        success: function() {
          _this.setData({
            historyList: [],
          });
        },
      })
    });
  },
  onReachBottom: function() {
    if (this.data.isShowSearchTipPanel || !this.data.kwd) {
      return;
    }
    this.setData({
      'filters.page': this.data.filters.page + 1,
    });
    this.ajaxGetJobList();
  },
})