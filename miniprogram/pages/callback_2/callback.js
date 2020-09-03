// pages/callback/callback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navHeight: '',
    showNavBut: true,
    otherReasonMsg: "",
    id: "",
    curReasonId: 10,
    disabled: true,
  },
  mixins: [require('../../utils/util.js')],
  onLoad: function (val) {
    this.setData({
      id: val.id
    });
    this.getNavHeight();
  },
  onShow: function () {
    this.getNavHeight();
  },
  resetDisabled: function () {
    let disabled = true;
    if (this.data.curReasonId == 10 && this.data.otherReasonMsg) {
      disabled = false;
    }
    if (this.data.curReasonId != -1 && this.data.curReasonId != 10) {
      disabled = false;
    }
    this.setData({
      disabled: disabled,
    });
  },
  save(e) {
    const _this = this;
    let id = _this.data.id;
    wx.$http({
      url: '/v1/Member/GiveupJob',
      method: 'post',
      data: {
        JobId: id,
        TypeId: this.data.curReasonId,
        Content: this.data.otherReasonMsg,
      },
    }).then(function (data) {
      wx.navigateTo({
        url: '/pages/notice_4/notice?id=' + id,
      })
    });
  },
  bindInput(e) {
    this.setData({
      otherReasonMsg: e.detail.value
    });
    this.resetDisabled();
  },
})