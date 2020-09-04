Page({
  data: {
    showTitleText:'',
    navHeight: '',
    showNavBut: true,
    keywords: '',
    field: '',
    limit: 20,
    counter: 0,
    title: '',
    type: 'input',
    min: 0,
    max: 99999,
    unit: '',
    strict: [],
    isShowPage: false,
  },
  mixins: [require('../../utils/util.js')],
  onLoad: function (options) {
    this.getNavHeight();
    this.setData({
      showTitleText:options.title,
      keywords: options.keywords,
      field: options.field,
      limit: Number(options.limit),
      title: options.title,
      counter: options.keywords.length,
      min: options.min,
      max: options.max,
      isShowPage: false,
    });
    if (options.type) {
      this.setData({
        type: options.type,
      });
    }
    if (options.unit) {
      this.setData({
        unit: options.unit,
      });
    }
    if (options.strict) {
      this.setData({
        strict: options.strict.split(","),
      });
    }
  },
  onShow(){
    this.setData({
      isShowPage: true,
    });
    this.getNavHeight();
  },
  bindInput: function (e) {
    this.setData({
      keywords: e.detail.value,
      counter: e.detail.value.length,
      isEdited: true,
    });
  },
  onSave: function () {
    const _this = this;
    // 之所以要加异步，实际上是为了防止在输入完但是还没失去焦点的时候，直接点击保存，所导致的先执行保存，再执行失去焦点或者是输入的的回调代码所导致的代码执行顺序问题
    setTimeout(function () {
      _this.saveAndRedirect();
    }, 0);
  },
  saveAndRedirect: function () {
    if (this.data.counter === 0) {
      return;
    }
    if (this.data.type === 'email' &&
      !(this.data.keywords.endsWith('.com') && this.data.keywords.indexOf('@') > 0 && (/^\w+@[a-z0-9]+\.[a-z]{2,4}$/.test(this.data.keywords)))) {
      wx.showToast({
        title: '请输入正确的' + this.data.title,
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (this.data.type === 'number') {
      if (isNaN(this.data.keywords)) {
        wx.showToast({
          title: '请输入正确的' + this.data.title,
          icon: 'none',
          duration: 2000
        });
        return;
      }
      if (this.data.keywords.indexOf(".") !== -1) {
        wx.showToast({
          title: this.data.title + '应该是整数',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      if (Number(this.data.keywords) < this.data.min) {
        wx.showToast({
          title: this.data.title + '应该是' + this.data.min + '到' + this.data.max + '之间的整数',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      if (Number(this.data.keywords) > this.data.max) {
        wx.showToast({
          title: this.data.title + '应该是' + this.data.min + '到' + this.data.max + '之间的整数',
          icon: 'none',
          duration: 2000
        });
        return;
      }
    }

    const strict = this.data.strict;
    if (strict.length > 0) {
      if (strict.indexOf("nospace") > -1 && this.data.keywords.indexOf(" ") > -1) {
        wx.showToast({
          title: this.data.title + '中含有空格',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      if (strict.indexOf("nospecialchar") > -1) {
        var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
        if (pattern.test(this.data.keywords)) {
          wx.showToast({
            title: this.data.title + '中含有特殊字符',
            icon: 'none',
            duration: 2000
          });
          return;
        }

      }
    }
    wx.setStorageSync("input", {
      url: '',
      field: this.data.field,
      data: this.data.keywords,
    });
    wx.navigateBack()
  }
})