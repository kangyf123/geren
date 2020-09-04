Page({
  data: {
    content: '',
    navHeight: '',
    showNavBut: true,
    isEdited: false,
  },
  mixins: [require('../../../utils/util.js')],
  onLoad: function() {
    const input = wx.getStorageSync('input');
    this.setData({
      content: input,
    });
    wx.setStorageSync('introInput', input);
    this.getNavHeight();
  },
  onShow() {
    this.getNavHeight();
  },
  bindSave: function() {
    const _this = this;
    wx.$http({
      url: '/v1/Member/EditMemberIntroduction',
      method: 'post',
      data: {
        introduction: this.data.content,
      },
    }).then(function(data) {
      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 2000,
        complete: function() {
          wx.setStorageSync("input", {
            url: '',
            field: 'info.Statements',
            data: _this.data.content,
          });
          wx.navigateBack();
        },
      })
    });
  },
  bindInput: function(e) {
    this.setData({
      content: e.detail.value,
      isEdited: true,
    });
    
    let oldIntroInput = wx.getStorageSync('introInput');
    let isAlert;
    if (oldIntroInput == e.detail.value) {
      isAlert = true;
    } else {
      isAlert = false;
    }
  },
})