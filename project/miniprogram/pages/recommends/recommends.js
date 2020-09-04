const utils = require('../../utils/util.js');
const app = getApp();
Page({
  data: {
    navHeight: '',
    showNavBut: false,
    filters: {
      page: 1,
      size: 5,
      status: -1,   
    },
    isLast: false,
    list: [],
    count: -1,
    menu: [
      {
        id: -1,
        name: '已投递',
        key:'',
        badgeNum: 0
      },
      {
        id: 14,
        name: '有意向',
        key:'IntentionCount',
        badgeNum: 0
      },
      {
        id: 7,
        name: '不合适',
        key: 'ImproperCount',
        badgeNum: 0
      }
    ],
    tabIndex: 1,
    advertisementImage:''
  },
  mixins: [require('../../mixins/navigateTo.js'), require('../../mixins/isLogin.js'), require('../../utils/util.js')],
  onLoad: function (options) {},
  onShow: function () {
    const _this = this;
    _this.getNavHeight();
    _this.initAdvertisementImage();
    if (_this.data._isLogin) {
      _this.mySent();
      _this.getUnreadRecommendNum();
    }else{
      // 手动清空 Tips
      _this.data.menu.forEach(item=>{
         item.badgeNum = 0
      });
      _this.setData({
        menu:_this.data.menu
      });
    }
  },
  initAdvertisementImage(){
    wx.$http({
      url: '/v1/Account/GetMessageImage',
    }).then(res=>{
      this.setData({
        advertisementImage:res.Img
      })
    }).catch(err=>{
      console.loe(err,'err');
    })
  },
  jumpApplet:function(){
    wx.navigateToMiniProgram({
      appId: "wx3988aa3ac4ceb293"
    })
  },
  getUnreadRecommendNum: function () {
    var _this = this;
    wx.$http({
      url: '/v1/member/GetTipNums',
    }).then(function (res) {
      let resData = res;
      _this.data.menu.forEach(item=>{
        if(item.key!=""){
          item.badgeNum = resData[item.key]
        }
      });
      _this.setData({
        menu:_this.data.menu
      });
    });
  },
  ajaxGetMemberJobList: function (filters) {
    if (this.data.isLast) return;
    const _this = this;
    wx.$http({
      url: '/v1/Member/GetApplicationJobList',
      data: filters,
    }).then(function (data) {
      _this.compileList(data);
    });
  },
  changeStatus: function (e) {
    let isE = typeof e === 'object';
    const type = isE ? Number(e.currentTarget.dataset.type) : e;
    this.setData({
      'filters.status': type,
      isLast: false,
      'filters.page': 1
    });
    // 此处优化为登录 再去请求数据
    if(this.data._isLogin){
      this.getList();
    }
  },
  mySent () {
    this.ajaxGetMemberJobList(this.data.filters);
  },
  compileList: function (data) {
    if (data.Page === 1) {
      this.setData({
        'list': data.Data,
        'count': data.RecordCount,
      });
    } else {
      this.setData({
        'list': this.data.list.concat(data.Data),
      });
    }
    if (data.RecordCount <= data.Page * data.PageSize) {
      this.setData({
        isLast: true
      })
    }
  },
  getList: function () {
    let filters = Object.assign({}, this.data.filters);
    this.ajaxGetMemberJobList(filters);
  },
  onReachBottom () {
    if (this.data.tabIndex == 1) {
      this.data.filters.page++;
      this.ajaxGetMemberJobList(this.data.filters);
      return;
    }
  }
})