Page({
  data: {
    name: '',
    id:'',
    similarList: [],
    navHeight: '',
    showNavBut: true
  },
  onLoad: function (options) {
    this.getNavHeight();
    const id = options.id;
    this.setData({
      name: options.name,
      id:id
    });
  },
  onShow() {
    this.getNavHeight();
  },
  mixins: [require('../../mixins/navigateTo.js'), require('../../utils/util.js')],
  navigateBack: function () {
    wx.navigateBack()
  },
})