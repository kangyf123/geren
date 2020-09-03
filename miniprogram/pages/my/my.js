const utils = require('../../utils/util.js');
const app = getApp();
Page({
  navHeight: '',
  showNavBut: true,
  data: {
    info: {},
    statistics: {},
    data: {},
    isPageShow: false,
    IsAssessor:false,
    advertisementImage:''
  },
  mixins: [require('../../mixins/navigateTo.js'), require('../../mixins/isLogin.js'), require('../../utils/util.js'), require("../../mixins/trackEvent.js")],
  onLoad: function (options) {
    this.getNavHeight();
  },
  onShow: function () {
    this.getNavHeight();
    this.initAdvertisementImage();
    if (this.data._isLogin) {
      this.ajaxGetBasicInfo();
    } else {
      this.setData({
        info: {},
        statistics: {},
        data: {},
        isPageShow: true,
      });
    }
  },
  initAdvertisementImage(){
    wx.$http({
      url: '/v1/Account/GetAdImage',
    }).then(res=>{
      this.setData({
        advertisementImage:res.Img
      })
    }).catch(err=>{
      console.loe(err,'err');
    })
  },
  openApplet:function(){
    wx.navigateToMiniProgram({
      appId: "wx3988aa3ac4ceb293"
    })
  },
  ajaxGetBasicInfo: function () {
    const _this = this;
    wx.$http({
      url: '/v1/Member/GetMyInfo',
    }).then(function (data) {
      data.NewPhone = data.Phone;
      data.Phone = utils.getMobileWithStar(data.Phone);
      data.Birthdate = utils.fixDateStr(data.Birthdate);
      data.PictureUrl = utils.fixPitureStr(data.PictureUrl);
      if (data.LiveLocationId == '00') {
        data.LiveLocationId = "";
      }
      _this.setData({
        info: data,
        IsAssessor: data.IsAssessor,
        isPageShow: true,
        data: {
          ResumePercent: data.ResumePercent,
          AttachResumeCount: data.AttachResumeCount,
        },
      });
    });
  },
  logout: function () {
    const _this = this;
    this.trackEvent(function (options, track) {
      track(options.botton_outlogin.id, { text: options.botton_outlogin.text })
    })
    wx.showModal({
      title: '提示',
      content: '确定退出当前帐号？',
      confirmText: '退出',
      confirmColor: '#3B87FF',
      success(res) {
        if (res.confirm) {
          app.logout();
          _this._navigateTo('/pages/login/login');
          wx.setStorage({
            key: 'needRefersh',
            data: true,
          })
        }
      }
    })
  },
  saveBaseInfoDataToStorage: function () {
    wx.setStorageSync("input12", this.data.info);
  },
  onHide: function () {
    this.setData({
      isPageShow: false,
    });
  },
  switchTabItem () {
    this.trackEvent(function (options, track) {
      track(options.botton_record.id, { text: options.botton_record.text })
    })
    wx.switchTab({
      url: '/pages/recommends/recommends?tabIndex=1'
    });
    app.globalData.switchTabData.tabIndex = 1
  }
})