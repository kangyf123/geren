const util = require('../../utils/util.js');
const api = require("../../common/js/api.js");
Page({
  data: {
    // query Create by Allen.sun on  2020/03/16
    queryHeadhunts: {
      City: "",
      Province: "",
      Page: 1,
      Size: 10
    },
    resQueryHeadhunts: {},
    localData: null,
    dataHeadhunts: [],
    navHeight: '',
    showNavBut: false,
    JobApplicationText: '求职意向',
    headhunterList: [],
    job: {
      filters: {
        page: 1,
        size: 5,
        orderType: 1, // 1是按发布时间排序，2是按照职位年薪上限排序
        SearchKeyWord: '',
        City:"",
        Province:""
      },
      list: [],
      count: -1, // -1代表还没有请求过数据，0以及以上代表数据条数
      isLogin: false,
      isLoading: false,
    },
    isJobSearchPanelFixed: false,
    bannerList:[],
  isEmptyRecommend:false,
  },
  mixins: [require('../../mixins/navigateTo.js'), require('../../mixins/isLogin.js'), require('../../utils/util.js'), require("../../mixins/trackEvent.js")],
  onShow: function() {
    let _this = this;
    if (_this.data._isLogin) {
      this.GetResumePercent();
    }
    wx.getStorage({
      key: 'needRefersh',
      success: function (res) {
        if (!res.data) return;
        wx.pageScrollTo({
          scrollTop: 0,
        })
        util.handleGetTabBar(_this, 0);
        _this.resetData();
        _this.getNavHeight();
        if (_this.data._isLogin) {
          _this.ajaxGetMemberDesiredInfo();
        } else {
          _this.setData({
            JobApplicationText: '求职意向',
          })
        }
        wx.setStorageSync("needRefersh", false)
     }
    });
  },
  onLoad:function () {
    util.RandomCode.create("userRandomCode");
    this.getBannerList();
    util.handleGetTabBar(this, 0);
    this.resetData();
    this.getNavHeight();
    if (this.data._isLogin) {
      this.ajaxGetMemberDesiredInfo();
      //this.GetResumePercent();
    } else {
      this.setData({
        JobApplicationText: '求职意向',
      })
    }
  },
  // get home banner list Create by Allen.sun on 2020/3/19
  getBannerList () {
    let _this = this;
    wx.$http({
      url: api.GetCBanner,
    }).then(res => {
      _this.setData({
        bannerList: res
      })
    })
  },
  switchjumper (e) {
    let data = e.currentTarget.dataset, isInner = data.isinner, innerUrl = data.inner, outerUrl = data.outer, title = data.title, pageId = data.pageid
    outerUrl = "/pages/common_h5/index" + "?url=" + outerUrl + "&title=" + title;
    // 4微聘内部  5微聘外部  6 ABC英语  埋点
    if (pageId == 5 || pageId == 4 || pageId == 6) {
      let configObj = { 4: "banner_wp_1", 5: "banner_wp_2",  6:"banner_TutorABC"};
      let key = configObj[pageId];
      this.trackEvent(function (options, track) {
        track(options[key].id, { text: options[key].text })
      })
    }
    wx.navigateTo({
      url: isInner ? innerUrl : outerUrl,
    })
  },
  // method for function briage center Create by Allen.sun on 2020/03/16
  funcBriageCenter(funcTir, func) {
    let next = function () {
      func.call(this);
    }.bind(this);
    funcTir(next)
  },
  // user local data for amap Create by Allen.sun on 2020/3/12
  // 优化缓存 Modified by Allen.sun on 2020/05/09
  getUserLocation: function (next) {
    let _this = this;
    let n = next;
    next = function (res) {
     res && _this.setData({
        "queryHeadhunts.City": res.City,
        "queryHeadhunts.Province": res.Province,
        "job.filters.City": res.City,
        "job.filters.Province": res.Province,
        localData: res
      })
      n.call(this)
    }
    let loc = wx.getStorageSync("localData");
    if (loc) {
      this.setData({
        localData: loc
      })
      next(loc);
      return;
    }
    util.getLocation().then(res => {
      wx.setStorage({
        key: 'localData',
        data: res,
      })
      next(res);
    }).catch(function (mis) {
      next(null ,mis);
    })
  },
   // lifeCycle onShow get resume percent by Allen.sun on 2020/3/16
  GetResumePercent () {
    let _this = this;
    wx.$http({
      url: api.GetResumePercent,
      method:"get"
    }).then(res => {
      _this.setData({
        isFullResume: res
      })
    })
  },
  resetData: function () {
    this.changeFilter(undefined, 'orderType', 1);
  },
  // DONE: recommed headhuntings list Create by Allen.sun on 2020/03/12
  getRecommedHeadhuntings: function () {
    if (this.data.resQueryHeadhunts.isLast) {
      return;
    }
    const _this = this;
    this.setData({
      isLoading: true,
    });
    wx.$http({
      url: api.GetHeadhunterList,
      data: this.data.queryHeadhunts,
      method: "post"
    }).then(res => {
      _this.setData({
        dataHeadhunts: res.Page > 1 ? _this.data.dataHeadhunts.concat(res.data): res.data,
        resQueryHeadhunts: {
          RecordCount: res.RecordCount,
          Page: res.Page,
          PageSize: res.PageSize,
          isLast: res.RecordCount < res.PageSize * Page
        }
      })
    })
  },
  ajaxGetJobList: function() {
    const _this = this;
    this.setData({
      isLoading: true,
    });
    wx.$http({
      url: '/v1/Job/List',
      data: this.data.job.filters,
      method:"post"
    }).then(function(data) {
      // add switch list state Create by Allen.sun on 2020/03/12
      let count = data.RecordCount, list = data.Data, isEmptyRecommend = count == 0;
      _this.setData({
        isEmptyRecommend: isEmptyRecommend
      })
      if (isEmptyRecommend) {
        _this.funcBriageCenter(_this.getUserLocation, _this.getRecommedHeadhuntings)
        return
      }
      if (data.Page === 1) {
        _this.setData({
          'job.list': list,
          'job.count': count,
        });
      } else {
        _this.setData({
          'job.list': _this.data.job.list.concat(list),
        });
      }
      _this.setData({
        isLoading: false,
      });
    });
  },
  changeFilter: function(e, name, value) {
    let filterName, filterValue,pointkey;
    if (e) {
      const data = e.currentTarget.dataset;  
      filterName = data.filterName;
      filterValue = data.filterValue;
      pointkey = data.pointkey;
      // 设置埋点 create by Allen.sun on 2020/04/07
      pointkey ? this.trackEvent(function (options, track) {
        track(options[pointkey].id, { text: options[pointkey].text})
      }) : "";
    } else {
      filterName = name;
      filterValue = value;   
    }
   
    this.setData({
      ['job.filters.' + filterName]: filterValue,
      'job.filters.page': 1,
      'job.list': [],
    });
    this.funcBriageCenter(this.getUserLocation, this.ajaxGetJobList)
  },
  onReachBottom: function() {
    // add huntHeads reach bottom logic Create by Allen.sun on 2020/03/16
    if (this.data.isEmptyRecommend) {
      this.data.queryHeadhunts.Page++;
      this.getRecommedHeadhuntings(); 
      return;
    }
    if (this.data.job.count > -1 && this.data.job.filters.page * this.data.job.filters.size >= this.data.job.count) {
      return;
    }
    this.setData({
      'job.filters.page': this.data.job.filters.page + 1,
    });
    this.ajaxGetJobList();
  },
  ajaxGetMemberDesiredInfo: function () {
    const _this = this;
    wx.$http({
      url: '/v1/Member/GetMemberDesiredInfo',
    }).then(function (data) {
      const nameArr = [];
      if (data.DesiredOccupations && data.DesiredOccupations.length > 0) {
        data.DesiredOccupations.forEach(function (elem) {
          nameArr.push(elem.OccupationName);
        });
      }
      
      const name = nameArr.join('、');
      _this.setData({
        JobApplicationText: name || '求职意向',
      })
    })
  },
  onShareAppMessage: function () {
    return {
      title: '找工作 找猎头 保密求职',
      path: '/pages/home/home',
      imageUrl: '../../imgs/share-img.png',
    }
  },
  onPullDownRefresh: function () {
    this.resetData();
    if (this.data._isLogin) {
      this.GetResumePercent();
    }
    wx.stopPullDownRefresh();
  },
})