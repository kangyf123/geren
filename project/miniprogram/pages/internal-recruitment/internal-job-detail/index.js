// pages/internal-recruitment/internal-job/index.js
import api from "../../../common/js/api.js";
const util = require('../../../utils/util.js');
Page({
  mixins: [require('../../../mixins/trackEvent.js')],
  /**
   * 页面的初始数据
   */
  data: {
    userKey: "",
    heartNum: 0,
    heartState: false,
    src: "",
    loadingCoding: false,
    jumpNum: 60,
    showCodeModal: false,
    jobData: {},
    modalQuery: {
      CandidateName: "",
      MobilePhone: "",
      JobRecruitId: "",
      VerifyCode: ""
    },
    companyLocationData: {
      Latitude: null,
      Longitude: null,
      WorkAddress: ""
    }
  },
  modalQueryHandler(e) {
    let key = e.currentTarget.dataset.key, value = e.detail.value, str = "modalQuery." + key;
    this.setData({
      [str]: value
    });
  },
  // picker 方法
  bindPickerChange(e) {
    let index = e.detail.value
    this.setData({
      innerJobIndex: index,
      'modalQuery.JobRecruitId': this.data.innerJobList[index].Id
    })
  },
  // 点赞
  _getSupportState() {
    let _this = this;
    wx.$http({
      url: api.GetJobRecruitSupport,
      method: "post",
      data: { jobRecruitId: this.data.modalQuery.JobRecruitId, userKey: this.data.userKey }
    }).then(res => {
      // 0 没点赞， 1 点过赞
      _this.setData({
        heartState: res == 1
      })
    })
  },
  addSupport() {
    let _this = this;
    wx.$http({
      url: api.AddJobRecruitSupport,
      method: "post",
      data: { JobRecruitId: this.data.modalQuery.JobRecruitId, userKey: this.data.userKey }
    }).then(num => {
      _this.setData({ heartNum: this.data.heartNum + 1 })
    })
  },
  // 提交模态框数据
  _reportModalData(next) {
    let text = null;
    if (!this.data.modalQuery.CandidateName) {
      text = "请填写您的姓名"
    }
    if (!this.data.modalQuery.MobilePhone) {
      !text && (text = "请填写您的电话号码");
    }
    if (!this.data.modalQuery.VerifyCode) {
      !text && (text = "请输入验证码");
    }
    if (!this.data.modalQuery.JobRecruitId) {
      !text && (text = "请选择您应聘的职位");
    }
    if (text) {
      wx.showToast({
        title: text,
        icon: "none"
      })
      return;
    }
    wx.$http({
      url: api.JobRecruitJoinUs,
      method: "post",
      data: this.data.modalQuery
    }).then(res => {
      wx.showToast({
        title: '提交成功',
      })
      next();
    })
  },
  // 获取验证码接口
  _getCode(phone, next) {
    let text = "";
    if (!phone) {
      text = "请输入电话号"
    }
    if (!(/^1[3456789]\d{9}$/.test(phone))) {
      !text && (text = "输入的电话号格式有误")
    }
    if (text) {
      wx.showToast({
        title: text,
        icon: "none"
      });
      return;
    }
    next();
    wx.$http({
      url: "/v1/Recruit/RecruitSendVerifyCode?phone=" + phone,
      method: "post",
    }).then(res => {
      console.log(res);
    })
  },
  getCode() {
    let _this = this;
    if (this.data.loadingCoding) return;

    this._getCode(this.data.modalQuery.MobilePhone, function () {
      _this.setData({ loadingCoding: true });
      _this.setJumpNum();
    });

  },
  _getJobDetailData (id) {
      wx.$http({
        url: api.GetJobRecruitDetails + "?jobRecruitId=" + id,
        method: "post",
      }).then(res => {
        this.setData({
          src: res.JobVideoUrl,
          jobData: res,
          heartNum: res.SupportAmount,
          companyLocationData: {
            Latitude: res.Latitude,
            Longitude: res.Longitude,
            WorkAddress: res.WorkAddress
          },
          "modalQuery.JobRecruitId": res.Id
        })
        this._getSupportState();
      })
  },
  jionUs() {
    this.setData({
      showCodeModal: true
    });
    this.trackEvent(function (opts, track) {
      track(opts.recruitment_parts_job_join.id)
    })
  },
  jionItemClick(e) {
    
  },
  modalQueryReset() {
    this.setData({
      "modalQuery.CandidateName": "",
      "modalQuery.MobilePhone": "",
      "modalQuery.VerifyCode": "",
    })
  },
  modalBtnClick(e) {
    let type = e.currentTarget.dataset.type, _this = this, cancel = type == "cancel"
    if (cancel) {
      this.setData({
        showCodeModal: false
      });
      this.modalQueryReset();
      return
    }
    this._reportModalData(function () {
      _this.setData({
        showCodeModal: false
      });
      _this.modalQueryReset();
    })
    this.trackEvent((opts, track) => {
      track(opts.recruitment_parts_job_join_submit.id)
    })
  },
  setJumpNum() {
    let _this = this;
    let timer = setInterval(function () {
      if (_this.data.jumpNum == 0) {
        _this.setData({
          loadingCoding: false,
          jumpNum: 60
        });
        clearInterval(timer)
        return;
      }
      _this.setData({
        jumpNum: _this.data.jumpNum - 1
      })
    }, 1000);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.data.userKey = util.RandomCode.getCode("userRandomCode");
    this._getJobDetailData(options.id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return { 
      title: '加入锐仕方达，自己做老板',
      imageUrl: "https://rnss.oss-cn-beijing.aliyuncs.com/StaffFiles/ruishijingying/111.jpg"
      }   
  }
})