Page({
  data: {
    name: '',
    id:'',
    similarList: [],
    navHeight: '',
    showNavBut: true
  },
  onLoad: function () {
    this.getNavHeight();
  },
  onShow() {
    this.getNavHeight();
  },
  mixins: [require('../../mixins/navigateTo.js'), require('../../utils/util.js')],
  navigateBack: function () {
    wx.navigateBack({
      delta: 2
    })
  },
})