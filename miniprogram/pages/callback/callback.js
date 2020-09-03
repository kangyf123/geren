// pages/callback/callback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navHeight: '',
    showNavBut:true,
    otherReasonMsg:"",
    id:"",
    curReasonId: -1,
    disabled: true,
    reasonConf: [
      {
        id: 5,
        msg: '位置太远',
      },
      {
        id: 6,
        msg: '薪酬偏低',
      },
      {
        id: 7,
        msg: '对此行业不感兴趣',
      },
      {
        id: 8,
        msg: '对此公司不感兴趣',
      },
      {
        id: 9,
        msg: '对此工作内容不感兴趣',
      },
      {
        id: 10,
        msg: '其他原因',
      }
    ],
  },
  mixins: [require('../../utils/util.js')],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(val) {
    this.setData({
      id: val.id
    });
    this.getNavHeight();
  },
  onShow:function(){
    this.getNavHeight();
  },
  changeCurResonId: function (e) {
    const id = e.currentTarget.dataset.id;
    this.setData({
      curReasonId: id,
    });
    this.resetDisabled();
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
  save(e){
    const _this = this;
    let id = _this.data.id,
      content = this.data.otherReasonMsg;
    if (this.data.curReasonId != 10) {
      content = '';
    }
    wx.$http({
      url: '/v1/Member/GiveupJob',
      method: 'post',
      data: {
        JobId: id,
        TypeId: this.data.curReasonId,
        Content: content,
      },
    }).then(function (data) {
        wx.navigateTo({
          url: '/pages/notice_2/notice?id=' + id,
        })
    });
  },
  bindInput(e){
    this.setData({
      otherReasonMsg: e.detail.value
    });
    this.resetDisabled();
  },
})