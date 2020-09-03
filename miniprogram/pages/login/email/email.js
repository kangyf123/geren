Page({
  data: {
    navHeight:'',
    showNavBut:true,
    email: '',
    pwd: '', 
  },
  mixins: [require('../../../mixins/navigateTo.js'), require('../../../mixins/form.js'), require('../../../utils/util.js')],
  login: function() {
    const _this = this;
    setTimeout(function () {
      _this.loginAndNavigate();
    }, 0);
  },
  loginAndNavigate: function () {
    if (!this.data._isSubmitEnable) {
      return;
    }
    const isValid = this._validate([
      this.getValidateConf().email,
      this.getValidateConf().pwd,
    ]);
    if (!isValid) {
      return;
    }
    this._ajaxLogin({
      LoginType: 1,
      AccountName: this.data.email,
      Pwd: this.data.pwd,
    });
  },
  onLoad: function () {
    this.getNavHeight();
  },
  onShow: function () {
    this.getNavHeight();
  },
  getValidateConf: function() {
    return {
      email: {
        field: 'email',
        name: '邮箱',
        required: true,
        type: 'email',
      },
      pwd: {
        field: 'pwd',
        name: '密码',
        required: true,
        minLen: 6,
        maxLen: 20,
      }
    }
  },
})