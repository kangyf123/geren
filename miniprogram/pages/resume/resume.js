const utils = require("../../utils/util.js");
Page({
  data: {
    navHeight: '',
    showNavBut: true,
    completionRatio: 0,
    info: {},
    workList: [],
    eduList: [],
    projectList: [],
    languageList: [],
  },
  mixins: [require('../../mixins/navigateTo.js'), require('../../utils/util.js')],
  onLoad: function () {
    this.getNavHeight();
  },
  ajaxGetResumeBasicInfo: function () {
    const _this = this;
    wx.$http({
      url: '/v1/Resume/GetResumeBasicInfo',
    }).then(function (data) {
      data.Member.StatementsArr = utils.splitStrToArrayByNewLineToken(data.Statements);
      data.Member.Statements = data.Statements;
      const workList = data.ResumeExperience;
      workList.forEach(function (item) {
        item.DateFrom = _this.formatDate(item.DateFrom, '.', 'month');
        item.DateTo = _this.formatDate(item.DateTo, '.', 'month');
      });
      const projectList = data.ResumeProjectExpress;
      projectList.forEach(function (item) {
        item.DateFrom = _this.formatDate(item.DateFrom, '.', 'month');
        item.DateTo = _this.formatDate(item.DateTo, '.', 'month');
      });
      const eduList = data.ResumeEducation;
      eduList.forEach(function (item) {
        item.DateFrom = _this.formatDate(item.DateFrom, '.', 'month');
        item.DateTo = _this.formatDate(item.DateTo, '.', 'month');
      });
      if (data.Member.LiveLocationId == '00') {
        data.Member.LiveLocationId = "";
      }
      data.Member.Birthdate = _this.formatDate(data.Member.Birthdate, '-', 'date');
      data.Member.PictureUrl = utils.fixPitureStr(data.Member.PictureUrl);
      data.Member.IsSaved = data.Member.Name && data.Member.Email ? true : false;
      const resumeDescArr = [];
      if (data.Member.YearsExperience !== null || data.Member.YearsExperience !== "") {
        const yearsExperienceMsg = data.Member.YearsExperience > 0 ? data.Member.YearsExperience + '年经验' : '1年以内';
        resumeDescArr.push(yearsExperienceMsg);
      }
      if (data.Member.Age > 0) {
        resumeDescArr.push(data.Member.Age + '岁');
      }
      if (data.Member.EducationLevelTxt) {
        resumeDescArr.push(data.Member.EducationLevelTxt);
      }
      data.Member.resumeIntro = resumeDescArr.join('，');
      _this.setData({
        info: data.Member,
        workList: workList,
        projectList: projectList,
        eduList: eduList,
        languageList: data.ResumeLang,
        completionRatio: data.ResumePercent,
      });
    });
  },
  navigateToInputPage: function () {
    wx.setStorageSync("input", this.data.info.Statements);
    this._navigateTo('/pages/resume/intro/intro');
  },
  onShow: function () {
    this.getNavHeight();
    // if (wx.getStorageSync('input')) {
    //   const stoData = wx.getStorageSync('input');
    //   if (stoData.url === '') {
    //     const data = stoData.data;
    //     if (stoData.field === 'info.Statements') {
    //       this.setData({
    //         'info.Statements': data,
    //         'info.StatementsArr': utils.splitStrToArrayByNewLineToken(data),
    //       });
    //     }
    //   }
    // } else {
    //   this.ajaxGetResumeBasicInfo();
    // }
    this.ajaxGetResumeBasicInfo();
    wx.removeStorageSync('input');
  },
  formatDate: function (str, sep, type) {
    if (!str || str === "0001-01-01 00:00:00" || str === "0001-01-01") {
      return "";
    }
    const date = utils.getDateObj(str);
    if (type === 'month') {
      return date.getFullYear() + sep + (date.getMonth() + 1);
    }
    if (type === 'date') {
      return date.getFullYear() + sep + (date.getMonth() + 1) + sep + date.getDate();
    }
  },
  setStorageAndnavigateTo: function (e) {
    const url = e.currentTarget.dataset.url,
      type = e.currentTarget.dataset.type,
      index = e.currentTarget.dataset.index;
    let info;
    if (this.data[type] instanceof Array) {
      if (index === -1) {
        info = {};
      } else {
        info = this.data[type][index];
      }
      
    } else {
      info = this.data[type];
    }

    wx.setStorageSync("input12", info);
    this._navigateTo(url);
  },
  // 删除简历中的某个条目
  ajaxRemoveResumeItem: function (e) {
    const id = e.currentTarget.dataset.id,
      title = e.currentTarget.dataset.title,
      name = e.currentTarget.dataset.name,
      _this = this;
    wx.showModal({
      title: '提示',
      content: '确定删除此条' + title,
      confirmText: '删除',
      confirmColor: '#3B87FF',
      success(res) {
        if (res.confirm) {
          let data = {
            [name]: id,
          };

          wx.$http({
            url: e.currentTarget.dataset.url,
            data: data,
          }).then(function (data) {
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000,
              success: function () {
                _this.ajaxGetResumeBasicInfo();
              },
            })
          });
        }
      }
    })
    
  },
})