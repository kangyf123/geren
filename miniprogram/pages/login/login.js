//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    navHeight: '',
    showNavBut: true,
    userInfo: {},
    popup: {
      isShow: false,
    },
  },
  mixins: [require('../../mixins/navigateTo.js'), require('../../mixins/form.js'), require('../../utils/util.js')],
  onLoad: function(option) {
    if (option.noOpenid == "true"){
      // create by zhaogang 2020-06-22
      // Note: 用于微信消息订阅 没有openId 时候跳转过来 授权微信登陆 
      wx.showToast({ title: '请授权微信登陆否则，无法使用微信订阅消息', icon: 'none'});
      wx.showModal({
        title: '提示',
        showCancel: false,
        confirmText: "我知道了",
        content: '请授权微信登陆否则，无法使用微信订阅消息哦!',
        success: function (res) {console.log('点击我知道了')}
      })
    }else{
      this.getNavHeight();
    }

  },
  onShow() {
    this.getNavHeight();
  },
  bindgetuserinfo: function(e) {
    console.log(e,'e');
    if (e.detail.errMsg === 'getUserInfo:ok') {
      e.detail.userInfo.encryptedData = e.detail.encryptedData;
      e.detail.userInfo.iv = e.detail.iv;
      this.setData({
        userInfo: e.detail.userInfo,
        'popup.isShow': true,
      });
    } else {
      wx.showToast({
        title: '登录失败',
        icon: 'none',
      });
    }
  },
  bindgetphonenumber: function(e) {
    const _this = this;
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      wx.login({
        success(res) {
          if (res.code) {
            //发起网络请求
            wx.$http({
              url: '/v1/Account/GetSessionKey',
              method: 'post',
              data: {
                IV:e.detail.iv,
                EncryptedData:e.detail.encryptedData,
                Code: res.code,
                SourceType: 1 // C端用户注册来源 0:官网 1：小程序 2：app
              }
            }).then((res) => {
              _this._ajaxLogin({
                LoginType: 3,
                SessonKey: res.sessionKey,
              }, function(data, callback) {
                _this.registerUser(data, e.detail, callback);
              });
            })
          } else {
            wx.showToast({
              title: '登录失败',
              icon: 'none',
            });
          }
        }
      })
    } else {
      this.hidePopup();
    }
  },
  hidePopup: function() {
    this.setData({
      'popup.isShow': false,
    });
  },
  registerUser: function(data, eData, callback) {
    const user = this.data.userInfo;
    wx.$http({
      url: '/v1/Account/UserRegister',
      method: 'post',
      data: {
        PhoneOrEncryptedData: eData.encryptedData,
        ImgUrl: user.avatarUrl,
        NickName: user.nickName,
        Gender: user.gender,
        AesIv: eData.iv,
        SessionKeyId: data.SessonKey,
      }
    }).then(function() {
      callback();
    });
  }
})