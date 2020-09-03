
const app = getApp();
const api = require("../../../common/js/api.js")


Page({
  data: {
    navHeight: '',
    showNavBut: true,       
    info: {},
    statistics: {},
    isPageShow: false,
    backUrl: '',
    tabIndex: 0,
    developerHandler: false,
    querySuccCase: {
      staffId:"",
      pageSize: 5,
      page: 1
    },
    resSuccCase:{},
    dataSuccCase:[],
    BusinessScopeNameLength: 0,
    EnNameLength:0
  },
  mixins: [
    require('../../../mixins/isLogin.js'),
    require('../../../mixins/navigateTo.js'), 
    require('../../../mixins/list.js'), 
    require('../../../utils/util.js'),
    require('../../../mixins/screenAdapt.js'),
    require('../../../mixins/trackEvent.js'),
  ],
  onLoad: function (options) {
    const id = options.id;
    const phoneNum = options.phoneNum;
    this.setData({
      'filters.id': id,
      'filters.phoneNum': phoneNum,
      'filters.staffid': id,
      'querySuccCase.staffId': id,
      'querySuccCase.phoneNum': phoneNum
    });
    this.ajaxHeadhunterData();
    // 去掉首页加载...
    // this.getSuccCase();
    this.getNavHeight();
    if (options.share) {
      this.setData({
        'backUrl': '/pages/home/home',
      });
    }
  },
  onShow: function () {
    this.getNavHeight();
  },
  searchList: function () {
    this.ajaxGetRecruitingWorkList();

  },
  ajaxHeadhunterData: function () {
    const _this = this;
    wx.$http({
      url: '/v1/AdvisersRecommend/GetStaffDetail',
      data: {
        staffid: this.data.filters.id,
        phoneNum: this.data.filters.phoneNum
      },
    }).then(function (data) {
      _this.setData({
        info: data.StaffInfo,
        statistics: data.WorkStatistic,
        isPageShow: true,
        BusinessScopeNameLength :data.StaffInfo.BusinessScopeName.length,
        EnNameLength: data.StaffInfo.EnName.length
      });
    });
  },
  ajaxGetRecruitingWorkList: function () {
    this.data.developerHandler = false;
    const _this = this;
    wx.$http({
      url: '/v1/AdvisersRecommend/GetRecruitingWorkList',
      data: this.data.filters,
    }).then(function (data) {
      _this.compileList(data);
    });
  },
  showCallPopup: function () {
    this.trackEvent(function (options, track) {
      track(options.botton_jobZX.id, { text: options.botton_jobZX.text})
    })
    if (!this.data._isLogin) {
      this._navigateTo('/pages/login/login');
      return;
    }
    this.selectComponent("#callPopup").show();
  },
  onShareAppMessage: function () {
    return {
      title: this.data.info.EnName + '的招聘主页',
      path: '/pages/headhunters/details/details?id=' + this.data.info.StaffId + "&share=1",
    }
  },
  itemClick (e) {
    wx.pageScrollTo({
      scrollTop: 0,
    })
    let index = e.currentTarget.dataset.index, pointkkey;
    if (index == this.data.tabIndex)  return;
    index == 1 ? this.getSuccCase():'';
    this.setData({
      tabIndex: index
    });
    index == 0 ? this.data.developerHandler = false : this.data.developerHandler = true; 
    pointkkey = index == 0 ? "tab_gogoing" : "tab_success";
    this.trackEvent(function (options, track) {
      track(options[pointkkey].id, {text: options[pointkkey].text})
    })
  },

  // add get succ case method Create by Allen.sun on 2020/03/17
  getSuccCase () {
    if (this.data.resSuccCase.isLast) {
      return;
    }
    let _this = this;
    wx.$http({
      url: api.GetManageSuccessCase,
      data: this.data.querySuccCase
    }).then(res => {
      _this.setData({
        dataSuccCase: res.Page > 1 ? _this.data.dataSuccCase.concat(res.data) : res.data,
        resSuccCase: {
          RecordCount: res.RecordCount,
          Page: res.Page,
          PageSize: res.PageSize,
          isLast: res.RecordCount <= res.PageSize * res.Page
        }
      });
    })
  },
  onReachBottom: function () {
    if (!this.data.developerHandler) return;
    this.data.querySuccCase.page++;
    this.getSuccCase();
  }
})