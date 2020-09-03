const utils = require('../../../utils/util.js');
const app = getApp();
Page({
  data: {
    newBirthdate:'', // 用于急速应聘显示真实年龄
    now:new Date(),
    showFirstModel: false,
    HasFastJobApplayed: false, // 用于极速应聘按钮展示
    hostApp: '',
    navHeight: '',
    showNavBut: true,
    job: {},
    staff: {},
    recommendStepData: {},
    memo: {},
    similarList: [],
    getItOnlyOnce: false, // 滚动加载 获取完成取消获取
    isShowApplyResumePanel: false,
    resumeList: [],
    curResumeId: 0,
    stepStatus: "", // 推荐流程状态 -1.已投递 1.加入项目 2.推给客户 3.否决人选 4.推给顾问 5.人选放弃 6.客户面试 7.客户否决 8.确认Offer  9.成功入职 10.预约面试 11.已发Offer 12.人选离职 13.客户确认 14.沟通中
    jobApplayed: false, // 是否已经投递简历
    waiveContent: "", // 放弃原因
    waiveType: "", // 放弃类型 1.不考虑机会 2.放弃面试 3.放弃offer 4.放弃入职
    mapLongitude: null, // 面试纬度
    mapLatitude: null, // 面试经度
    interviewType: null, // 面试类型 1.初试 2.复试 3.终试
    interviewTime: null, // 面时时间
    interviewLocation: null, // 面试地点
    offerTime: null, // offer时间
    entryTime: null, // 入职时间
    currentJobTitle: null, // 入职职位
    detailsJobId: "",
    detailsJobType: "",
    isResumeComplete: false,
    isLoading: false,
    isPageShow: false,
    backUrl: '',
    showType: null, // 未加入项目的添加个状态 -1.普通职位、-2.未投递状态；
    IsActiveDelivery: false,
    isShowIncompleteResume: false, // 简历不完整弹框 默认false
    modelApplyQuickly: false, // 急速应聘弹框 默认false
    loadingCoding: false,
    modalQueryText: {
      CandidateName: '姓名',
      MobilePhone: '电话',
      VerifyCode: '验证码',
      GenderId: '性别',
      Birthdate: '年龄',
    },
    modalQuery: {
      CandidateName: '',
      MobilePhone: '',
      VerifyCode: '',
      GenderId: '',
      Birthdate: '',
      SourceType: 1,
      JobRecruitId: 0
    },
    jumpNum: 60,
    modalQueryGender: null,
    whetherList: [{
        text: '男',
        value: 1,
        index: 0
      },
      {
        text: '女',
        value: 2,
        index: 1
      }
    ],
    hasGetJobDetailOfNoLogin: false // 没登陆查看职位详情
  },
  mixins: [require('../../../mixins/isLogin.js'), require('../../../mixins/navigateTo.js'), require('../../../utils/util.js'), require('../../../mixins/screenAdapt.js'), require("../../../mixins/trackEvent.js")],
  onLoad: function (options) {
    const id = options.id;

    this.setData({
      detailsJobId: id,
    });
    this.getNavHeight();
    if (options.share) {
      this.setData({
        'backUrl': '/pages/home/home',
      });
    }
  },
  onShow: function () {
    // 为了解决每次请求报错 看不到 id 的问题 start
    this.setData({
      hostApp: app.globalData.host
    })
    // 为了解决每次请求报错 看不到 id 的问题 end
    this.getNavHeight();

    // 首次进入 只为分享时候显示提示的文字
    this.initShowFirstModel();
    let id = this.data.detailsJobId;
    const token = wx.getStorageSync('token');
    if (token) {
      this.ajaxGetJobDetail(id, this.resetRecommendBadge, '/v1/Member/GetJobDetail');
      this.setData({
        hasGetJobDetailOfNoLogin: false
      })
    } else {
      this.ajaxGetJobDetail(id, this.resetRecommendBadge, '/v1/Member/GetJobDetailOfNoLogin');
      this.setData({
        hasGetJobDetailOfNoLogin: true
      })
    }
    this.setData({
      isShowApplyResumePanel: false,
      isLoading: false,
    });
  },
  // 急速应聘新增 08-24
  openApplyQuickly: function () {
    this.setData({
      modelApplyQuickly: true,
      isShowApplyResumePanel: false,
      isShowIncompleteResume: false
    })
  },
  // 急速应聘这早层
  event_iknow: function () {
    this.setData({
      showFirstModel: false
    });
    wx.setStorageSync("isShowFirstModel", true);
  },
  // 判断是不是第一次进入
  initShowFirstModel: function () {
    let isFirst = wx.getStorageSync("isShowFirstModel");
    !isFirst && this.setData({
      showFirstModel: true
    });
  },
  // 打开急速详情页面
  openShape: function () {
    wx.navigateTo({
      url: '/pages/JustForSharing/JustForSharing?id=' + this.data.detailsJobId,
    })
  },
  // 性别回显
  GenderChange: function (e) {
    let dataVal = e.detail.value;
    this.setData({
      'modalQueryGender': dataVal,
      'modalQuery.GenderId': this.data.whetherList[dataVal].value
    })
  },
  // 急速应聘提交按钮
  applyQuiklyBut: function () {
    let modalQuery = this.data.modalQuery;
    let modalQueryText = this.data.modalQueryText;
    let errorState = false;
    let _this = this;
    // 校验
    Object.keys(modalQuery).forEach((item, index) => {
      if (errorState) {
        return;
      }
      if (modalQuery[item] === "") {
        errorState = true;
        if (item === 'VerifyCode') {
          wx.showToast({
            title: '请输入' + modalQueryText[item],
            icon: 'none'
          });
          return;
        } else {
          wx.showToast({
            title: '请输入您的' + modalQueryText[item],
            icon: 'none'
          });
          return;
        }
      }
      if (item === 'MobilePhone') {
        if (!/^1[3456789]\d{9}$/.test(modalQuery[item])) {
          errorState = true;
          wx.showToast({
            title: "输入的电话号格式有误",
            icon: 'none'
          });
          return;
        }
      }
    });
    if (!errorState) {
      // 增加职位详情 id
      modalQuery.JobRecruitId = Number(this.data.detailsJobId);

      // 换算年龄
      let Year = new Date().getFullYear();
      let Birthdate = "";

      if (modalQuery.Birthdate != "" && typeof modalQuery.Birthdate != "number") {
        Birthdate = modalQuery.Birthdate.split("-")[0];
        modalQuery.Age = Number(Year) - Number(Birthdate);
      }

      wx.$http({
        url: "/v1/Recruit/FastJobApply",
        method: "post",
        data: modalQuery
      }).then(_ => {
        wx.showToast({
          title: '提交成功',
          icon: 'none'
        });
        _this.closeApplyQuickly();
        // 当前职位仅仅只能进行一次急速应聘
        _this.setData({
          HasFastJobApplayed: true
        })
      })
    }
  },
  bindDateChange: function (e) {
    let val = e.detail.value;

    // 换算年龄
    let Year = new Date().getFullYear();
    let Birthdate = "";
    let newBirthdate = "";

    if (val != "" && typeof val != "number") {
      Birthdate = val.split("-")[0];
      newBirthdate = Number(Year) - Number(Birthdate);
    }
      
    this.setData({
      'modalQuery.Birthdate': val,
      newBirthdate:newBirthdate
    })
  },
  // DONE：获取验证码接口
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
  modalQueryHandler(e) {
    let key = e.currentTarget.dataset.key,
      value = e.detail.value,
      str = "modalQuery." + key;
    this.setData({
      [str]: value
    });
  },
  initCode: function () {
    let _this = this;
    if (this.data.loadingCoding) return;
    this._getCode(this.data.modalQuery.MobilePhone, function () {
      _this.setData({
        loadingCoding: true
      });
      _this.setJumpNum();
    });
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
  resetRecommendBadge: function () {
    app.resetRecommendBadgeNum();
  },
  map: function () {
    this.trackEvent(function (options, track) {
      track(options.botton_checkaddress.id, {
        text: options.botton_checkaddress.text
      })
    })
    let latitude = Number(this.data.recommendStepData.Latitude);
    let longitude = Number(this.data.recommendStepData.Longitude);
    let interviewLocation = this.data.recommendStepData.InterviewLocation;
    let title = this.data.job.Title;
    if (latitude && longitude) {
      wx.openLocation({
        latitude: latitude, // 纬度
        longitude: longitude, // 经度
        scale: 28,
        name: interviewLocation, //位置名
        address: interviewLocation, //地址的详细描写
      })
    } else {
      wx.showToast({
        title: '暂无坐标，无法导航',
        icon: 'none',
      })
    }

  },
  ajaxGetJobDetail: function (id, callback, url) {
    const _this = this;
    wx.$http({
      url: url,
      data: {
        jobid: id,
      },
    }).then(function (data) {
      console.log(data, 'data');

      // 判断是否已经急速应聘了
      _this.setData({
        HasFastJobApplayed: data.JobDetail.HasFastJobApplayed
      })

      const job = data.JobDetail.Job;
      _this.setData({
        showType: data.JobDetail.ShowType,
        IsActiveDelivery: data.JobDetail.IsActiveDelivery
      });
      job.LastUpdateStatusTimeStr = utils.getDateStr(job.LastUpdateStatusTime);
      let dateObj = utils.getDateObj(job.LastUpdateStatusTime),
        month = dateObj.getMonth() + 1,
        date = dateObj.getDate(),
        hours = dateObj.getHours(),
        minutes = dateObj.getMinutes();

      job.LastUpdateStatusTime = `${ dateObj.getFullYear() }-${ month < 10 ? '0' + month : month }-${ date < 10 ? '0' + date : date } ${ hours < 10 ? '0' + hours : hours }:${ minutes < 10 ? '0' + minutes : minutes }`;
      job.IndustryStr = job.Industries.join("、");
      job.DescriptionArr = job.Description.split(/\r?\n/);
      job.CompanyDescriptionArr = job.CompanyDescription.split(/\r?\n/);
      if (data.JobDetail.JobState.JobCandidate && data.JobDetail.JobState.JobCandidate.JobCandidateId) {
        data.JobDetail.JobState.NewestJobCandidateStep.OfferId = data.JobDetail.JobState.JobCandidate.JobCandidateId;
      }

      // 推给客户或者推给顾问的状态，也合并到沟通中
      if (data.JobDetail.Status == 2 || data.JobDetail.Status == 4 || data.JobDetail.Status == 14) {
        data.JobDetail.Status = 14;
      }
      // created zhaogang 0-3-7 都改为状态为不合适 2020-06-28 
      //                  5     (放弃职位) 也放到不合适中
      if (data.JobDetail.Status == 3 || data.JobDetail.Status == 7 || data.JobDetail.Status == 0) {
        data.JobDetail.Status = 7;
      }
      if (data.JobDetail.Status == 8 || data.JobDetail.Status == 11 || data.JobDetail.Status == 13) {
        data.JobDetail.Status = 8;
      }
      if (data.JobDetail.Status == 9 || data.JobDetail.Status == 12) {
        data.JobDetail.Status = 9;
      }
      if (data.JobDetail.JobState.NewestMemo && data.JobDetail.JobState.NewestMemo.Content) {
        data.JobDetail.JobState.NewestMemo.ContentArr = utils.splitStrToArrayByNewLineToken(data.JobDetail.JobState.NewestMemo.Content);
      }
      _this.setData({
        isResumeComplete: data.JobDetail.BaseInfoCompleted,
        job: job,
        memo: data.JobDetail.JobState.NewestMemo,
        staff: data.JobDetail.Staff,
        stepStatus: data.JobDetail.Status,
        recommendStepData: data.JobDetail.JobState.NewestJobCandidateStep,
        isPageShow: true,
      });
      if (data.JobDetail.Status == -1 || data.JobDetail.Status == -2) {
        // 改为滚动加载
        // _this.ajaxGetSimilarJobList(id);
      }
      // callback && callback();
    });
  },
  onReachBottom: function () {
    let similarListLength = this.data.similarList;
    let id = this.data.detailsJobId;
    let statue = this.data.stepStatus;
    // 滚动加载 只加载一次
    if (this.data.getItOnlyOnce) return;
    if (statue == -1 || statue == -2) {
      this.ajaxGetSimilarJobList(id);
    }
  },
  showCallPopup: function () {
    if (!this.data._isLogin) {
      this._navigateTo('/pages/login/login');
      return;
    }
    this.selectComponent("#callPopup").show();

    // 埋点
    this.trackEvent(function (options, track) {
      track(options.botton_zx.id, {
        text: options.botton_zx.text
      })
    })
  },
  // 关闭急速应聘
  closeApplyQuickly: function () {
    this.setData({
      modelApplyQuickly: false,
      modalQueryGender:null,
      modalQuery: {
        CandidateName: '',
        MobilePhone: '',
        VerifyCode: '',
        GenderId: '',
        Birthdate: '',
        SourceType: 1,
        JobRecruitId: 0
      }
    });
  },
  closeApplyJobPanel: function () {
    this.setData({
      isShowApplyResumePanel: false,
    });
  },
  goHome() {
    this.trackEvent(function (options, track) {
      track(options.botton_otherjob.id, {
        text: options.botton_otherjob.text
      })
    })
    // created zhaogang 2020-06-29 亚芳要求 跳到首页 需要刷新页面 故加入此属性
    wx.setStorageSync("needRefersh", true);
    wx.switchTab({
      url: '/pages/home/home'
    })
  },
  applyJob: function () {
    const _this = this;
    if (!this.data.curResumeId || this.data.isLoading) {
      return;
    }

    this.setData({
      isLoading: true,
    });

    wx.$http({
      url: '/v1/Member/ApplyJob',
      method: 'get',
      data: {
        jobid: this.data.job.JobId,
        memberResumeid: this.data.curResumeId,
        deliveryType: 1,
      },
    }).then(function (data) {
      const name = _this.data.staff && _this.data.staff.EnName ? _this.data.staff.EnName : '';
      wx.navigateTo({
        url: '/pages/notice/notice?id=' + _this.data.job.JobId + '&name=' + name,
      });
      _this.setData({
        isLoading: false,
      });
    }, function () {
      _this.setData({
        isLoading: false,
      });
    });
  },
  showUninterested: function (e) {
    const _this = this,
      data = e && e.currentTarget.dataset,
      isPoint = data.point == 1,
      pointkey = data.pointkey;
    // 埋点
    isPoint && pointkey ? this.trackEvent(function (options, track) {
      track(options[pointkey].id, {
        text: options[pointkey].text
      })
    }) : "";
    if (this.data._isLogin) {
      if (this.data.stepStatus == 8) {
        this._navigateTo('/pages/callback_2/callback?id=' + _this.data.job.JobId);
      } else {
        this._navigateTo('/pages/callback/callback?id=' + _this.data.job.JobId);
      }
      return;
    }
  },
  openOffer() {
    this._navigateTo('/pages/my/offers/view/view?id=' + this.data.recommendStepData.OfferId);
  },
  furtherCommunication: function () {
    const _this = this;

    this.trackEvent(function (options, track) {
      track(options.botton_interesting.id, {
        text: options.botton_interesting.text
      })
    })

    wx.$http({
      url: '/v1/Member/CommunicateNext',
      data: {
        jobid: _this.data.job.JobId
      },
    }).then(function () {
      const name = _this.data.staff && _this.data.staff.EnName ? _this.data.staff.EnName : '';
      _this._navigateTo('/pages/notice_3/notice?name=' + name + '&id=' + _this.data.job.JobId);
    })
  },
  closeIncompleteResume: function () {
    this.setData({
      isShowIncompleteResume: false
    })
  },
  improveResume: function () {
    wx.navigateTo({
      url: '/pages/resume/resume'
    })
  },
  showApplyJobPanel: function (e) {
    if (!this.data._isLogin) {
      this._navigateTo('/pages/login/login');
      return;
    }
    if (this.data.stepStatus == -1) {
      return;
    }

    if (this.data.isResumeComplete) {
      this.ajaxGetResumeList();
    } else {
      this.setData({
        isShowIncompleteResume: true
      })
    }

    // 埋点
    this.trackEvent(function (options, track) {
      track(options.botton_td.id, {
        text: options.botton_td.text
      })
    })
  },
  ajaxGetResumeList: function (data) {
    const _this = this;
    wx.$http({
      url: '/v1/Resume/GetResumeList',
    }).then(function (data) {
      _this.setData({
        isShowApplyResumePanel: true,
      });
      let defaultResumeId = 0;
      data.List.forEach(function (elem) {
        if (!elem.IsOnLine) {
          if (elem.Name.endsWith('doc') || elem.Name.endsWith('docx')) {
            elem.img = '/imgs/icon-word-circle.png';
          } else if (elem.Name.endsWith('pdf')) {
            elem.img = '/imgs/icon-pdf-circle.png';
          }
        } else {
          elem.img = elem.PictureUrl;
        }
        if (elem.IsDefault) {
          defaultResumeId = elem.Id;
        }
        const resumeDescArr = [];
        if (elem.YearsExperience !== null || elem.YearsExperience !== "") {
          const yearsExperienceMsg = elem.YearsExperience > 0 ? elem.YearsExperience + '年经验' : '1年以内';
          resumeDescArr.push(yearsExperienceMsg);
        }
        if (elem.Age > 0) {
          resumeDescArr.push(elem.Age + '岁');
        }
        if (elem.EducationLevelName) {
          resumeDescArr.push(elem.EducationLevelName);
        }
        elem.resumeIntro = resumeDescArr.join('，');
      });
      _this.setData({
        curResumeId: defaultResumeId,
      });
      _this.setData({
        resumeList: data.List,
      });
    });
  },
  changeCurResumeId: function (e) {
    const id = e.currentTarget.dataset.id;
    this.setData({
      curResumeId: id,
    });
  },
  ajaxGetSimilarJobList: function (id) {
    const _this = this;
    wx.$http({
      url: '/v1/Job/GetSimilarJobList',
      data: {
        srcJobID: id
      },
    }).then(function (data) {
      _this.setData({
        similarList: data.Data,
        getItOnlyOnce: true
      });
    });
  },
  onShareAppMessage: function () {
    return {
      title: '锐仕精英 热招职位',
      path: '/pages/jobs/details/details?id=' + this.data.job.JobId + "&share=1",
    }
  }
})