const utils = require('../../../utils/util.js');
Page({
  data: {
    navHeight: '',
    showNavBut: true,
    filters: {
      page: 1,
      size: 5,
    },
    list: [],
    count: -1,
  },
  mixins: [require('../../../mixins/list.js'), require('../../../mixins/navigateTo.js'), require('../../../utils/util.js')],
  onLoad: function (options) {
    this.getNavHeight();
  },
  onShow: function () {
    this.getNavHeight();
  },
  searchList: function () {
    this.ajaxGetMemberOfferList();
  },
  ajaxGetMemberOfferList: function () {
    const _this = this;
    wx.$http({
      url: '/v1/Member/GetMemberOfferList',
      data: this.data.filters,
    }).then(function (data) {
      data.Data.forEach(function (elem) {
        elem.dateObj = utils.getDatePartObj(elem.EntryTime);
      });
      _this.compileList(data);
    });
  },
})