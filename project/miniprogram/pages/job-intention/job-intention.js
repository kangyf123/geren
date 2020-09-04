const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navHeight: '',
    showNavBut: true,
    salarySelector: {
      range: [],
      selected: [9, 0, 9],
    },
    industry: {
      idList: [],
      nameStr: '',
    },
    location: {
      idList: [],
      nameStr: '',
    },
    job: {
      idList: [],
      nameStr: '',
    },
    salaryIndex: null,
    salaryFrom: null,
    salaryTo: null,
    isComplete: 0,
    isEdited: false,
    backUrl: '',
    prevUrl: '',
    salaryDic: [
      {
        id: 0,
        min: 0,
        max: 0,
        name: '面议'
      },
      {
        id: 1,
        min: 0,
        max: 100000,
        name: '10万以下'
      },
      {
        id: 2,
        min: 100000,
        max: 150000,
        name: '10-15万'
      },
      {
        id: 3,
        min: 150000,
        max: 200000,
        name: '15-20万'
      },
      {
        id: 4,
        min: 200000,
        max: 300000,
        name: '20-30万'
      },
      {
        id: 5,
        min: 300000,
        max: 500000,
        name: '30-50万'
      },
      {
        id: 6,
        min: 500000,
        max: 1000000,
        name: '50-100万'
      },
      {
        id: 7,
        min: 1000000,
        max: 1500000,
        name: '100-150万'
      },
      {
        id: 8,
        min: 1500000,
        max: 2000000,
        name: '150-200万'
      },
      {
        id: 9,
        min: 2000000, 
        max: 0,
        name: '200万以上'
      },
    ],
    industry: {},
    job: {}
  },
  mixins: [require('../../mixins/navigateTo.js'), require('../../utils/util.js')],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initSalarySelector();
    this.ajaxGetMemberDesiredInfo();
    this.getNavHeight();
    let pages = getCurrentPages();
    let prevpage = pages[pages.length - 2];
    if (prevpage.route !== 'pages/my/my') {
      this.setData({
        backUrl: '/pages/home/home',
      });
    }
    this.setData({
      prevUrl: '/' + prevpage.route,
    });
  },
  onShow: function () {
    const industry = wx.getStorageSync('industry');
    const job = wx.getStorageSync('job');

    const location = wx.getStorageSync('localfiled');
    const pageData = { industry, job, location };
    console.log(pageData);
    this.getNavHeight();

    Object.keys(pageData).forEach(key => {
      let stoData = pageData[key];
      if (stoData) {
        if (stoData.url === '') {
          const data = {
            idList: [],
            nameList: [],
            nameStr: '',
          };

          Object.values(stoData.data).forEach(function (elem) {
            data.idList.push(elem.id);
            data.nameList.push(elem.name);
          });
          data.nameStr = data.nameList.join('、');
          this.setData({
            [key]: data,
            isEdited: true,
          });
        }
      }
      this.setIsComplete();
      wx.removeStorageSync(key);
    })
  },
  initSalarySelector: function () {
    const arr = [];
    for (let i = 1; i <= 1000; i++) {
      arr.push(i + '万');
    }
    const rangeData = [];
    rangeData.push(arr);
    rangeData.push(['至']);
    rangeData.push(arr);
    this.setData({
      'salarySelector.range': rangeData,
    });
  },
  salarySelectorChange: function (e) {
    const index = e.detail.value;
    this.setData({
      salaryIndex: index,
      isEdited: true,
    });
    this.setIsComplete();
  },
  // 取消时复位选择
  salarySelectorCancel: function (e) {
    this.setData({
      'salarySelector.selected': this.data.salarySelector.selected,
    });
  },
  ajaxGetMemberDesiredInfo: function () {
    const _this = this;
    wx.$http({
      url: '/v1/Member/GetMemberDesiredInfo',
    }).then(function (data) {
      const industry = {
        idList: [],
        nameList: [],
        nameStr: '',
      };
      
      data.DesiredIndustries && data.DesiredIndustries.forEach(function (elem) {
        industry.idList.push(elem.IndustryId);
        industry.nameList.push(elem.IndustryName);
      });
      industry.nameStr = industry.nameList.join('、');

      const location = {
        idList: [],
        nameList: [],
        nameStr: '',
      };
      data.DesiredLocations && data.DesiredLocations.forEach(function (elem) {
        location.idList.push(elem.LocationId);
        location.nameList.push(elem.LocationName);
      });
      location.nameStr = location.nameList.join('、');

      const job = {
        idList: [],
        nameList: [],
      };
      data.DesiredOccupations && data.DesiredOccupations.forEach(function (elem) {
        job.idList.push(elem.OccupationId);
        job.nameList.push(elem.OccupationName);
      });
      job.nameStr = job.nameList.join('、');

      let index = undefined;

      // 如果都是0分为两种情况，用户首次进入，没填写年薪的情况和用户选择了面议的情况
      if (data.DesiredSalaryFrom === 0 && data.DesiredSalaryTo === 0) {
        if (data.DesiredOccupations.length === 0 && data.DesiredLocations.length === 0 
          && data.DesiredIndustries.length === 0) {
          index = null;
        } else {
          index = 0;
        }
      }
      if (index === undefined && data.DesiredSalaryFrom >= _this.data.salaryDic[_this.data.salaryDic.length - 1].min && (data.DesiredSalaryTo === 0 || data.DesiredSalaryTo >= _this.data.salaryDic[_this.data.salaryDic.length - 1].min)) {
        index = _this.data.salaryDic.length - 1;
      }

      if (index === undefined) {
        _this.data.salaryDic.some(function (elem, dIndex) {
          
          if (data.DesiredSalaryTo <= elem.max) {
            index = dIndex;
            return true;
          } else if (elem.max === 0 && dIndex > 0 && data.DesiredSalaryTo > _this.data.salaryDic[_this.data.salaryDic.length - 1].max) {
            index = _this.data.salaryDic.length - 1;
            return true;
          }
        });
      }

      _this.setData({
        industry: industry,
        location: location,
        job: job,
        salaryIndex: index,
      });
      _this.setIsComplete();
    });
  },
  setSelectedDataToStorage: function (e) {
    let type = e.currentTarget.dataset.type, idList = this.data[type].idList;
    if (!(idList instanceof Array)) {
      idList = [];
    }
    wx.setStorageSync(type, idList);
  },
  setIsComplete: function () {
    let isComplete = true;
    const arr = ['industry', 'job', 'location'],
      _this = this;
    arr.forEach(function (item) {
      if (_this.data[item].idList && _this.data[item].idList.length === 0) {
        isComplete = false;
      }
    });
    if (isComplete && (this.data.salaryIndex === null)) {
      isComplete = false;
    }
    this.setData({
      isComplete: isComplete,
    });
  },
  ajaxEditMemberDesiredInfo: function () {
    if (this.data.isComplete) {
      const _this = this;
      const formatedIndustry = [];
      this.data.industry.idList.forEach(function (elem, index) {
        formatedIndustry.push({
          IndustryName: _this.data.industry.nameList[index],
          IndustryId: elem,
        });
      });

      const formatedLocation = [];
      this.data.location.idList.forEach(function (elem, index) {
        formatedLocation.push({
          LocationName: _this.data.location.nameList[index],
          LocationId: elem,
        });
      });

      const formatedjob = [];
      this.data.job.idList.forEach(function (elem, index) {
        formatedjob.push({
          OccupationName: _this.data.job.nameList[index],
          OccupationId: elem,
        });
      });


      wx.$http({
        url: '/v1/Member/EditMemberDesiredInfo',
        method: 'post',
        data: {
          DesiredIndustries: formatedIndustry,
          DesiredLocations: formatedLocation,
          DesiredOccupations: formatedjob,
          DesiredSalaryFrom: this.data.salaryDic[this.data.salaryIndex].min,
          DesiredSalaryTo: this.data.salaryDic[this.data.salaryIndex].max,
        }
      }).then(function (data) {
      //  util.setNameStringToStorage(formatedjob, "jobIntentionName");
        util.setNameStringToStorage(formatedIndustry, "industryIntentionName");
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000,
          success: function () {
            let defaultNavigate = _this.data.backUrl ? '/pages/home/home' : _this.data.prevUrl;
            let loginedNavigate = wx.getStorageSync('logined-navigate');
            wx.setStorage({
              key: 'needRefersh',
              data: true,
            })
            if (!loginedNavigate) {
              wx.switchTab({
                url: defaultNavigate
              });
              return;
            }
            
            if (loginedNavigate === '/pages/home/home'
              || loginedNavigate === '/pages/recommends/recommends'
              || loginedNavigate === '/pages/my/my') {
              wx.switchTab({
                url: loginedNavigate
              });
            } else {
              wx.navigateTo({
                url: defaultNavigate,
              });
            }

            wx.removeStorageSync('logined-navigate');
            
          },
        })
      });
    }
  },
})