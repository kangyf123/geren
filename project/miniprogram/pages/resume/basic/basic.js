const util = require('../../../utils/util.js');
const dataGender = require("../../../data/gender.js");
const dataEdu = require('../../../data/edu.js');
const dataWorkStatus = require('../../../data/workStatus.js');
const dataCities = require('../../../data/cities.js');
Page({
  data: {
    isAlert:false,
    oldQuery:{},
    navHeight: '',
    showNavBut: true,
    regionObj: {},
    query: {
      Name: "",
      LiveLocationId: "",
      GenderId: "",
      EducationLevelId: "",
      Birthdate: "",
      YearsExperience: "",
      WorkStatusId: "",
      Email: "",
      PictureUrl: "",
      AnnualSalary: "",
    },
    conf: {
      GenderId: dataGender,
      EducationLevelId: dataEdu,
      WorkStatusId: dataWorkStatus,
      YearsExperience: [],
      LiveLocationId: [[], []],
    },
    info: {
      LiveLocationIdText: '',
      LiveLocationId: [0, 0],
    },
    name: '',
    now: '',
    AnnualSalary: '',
    workRangeConf: [],
  },
  mixins: [require('../../../mixins/navigateTo.js'), require('../../../mixins/resume.js'), require('../../../utils/util.js')],
  reload: function() {
  },
  beforeOnLoad: function(data) {
    if (typeof data === 'object') {
      data.isIgnoreSelected = !(data.Name && data.Email) ? true : false;
    }
    
    const date = util.getDateObj();
    const arr = [];
    arr.push(date.getFullYear());
    arr.push(date.getMonth() + 1);
    arr.push(date.getDate());
    this.setData({
      now: arr.join('-'),
    });
    const workArr = [];
    for (let i = 0; i <= 50; i++) {
      if (i === 0) {
        workArr.push({
          id: 0,
          name: '1年以内',
        });
      } else {
        workArr.push({
          id: i,
          name: i + '年',
        });
      }
    }
    this.setData({
      'conf.YearsExperience': workArr,
    });
    
    
  },
  onLoad: function() {
    this.getNavHeight();
    if (this.data.query.AnnualSalary !== "") {
      this.setData({
        'query.AnnualSalary': String(this.data.query.AnnualSalary / 10000),
      });
    }
    this.setData({
      'query.PictureUrl': util.fixPitureStr(this.data.query.PictureUrl),
    })

    dataCities[0].areaName = '热门';

    this.setData({
      'conf.LiveLocationId[0]': dataCities,
    });
    this.initLiveLocationId();
    this.resetLiveLocationIdSelectorCity(dataCities[this.data.info.LiveLocationId[0]]);
    if (this.data.query.LiveLocationId) {
      this.setData({
        'info.LiveLocationIdText': this.data.conf.LiveLocationId[1][this.data.info.LiveLocationId[1]].areaName,
      });
    }
    
  },
  onShow: function() {
    this.getNavHeight();

    if (wx.getStorageSync('input')) {
      const obj = wx.getStorageSync('input');
      // 每次保存时候覆盖当前现居地数据
      if (obj.field =="LiveLocationId"){
        this.setData({
          'query.LiveLocationId': obj.data[Object.keys(obj.data)].id,
          'info.LiveLocationText': obj.data[Object.keys(obj.data)].name,
        })
      }
    }

    if (wx.getStorageSync('input')) {
      const data = JSON.parse(wx.getStorageSync('input'));
      const field = data.field;
      const keywords = data.keywords;
      this.setData({
        name: keywords
      });
    }
  },
  initLiveLocationId: function () {
    let _this = this,
      selectedSelectorIndex = [0, 0],
      liveLocationId = this.data.query.LiveLocationId,
      liveLocationProvinceId = liveLocationId.substr(0, 2),
      hasFinded = false;
    dataCities.every(function (province, index) {
      if (province.areaId == liveLocationId) {
        selectedSelectorIndex[0] = index;
        return false;
      }
      if (province.areaId != liveLocationProvinceId) {
        return true;
      }
      const cities = _this.getLiveLocationIdSelectorCity(province);
      cities.every(function (city, cityIndex) {
        if (city.areaId == liveLocationId) {
          selectedSelectorIndex[0] = index;
          selectedSelectorIndex[1] = cityIndex;
          hasFinded = true;
          return false;
        }
        return true;
      });
      return true;
    });

    this.setData({
      'info.LiveLocationId': selectedSelectorIndex,
    });
  },
  resetLiveLocationIdSelectorCity: function (province) {
    const cities = this.getLiveLocationIdSelectorCity(province);
    this.setData({
      'conf.LiveLocationId[1]': cities,
    });
  },
  getLiveLocationIdSelectorCity: function (province) {
    let cities = [];
    if (province.areaId != '00') {
      cities.push({
        areaId: province.areaId,
        areaName: province.areaName,
      });
    }
    if (["01", "09", "02", "22"].indexOf(province.areaId) > -1) {
      cities = cities.concat(province.cities[0].counties);
    } else {
      cities = cities.concat(province.cities);
    }
    return cities;
  },
  changeLiveLocationIdSelectorColumn: function (e) {
    if (e.detail.column == 0 && e.detail.value != this.data.info.LiveLocationId[0]) {
      this.resetLiveLocationIdSelectorCity(this.data.conf.LiveLocationId[0][e.detail.value]);
      this.setData({
        'info.LiveLocationId': [e.detail.value, 0],
      });
    } else {
      this.setData({
        'info.LiveLocationId': [this.data.info.LiveLocationId[0], e.detail.value],
      });
    }
  },
  changeLiveLocationIdSelector: function (e) {
    const selectedCity = this.data.conf.LiveLocationId[1][e.detail.value[1]];
    this.setData({
      'info.LiveLocationId': e.detail.value,
      'info.LiveLocationIdText': selectedCity.areaName,
      'query.LiveLocationId': selectedCity.areaId,
    });
  },
  bindSelectChange: function(e) {},
  bindDateChange: function(e) {
    this.setData({
      'query.Birthdate': e.detail.value,
    });
  },
  //上传服务器
  uploadImg: function(imgurl, index) {
    const _this = this;
    util.uploadImgs('/v1/Resume/UploadImg', function(e) {
      _this.setData({
        'query.PictureUrl': e.Data.ViewUrl,
        isEdited: true,
      });
    });
  },
  setSelectedDataToStorage: function(e) {
    const arr = [];
    if (this.data.query.LiveLocationId) {
      arr.push(this.data.query.LiveLocationId);
    }
    wx.setStorageSync("input", arr);
  },
})