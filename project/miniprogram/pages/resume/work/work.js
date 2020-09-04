Page({
  data: {
    navHeight: '',
    showNavBut: true,
    query: {
      Company: "",
      ExperienceId: 0,
      DateFrom: "",
      DateTo: "",
      IndustryId: "",
      OccupationId: "",
      IsCurrent: false,
      JobTitle: "",
      Description: "", // 职责业绩
    },
    info: {
      IndustryName: "",
      OccupationText: "", // 职位文字
      IndustryText: "" // 所属行业文字
    },
  },
  mixins: [
    require('../../../mixins/navigateTo.js'),
    require('../../../mixins/resume.js'),
    require('../../../utils/util.js')],
  onLoad: function(options) {
    this.getNavHeight();
    this.setData({
      completeRules: {
        DateTo: 'checkDateTo',
      }
    });
    console.log(this.data.query)
  },
  onShow: function() {
    this.getNavHeight();
  },
  setSelectedDataToStorage: function (e) {
    let id = this.data.query[e.currentTarget.dataset.type],
      idList = [],
      dataType = e.currentTarget.dataset.datatype;
    if (id) {
      idList = [ id ];
    }
    wx.setStorageSync(dataType, idList);
  },
})