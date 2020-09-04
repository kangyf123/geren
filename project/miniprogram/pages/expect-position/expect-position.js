const cities = require("../../data/cities.js");
Page({
  data: {
    navHeight: '',
    showNavBut: true,
    menuList: [],
    menuObj: [],
    curMenuIndex: 0,
    searchInprogressTitle:'',
    titleText:'',
    selectedArr: [],
  },
  mixins: [require('../../mixins/dataList.js'), require('../../utils/util.js'), require('../../mixins/screenAdapt.js')],
  onLoad: function (options) {
    const _this = this;
    if (options.titleText){
      this.setData({
        searchInprogressTitle: '居住地',
        titleText:'居住地'
      })
    }else{
      this.setData({
        searchInprogressTitle: '期望地点'
      })
    }
    _this.getNavHeight();
    const selectedIds = wx.getStorageSync('location');
    let allCityList = [];
    
    cities.forEach(function (elem, index) {
      if (elem.areaId === "00") {
        return;
      }
      allCityList = allCityList.concat(_this.getCityDataByIndex(index));
    });

    const selected = {},
      selectedArr = [];
    allCityList.forEach(function (elem) {
      if (selectedIds.indexOf(elem.id) > -1) {
        const selectedData = {
          id: elem.id,
          name: elem.name,
        }
        selected[elem.id] = selectedData;
        selectedArr.push(selectedData);
      }
    });

    this.setData({
      '_dataList._field': options.field ? options.field : 'location',
      '_dataList._maxSelectedCount': options.max ? options.max : 3,
      '_dataList._originList': allCityList,
      '_dataList._selected': selected,
      '_dataList._selectedCount': Object.keys(selected).length,
      'selectedArr': selectedArr,
    });
    this.initMenuData();
    this.changeMenu(0);
  },
  onShow(){
    this.getNavHeight();
  },
  searchPosByKwd: function (e) {
    console.log(e.detail.value);
    if (e.detail.value) {
      this._searchList(e);
    } else {
      this._removeKwd();
    }
  },
  searchState(state,value){
    if (state =='search'){
      this.setData({
        searchInprogressTitle: "搜索地区"
      })
      if (value==''){
        if (this.data.titleText =='居住地'){
          this.setData({
            searchInprogressTitle: "居住地"
          })
        }else{
          this.setData({
            searchInprogressTitle: "期望地点"
          })
        }
        this.changeMenu(this.data.curMenuIndex);
      }
    } else if (state == 'remove'){
      if (this.data.titleText == '居住地') {
        this.setData({
          searchInprogressTitle: "居住地"
        })
      } else {
        this.setData({
          searchInprogressTitle: "期望地点"
        })
      }
    }
    
  },
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
      curMenuIndex: index,
      '_dataList._list': targetCityArr,
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
  _afterAddToSelected: function (selected) {
    const arr = this.data.selectedArr;
    let isExists = false;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id == selected.id) {
        isExists = true;
        break;
      }
    }
    if (!isExists) {
      arr.push(selected);
      this.setData({
        selectedArr: arr,
      });
    }
  },
  _afterRemoveSelected: function (removedData) {
    let selectedIndex = -1,
      id = removedData.id,
      selectedArr = this.data.selectedArr;
      selectedArr.forEach(function (item, index) {
      if (id == item.id) {
        selectedIndex = index;
      }
    });

    if (selectedIndex > -1) {
      selectedArr.splice(selectedIndex, 1);
      this.setData({
        selectedArr: selectedArr,
      });
    }
  }
})