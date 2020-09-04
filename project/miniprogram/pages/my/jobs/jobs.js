const utils = require('../../../utils/util.js');
Page({
  data: {
    navHeight: '',
    showNavBut: true,
    filters: {
      page: 1,
      size: 5,
      status: -1,   // 面试状态 
    },
    list: [],
    count: -1,
    menu: [
      {
        id: -1,
        name: '已投递',
      },
      {
        id: 10,
        name: '待面试',
      },
      {
        id: 6,
        name: '已面试',
      },
      {
        id: 8,
        name: 'offer',
      },
      {
        id: 9,
        name: '入职',
      },
      {
        id: 7,
        name: '不合适',
      },
      {
        id: 5,
        name: '已放弃',
      },
    ],
  },
  mixins: [
    require('../../../mixins/navigateTo.js'),
    require('../../../mixins/isLogin.js'),
    require('../../../mixins/list.js'),
    require('../../../utils/util.js')
  ],
  beforeOnShow: function () {
    wx.pageScrollTo({
      scrollTop: 0
    })
    this.setData({
      'filters.status': this.data.filters.status,
      'filters.page': 1,
    });
  },
  onShow: function () {
    this.getNavHeight();
  },
  searchList: function () {
    this.ajaxGetMemberJobApplications();
  },
  ajaxGetMemberJobApplications: function () {
    const _this = this;
    if (this.data.filters.page == 1) {
      _this.setData({
        list: [],
      });
    }
    
    wx.$http({
      url: '/v1/Member/GetMemberJobApplications',
      // url:'/v1/Member/GetMemberJobList',
      data: this.data.filters,
    }).then(function (data) {
      _this.compileList(data);
    });
  },
  changeStatus: function (e) {
    const status = typeof e === 'object' ? e.currentTarget.dataset.type : e;
    if (status != this.data.filters.status) {
      this.setData({
        'filters.status': status,
        'filters.page': 1,
      });
      this.getList();
    }
  }
})