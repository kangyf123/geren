// pages/internal-recruitment/internal-job/index.js
import api from "../../../common/js/api.js"
const util = require('../../../utils/util.js');
Page({
  mixins: [require('../../../mixins/navigateTo.js'), require('../../../mixins/trackEvent.js')],
  /**
   * 页面的初始数据
   */

  data: {
      showGuide: false,
      share: false,
      userKey: "",
      heartNum: 0,
      heartState: false,
      src: "",
      loadingCoding: false,
      jumpNum: 60,
      showCodeModal: false,
      CompanyData: {},
      jobList: [],
      welfareList: [],
      imgList: [],
      innerJobList: [],
      whetherList: [
        { state : true , text : '是' , index:0 },
        { state : false , text : '否' , index:1 }
      ],
      HasHrExperience : null,
      HasSalesExperience : null,
      innerJobIndex: null,
      modalQuery: {
          CandidateName: "",
          MobilePhone: "",
          JobRecruitId: "",
          VerifyCode: "",
          Age:""
      },
      companyLocationData: {
          Latitude: null,
          Longitude: null,
          WorkAddress: ""
      },
      CompId: 0,
      bgList: [],
      QCquery: {}
  },
  getShareBGList: function () {
    wx.$http({
        url: api.GetBackgroundPic,
        method: "get"
    }).then(res => {
      this.setData({
          bgList:  res
      })
    })
  } ,
  onClose () {
    this.setData({share: false})
  },
  onUserShare () {
      this.setData({share: true})
  },
  allScreanImage (e) {
    let index = e.currentTarget.dataset.index,
    currentUrl = this.data.imgList[index].AttachmentUrl, 
    urls = this.data.imgList.map(o => o.AttachmentUrl);
    wx.previewImage({
      current: currentUrl,
      urls: urls
    })
  },
  // DONE: 点赞
  _getSupportState() {
    let _this = this;
    wx.$http({
      url: api.GetClientRecruitSupport,
      method: "post",
      data: { clientRecruitId: this.data.videoRecruitClientId, userKey: this.data.userKey }
    }).then(res => {
      // 0 没点赞， 1 点过赞
      _this.setData({
        heartState: res == 1
      })
    })
  },
  // DONE: 模态框数据中转
  modalQueryHandler (e) {
    let key = e.currentTarget.dataset.key, value = e.detail.value, str = "modalQuery." + key;
    this.setData({
      [str]: value
    });
  },
  modalQueryHandler2(e){
    var regNum=new RegExp('[0-9]','g');
    var rsNum=regNum.exec(e.detail.value);
    if(!rsNum){
        setTimeout(()=>{
            wx.showToast({
                title: '只能输入数字',
                icon: 'none'
            })
        },100);
        this.setData({
          'modalQuery.Age': ""
        });
    }else{
      this.setData({
        'modalQuery.Age': e.detail.value
      });
    }
  },
  // DONE: picker 方法
  bindPickerChange (e) {
    let index = e.detail.value
    this.setData({
      innerJobIndex: index,
      'modalQuery.JobRecruitId': this.data.innerJobList[index].Id
    })
  },
  // DONE 是否有HR相关经验
  workExperienceIndexChange (e){
    let index = e.detail.value
    this.setData({
      HasHrExperience: index,
      'modalQuery.HasHrExperience': this.data.whetherList[index].state
    })
  },
  // DONE 是否有销售相关工作经验
  HasSalesExperienceChange (e){
    let index = e.detail.value
    this.setData({
      HasSalesExperience: index,
      'modalQuery.HasSalesExperience': this.data.whetherList[index].state
    })
  },
  // DONE: 获取职位选项
  _getCompanyInnerJobs (id) {
    let _this = this;
    wx.$http({
      url: api.GetQueryJobRecruitList +"?clientRecruitId=" + id,
      method: "post"
    }).then(res => {
      _this.setData({
        innerJobList: res
      })
    })
  },
  // DONE: 公司数据
  _getJobList (id) {
    let _this = this;
    // 为了给后端降低难度 直接拼URL参数
      wx.$http({
        url: api.GetClientRecruitDetails + "?clientRecruitId=" + id,
        method: "post",
      }).then(res => {
        _this.setData({
          CompanyData: res,
          jobList: res.JobRecruitList,
          welfareList: res.ClientWelfareList,
          imgList: res.ClientRecruitAttachmentList,
          src: res.CompanyVideoUrl,
          heartNum: res.SupportAmount,
          videoRecruitClientId: res.Id,
          companyLocationData: {
            Latitude: res.Latitude,
            Longitude: res.Longitude,
            WorkAddress: res.WorkAddress
          }
        });
        _this._getSupportState();
      })
  },
  // DONE: 加入我们
  jionUs () {
    this.setData({
      showCodeModal: true
    });
    this.trackEvent(function (ops, track) {
      track(ops.recruitment_parts_join.id)
    });
  },
  // DONE: 职位列表带参跳转
  jobItemClick (e) {
    wx.navigateTo({
      url: '../internal-job-detail/index?id=' + e.currentTarget.dataset.id,
    })
  },
  // DONE: 重置数据
  modalQueryReset () {
    this.setData({
      modalQuery: {
        CandidateName: "",
        MobilePhone: "",
        JobRecruitId: "",
        VerifyCode: ""
      },
      innerJobIndex: null,
      HasSalesExperience: null,
      HasHrExperience: null
    })
  },
  // DONE: 模态框操作按钮逻辑
  modalBtnClick (e) {
    let type = e.currentTarget.dataset.type, _this = this, cancel = type == "cancel"
    if (cancel) {
      this.setData({
        showCodeModal: false
      });
      this.modalQueryReset()
      return
    }
    this.trackEvent((opts, track) => {
      track(opts.recruitment_parts_join_submit.id)
    })
    this._reportModalData(function () {
      _this.setData({
        showCodeModal: false
      })
      _this.modalQueryReset();
    })
  },
  // DONE：提交模态框数据
  _reportModalData (next) {
    let text = null;
    this.data.modalQuery.Age = Number(this.data.modalQuery.Age);
    if (!this.data.modalQuery.CandidateName) {
      text = "请填写您的姓名"
    }
    if (!this.data.modalQuery.MobilePhone) {
      !text && (text = "请填写您的电话号码");
    }
    if (!this.data.modalQuery.VerifyCode) {
      !text && (text = "请输入验证码");
    }
    if (this.data.modalQuery.Age < 1 ){
      text = "年龄不能小于1"
    }
    if (!this.data.modalQuery.JobRecruitId) {
      !text && (text = "请选择您应聘的职位");
    }
    if (this.data.modalQuery.HasHrExperience == null) {
      !text && (text = "请选择是否有HR相关经验");
    }
    if (this.data.modalQuery.HasSalesExperience == null) {
      !text && (text = "请选择是否有销售相关工作经验");
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
  // DONE: 添加点赞
  addSupport() {
    let _this = this;
    wx.$http({
      url: api.AddClientRecruitSupport,
      method: "post",
      data: { clientRecruitId: this.data.videoRecruitClientId, userKey: this.data.userKey }
    }).then(num => {
      _this.setData({ heartNum: this.data.heartNum+1 })
    })
  },
  // DONE：获取验证码接口
  _getCode (phone, next) {
    let text = "";
    if (!phone) {
      text = "请输入电话号"
    }
    if (!(/^1[3456789]\d{9}$/.test(phone))) {
      !text && (text ="输入的电话号格式有误")
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
  // DONE: 获取验证码
  getCode () {
    let _this = this;
    if (this.data.loadingCoding)  return;
    this._getCode(this.data.modalQuery.MobilePhone, function () {
      _this.setData({ loadingCoding: true });
      _this.setJumpNum();
    });
  },
  // DONE: 验证码逻辑
  setJumpNum () {
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
          jumpNum: _this.data.jumpNum -1
        })
    }, 1000);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 内招管理所属顾问Id 为非必填
    this.data.modalQuery.StaffId = options.StaffId || 0;
    this.data.userKey = util.RandomCode.getCode("userRandomCode");
    this.data.CompId = options.scene ? decodeURIComponent(options.scene) : options.id;
    this.setData({
        QCquery: {
            appid: "wx2b32ce8195bd6d29",
            secret: "0c516c4783b16bdd1e28c976b2bc87a6",
            page: "pages/internal-recruitment/internal-job/index",
            scene: "id=" + this.data.CompId
        }
    });
    this._getJobList(this.data.CompId);
    this._getCompanyInnerJobs(this.data.CompId);
    this.initGuideState();
    this.getShareBGList();
  },
  event_iknow: function () {
    this.setData({
        showGuide: false
    });
    wx.setStorageSync("isFirstToJob", true);
  },
  initGuideState: function () {
      let isFirstToJob = wx.getStorageSync("isFirstToJob");
      !isFirstToJob && this.setData({showGuide: true});
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
      title: '告别前任，从"薪"出发',
      imageUrl: "https://rnss.oss-cn-beijing.aliyuncs.com/StaffFiles/ruishijingying/222.jpg"
    }   
  }
})