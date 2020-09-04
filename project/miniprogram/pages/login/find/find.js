
Page({
  data: {
    navHeight: '',
    showNavBut: true,
  },
  mixins: [require('../../../mixins/form.js'), require("../../../mixins/navigateTo.js"), require('../../../utils/util.js')],
  getValidateConf: function () {
    return {
      email: {
        field: 'email',
        name: '邮箱',
        required: true,
        type: 'email',
      },
    }
  }, 
  onLoad: function (options) {
    this.getNavHeight();
  },
  onShow: function () {
    this.getNavHeight();
  },
  submitAndNavigate: function () {
    if (!this.data._isSubmitEnable) {
      return;
    }
    const isValid = this._validate([
      this.getValidateConf().email,
    ]);
    if (!isValid) {
      return;
    }
    this.ajaxEmailResetPwd();
  },
  submit: function () {
    const _this = this;
    setTimeout(function () {
      _this.submitAndNavigate();
    }, 0);
  },
  ajaxEmailResetPwd: function () {
    const _this = this;
    wx.$http({
      url: '/v1/Account/EmailResetPwd',
      data: {
        account: _this.data.email,
      },
    }).then(function (data) {
      wx.showModal({
        title: '找回密码',
        showCancel: false,
        confirmText: '我知道了',
        content: "用来重设密码的邮件已发至您的邮箱，点击邮件中的链接以重设密码",
        success(res) {
          _this._navigateTo('/pages/login/email/email');
        }
      })
    });
  }
})