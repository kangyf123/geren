

Page({
  data: {
    navHeight: '',
    showNavBut: true,
    searchInprogressTitle: '',
    titleText: '',
    typeList: [],
    searchList: [],
    selectedList: [],
    selectedObj: {},
    jobPopup: {
      isShow: false,
      menuList: [],
      curMenu: {},
      curType: {},
      jobList: [],
    },
    pageType: null
  },
  mixins: [require('../../mixins/dataList.js'), require('../../utils/util.js'), require('../../mixins/screenAdapt.js')],
  onLoad: function(options) {
    const PageData = {
      industry: wx.getStorageSync("industryData"),
      job: wx.getStorageSync("occupationData")
    }
    let type = options.type, data = PageData[type];
    this.data.pageData = data;
    this.data.pageType = type;
    if (options.titleText) {
      this.setData({
        searchInprogressTitle: options.titleText,
        titleText: options.titleText
      })
    } else {
      this.setData({
        searchInprogressTitle: "期望职位",
      })
    }
    this.getNavHeight();
    const selectedIds = wx.getStorageSync(type),
      selectedList = [],
      selectedObj = {};
    selectedIds.length > 0 && this.jobIterator(function(data) {
      let hasSelectedData = false;
      selectedIds.forEach(function (selectedId) {
        if (selectedId == data.jobObj.Id) {
          hasSelectedData = true;
        }
      });
      if (hasSelectedData) {
        data.jobObj.menuId = data.menuObj.Id;
        data.jobObj.typeId = data.typeObj.Id;
        selectedList.push(data.jobObj);
        selectedObj[data.jobObj.Id] = data.jobObj;
      }
    });

    this.setData({
      '_dataList._field': options.field ? options.field : 'job',
      '_dataList._maxSelectedCount': options.max ? options.max : 3,
      typeList: data,
      selectedList: selectedList,
      selectedObj: selectedObj,
    });
    this.resetTypeAndListSelected();
  },
  onShow: function() {
    this.getNavHeight();
  },
  searchState(state, value) {
    if (state == 'search') {
      this.setData({
        searchInprogressTitle: "搜索职位"
      })
      if (value == '') {
        if (this.data.titleText) {
          this.setData({
            searchInprogressTitle: this.data.titleText
          })
        } else {
          this.setData({
            searchInprogressTitle: "期望职位"
          })
        }
      }
    } else if (state == 'remove') {
      if (this.data.titleText) {
        this.setData({
          searchInprogressTitle: this.data.titleText
        })
      } else {
        this.setData({
          searchInprogressTitle: "期望职位"
        })
      }
    }
  },
  showJobPopup: function(e) {
    const curType = this.data.pageData[e.currentTarget.dataset.index],
      menuList = curType.Childens,
      _this = this;
    this.setData({
      'jobPopup.isShow': true,
      'jobPopup.menuList': menuList,
      'jobPopup.curType': curType,
    });

    this.showJobsByMenu(0);
    this.resetTypeAndListSelected();
  },
  hideJobPopup: function() {
    this.setData({
      'jobPopup.isShow': false,
      'jobPopup.menuList': [],
      'jobPopup.jobList': [],
    });
  },
  disabledBubble: function() {},
  removeJob: function(e) {
    let obj = this.data.selectedObj,
      id = typeof e == 'object' ? e.currentTarget.dataset.id : e,
      list = this.data.selectedList;
    if (obj[id]) {
      delete obj[id];
      let arrIndex = -1;
      list.every(function(elem, index) {
        if (elem.Id == id) {
          arrIndex = index;
          return false;
        }
        return true;
      });

      if (arrIndex > -1) {
        list.splice(arrIndex, 1);
      }
      this.setData({
        selectedObj: obj,
        selectedList: list,
        '_dataList._isEdited': true,
      });
    }
    this.resetTypeAndListSelected();
  },
  selectJobInPopup: function(e) {
    let index = e.currentTarget.dataset.index,
      obj = this.data.selectedObj,
      curJob = this.data.jobPopup.jobList[index],
      list = this.data.selectedList;

    if (obj[curJob.Id]) {
      this.removeJob(curJob.Id);
      return;
    }

    if (this.data.selectedList.length >= this.data._dataList._maxSelectedCount &&
      this.data._dataList._maxSelectedCount > 1) {
      wx.showToast({
        title: '最多应选择' + this.data._dataList._maxSelectedCount + '条数据',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    if (this.data._dataList._maxSelectedCount == 1) {
      if (list.length > 0) {
        list = [];
        obj = {};
      }
      this.hideJobPopup();
    }
    curJob.menuId = this.data.jobPopup.curMenu.Id;
    curJob.typeId = this.data.jobPopup.curType.Id;
    list.push(curJob);
    obj[curJob.Id] = curJob;
    
    this.setData({
      selectedList: list,
      selectedObj: obj,
      '_dataList._isEdited': true,
    });
    
    this.resetTypeAndListSelected();

  },
  selectJobInSearchPanel: function(e) {
    let index = e.currentTarget.dataset.index,
      obj = this.data.selectedObj,
      curJob = this.data.searchList[index],
      list = this.data.selectedList;

    if (obj[curJob.Id] || this.data.selectedList.length >= this.data._dataList._maxSelectedCount 
      && this.data._dataList._maxSelectedCount > 1) {
      this.setData({
        '_dataList._kwd': '',
      });
      wx.showToast({
        title: '最多应选择' + this.data._dataList._maxSelectedCount + '条数据',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    if (this.data._dataList._maxSelectedCount == 1 && list.length > 0) {
      list = [];
      obj = {};
    }

    list.push(curJob);
    obj[curJob.Id] = curJob;
    this.setData({
      selectedList: list,
      selectedObj: obj,
      '_dataList._kwd': '',
      '_dataList._isEdited': true,
    });

    this.resetTypeAndListSelected();
  },
  showJobsByMenu: function(e) {
    const index = typeof e === 'object' ? e.currentTarget.dataset.index : e;
    const curMenu = this.data.jobPopup.menuList[index];
    this.setData({
      'jobPopup.curMenu': curMenu,
      'jobPopup.jobList': curMenu.Childens,
    });
  },
  searchByKwd: function(e) {
    this.hideJobPopup();
    const kwd = e.detail.value,
      list = [],
      _this = this;
    this.setData({
      '_dataList._kwd': kwd,
    });

    // 避免因输入字符为空导致把所有的职位都查出来所导致的性能问题
    if (!kwd) {
      return;
    }

    this.jobIterator(function(data) {
      if (data.jobObj.Text.indexOf(kwd) > -1) {
        data.jobObj.menuId = data.menuObj.Id;
        data.jobObj.typeId = data.typeObj.Id;
        data.jobObj.parentsText = data.typeObj.Text + '-' + data.menuObj.Text;
        list.push(data.jobObj);
      }
    });
    this.setData({
      searchList: list,
    });
  },
  jobIterator: function(callback) {
    this.data.pageData.forEach(function(typeObj, typeIndex) {
      typeObj.Childens.forEach(function(menuObj, menuIndex) {
        menuObj.Childens.forEach(function(jobObj, jobIndex) {
          callback && callback({
            jobObj: jobObj,
            jobIndex: jobIndex,
            menuObj: menuObj,
            menuIndex: menuIndex,
            typeObj: typeObj,
            typeIndex: typeIndex
          });
        });
      });
    });
  },
  saveJob: function() {
    if (this.data.selectedList.length < 1) {
      return;
    }
    const formatedSelectedObj = {};
    this.data.selectedList.forEach(function(elem) {
      formatedSelectedObj[elem.Id] = {
        id: elem.Id,
        name: elem.Text,
      };
    });
    this.setData({
      '_dataList._selectedCount': this.data.selectedList.length,
      '_dataList._selected': formatedSelectedObj,
    });
    this._dataSubmit(this.data.pageType);
  },
  resetTypeAndListSelected: function () {
    const selectedList = this.data.selectedList,
      typeList = this.data.typeList,
      menuList = this.data.jobPopup.menuList;
    typeList.forEach(function (typeElem) {
      let hasSelectedInChildren = false;
      selectedList.forEach(function (selectedJobElem) {
        if (selectedJobElem.typeId == typeElem.Id) {
          hasSelectedInChildren = true;
        }
      });

      if (hasSelectedInChildren) {
        typeElem.hasSelectedInChildren = true;
      } else {
        typeElem.hasSelectedInChildren = false;
      }
    });
    menuList.forEach(function (menuElem) {
      let hasSelectedInChildren = false;
      selectedList.forEach(function (selectedJobElem) {
        if (selectedJobElem.menuId == menuElem.Id) {
          hasSelectedInChildren = true;
        }
      });

      if (hasSelectedInChildren) {
        menuElem.hasSelectedInChildren = true;
      } else {
        menuElem.hasSelectedInChildren = false;
      }
    });

    this.setData({
      typeList: typeList,
      'jobPopup.menuList': menuList,
    });
  },
})
