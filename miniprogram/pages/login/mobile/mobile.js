Page({
  data: {
    navHeight: '',
    showNavBut: true,
    mobile: '',
    captcha: '',
    isSendCaptcha: false,
    captchaCountDown: 0,
  },
  mixins: [require('../../../mixins/form.js'), require('../../../utils/util.js')],
  onLoad: function () {
    this.getNavHeight();
  },
  onShow: function () {
    this.getNavHeight();
  },
  receiveCaptcha: function () {
    if (this.data.captchaCountDown > 0) {
      return;
    }
    const isValid = this._validate([
      this.getValidateConf().mobile,
    ]);

    if (!isValid) {
      return;
    }
    this._ajaxSendVerifyCode();
    this.setData({
      captchaCountDown: 59,
    });
    const _this = this;
    const timer = setInterval(function () {
      _this.setData({
        captchaCountDown: _this.data.captchaCountDown - 1,
      });

      if (_this.data.captchaCountDown <= 0) {
        clearInterval(timer);
      }
    }, 1000);
  },
  getValidateConf: function () {
    return {
      mobile: {
        field: 'mobile',
        name: '手机号',
        required: true,
        type: 'mobile',
      },
      captcha: {
        field: 'captcha',
        name: '验证码',
        maxLen: 6,
        minLen: 6,
        required: true,
      }
    }
  },
  loginAndNativate: function () {
    if (!this.data._isSubmitEnable) {
      return;
    }
    const isValid = this._validate([
      this.getValidateConf().mobile,
      this.getValidateConf().captcha,
    ]);
    if (!isValid) {
      return;
    }
    this._ajaxLogin({
      LoginType: 2,
      Verifycode: this.data.captcha,
      AccountName: this.data.mobile,
    });
  },
  login: function () {
    const _this = this;
    setTimeout(function () {
      _this.loginAndNativate();
    }, 0);
    
  },
  
})
