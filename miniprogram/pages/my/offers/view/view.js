Page({
  data: {
    navHeight: '',
    showNavBut: true,
    data: {},
  },
  mixins: [require('../../../../utils/util.js')],
  onLoad: function (options) {
    this.getNavHeight();
    const id = options.id;
    this.ajaxGetOfferDetail(id);
  },
  ajaxGetOfferDetail: function (id) {
    const _this = this;
    wx.$http({
      url: '/v1/Member/GetOfferDetail',
      data: {
        jobCandidateId: id,
      },
    }).then(function (data) {
      data.OfferDetail.FormatYearSalary = data.OfferDetail.YearSalary / 10000;
      data.OfferDetail.OfferTimeStr = data.OfferDetail.OfferTime.split(" ")[0],
      _this.setData({
        data: data.OfferDetail,
      });
    });
  }
})