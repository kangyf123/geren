const cities = require("../../data/cities.js");
const industries = require("../../data/industries.js");
Page({
  data: {
    navHeight: '',
    showNavBut: true,
    filters: {
      locationCode: undefined,
      businessScopeID: undefined,
      page: 1,
      size: 10,
      order: 1,           // 2:服务最多,6:面试最多,8;offer最多,9:入职最多  
    },
    info: {
      locationCode: {},
      businessScopeID: {},
      order: {},
    },
    conf: {
      order: [
        {
          id: 2,
          name: '服务最多',
        },
        {
          id: 6,
          name: '面试最多',
        },
        {
          id: 8,
          name: 'offer最多',
        },
        {
          id: 9,
          name: '入职最多',
        },
      ],
    },
    menuList: [],
    selectFilter: {
      isShow: false,
      type: '',
      data: {},
      selected: {},
    },
    searchFilter: {
      isShow: false,
      type: '',
      kwd: '',
      list: [],
      originList: [],
      placeholder: '',
    },
    backUrl: '',
  },
  mixins: [require('../../mixins/navigateTo.js'), require('../../mixins/list.js'), require('../../utils/util.js')],
  onLoad: function (options) {
    // 默认初始值 展示全国的猎头
    this.setData({
      'info.order': this.data.conf.order[0],
      'info.locationCode.id':'00',
      'info.businessScopeID.id': '',
    });
    this.getNavHeight();
    if (options.share) {
      this.setData({
        'backUrl': '/pages/home/home',
      });
    }
    
  },
  onShow: function () {
    this.getNavHeight();
  },
  onPullDownRefresh: function () {

  },
  openSearch(){
    this._navigateTo('/pages/headhunter-search/headhunter-search');
  },
  searchList: function () {
    this.ajaxGetHeadhunterList();
  },
  ajaxGetHeadhunterList: function () {
    const _this = this;
    wx.$http({
      url: '/v1/Adviser/List',
      data: this.data.filters,
    }).then(function (data) {
      _this.compileList(data);
    });
  },

  /** 地点筛选 start **/
  initMenuData: function () {
    const arr = [];
    const obj = {};
    cities.forEach(function (elem, index) {
      arr.push({
        id: elem.areaId,
        name: elem.areaName,
      });
      obj[elem.areaId] = elem.areaName;
    });
    this.setData({
      menuList: arr,
      menuObj: obj,
    });
  },
  changeMenu: function (e) {
    let index;
    if (typeof e === 'object') {
      index = e.currentTarget.dataset.index;
    } else {
      index = e;
    }

    const targetCityArr = this.getCityDataByIndex(index);
    this.setData({
      'selectFilter.data.curMenuIndex': index,
      'selectFilter.data.list': targetCityArr,
    });
  },
  getCityDataByIndex: function (index) {
    let tempCityArr;
    if (["01", "09", "02", "22"].indexOf(cities[index].areaId) > -1) {
      tempCityArr = cities[index].cities[0].counties;
    } else {
      tempCityArr = cities[index].cities;
    }

    const targetCityArr = [];
    targetCityArr.push({
      id: cities[index].areaId,
      name: cities[index].areaName,
    });
    tempCityArr.forEach(function (elem, index) {
      targetCityArr.push({
        id: elem.areaId,
        name: elem.areaName,
      });
    });
    return targetCityArr;
  },
  /** 地点筛选 end **/

  selectSelectFilter: function (e) {
    let selected = this.data.selectFilter.data.list[e.currentTarget.dataset.index];
    // 全国栏目 增加热门城市
    selected.id == '00' ? selected = '' : selected;
    this.setData({
      ['info.' + this.data.selectFilter.type]: selected,
      ['filters.' + this.data.selectFilter.type]: selected.id,
      'filters.page': 1,
    }); 
    this.hideSelectFilterPanel();
    this.getList();
  },
  switchSelectFilterPanel: function (e) {
    if (this.data.selectFilter.isShow) {
      if (e.currentTarget.dataset.type === this.data.selectFilter.type) {
        this.hideSelectFilterPanel(e);
      } else {
        this.showSelectFilterPanel(e);
      }
    } else {
      this.showSelectFilterPanel(e); 
    }
  },
  showSelectFilterPanel: function (e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      'selectFilter.isShow': true,
      'selectFilter.type': type,
      'selectFilter.selected': this.data.info[type],
    });
    if (type === 'locationCode') {
      this.setData({
        'selectFilter.data': {
          list: [],
          menu: [],
          curMenuIndex: 0,
        },
      });

      this.initMenuData();
      this.changeMenu(0);
    }
    if (type === 'businessScopeID') {
      let list = [];
      list.push({
        id: "",
        name: "所有行业",
      });
      industries.forEach(function (elem, index) {
        list.push({
          id: elem.value,
          name: elem.text,
        });
      });
      
      this.setData({
        'selectFilter.data': {
          list: list,
        },
      });
    }

    if (type === 'order') {
      this.setData({
        'selectFilter.data': {
          list: this.data.conf.order,
        },
      });
    }
  },
  hideSelectFilterPanel: function (e) {
    this.setData({
      'selectFilter.isShow': false,
      'selectFilter.data': {},
    });
  },
  showSearchFilterPanel: function (e) {
    const type = this.data.selectFilter.type,
      _this = this;
    let list = [],
      placeholder = '';
    if (type === 'locationCode') {
      let allCityList = [],
        len = cities.length;
      for (let i = 0; i < len; i++) {
        if (cities[i].areaId === "00") {
          allCityList.push({
            id: cities[i].areaId,
            name: cities[i].areaName,
          });
          continue;
        }
        allCityList = allCityList.concat(_this.getCityDataByIndex(i));
      }

      list = allCityList;
      placeholder = '搜索地区';
    }
    if (type === 'businessScopeID') {
      list = this.data.selectFilter.data.list;
      placeholder = '搜索行业';
    }

    this.setData({
      'searchFilter.isShow': true,
      'searchFilter.type': type,
      'searchFilter.originList': list,
      'searchFilter.list': list,
      'searchFilter.placeholder': placeholder,
      'searchFilter.kwd': '',
    });

  },
  selectSearchFilter: function (e) {
    const selected = this.data.searchFilter.list[e.currentTarget.dataset.index];
    this.setData({
      ['info.' + this.data.searchFilter.type]: selected,
      ['filters.' + this.data.searchFilter.type]: selected.id,
    });

    this.hideSearchFilterPanel();
    this.hideSelectFilterPanel();
    this.getList();
  },
  hideSearchFilterPanel: function (e) {
    this.setData({
      'searchFilter.isShow': false,
      'selectFilter.list': [],
    });
  },
  searchFilterList: function (e) {
    let value,
      dataList = this.data.searchFilter.list;

    if (typeof e === 'object') {
      value = e.detail.value;
    } else {
      value = e;
    }
    if (value === '') {
      this.setData({
        'searchFilter.kwd': '',
      });
      this.hideSearchFilterPanel();
      return;
    }
    const list = [];
    this.data.searchFilter.originList.forEach(function (elem) {
      if (elem.name.indexOf(value) > -1) {
        list.push(elem);
      }
    });
    this.setData({
      'searchFilter.list': list,
      'searchFilter.kwd': value,
    });
  },
  removeSearchKwd: function (e) {
    this.setData({
      'searchFilter.kwd': '',
    });
    this.hideSearchFilterPanel();
  },
  disabledBubble: function () {},
  onShareAppMessage: function () {
    return {
      title: '找工作 找猎头 保密求职',
      path: '/pages/headhunters/headhunters?share=1',
      imageUrl: '../../imgs/share-img.png',
    }
  }
})