const industries = require("../../data/industries.js");
Page({
  data: {
    navHeight: '',
    showNavBut: true,
    searchInprogressTitle:"",
    titleText:''
  },
  mixins: [require('../../mixins/dataList.js'), require('../../utils/util.js'), require('../../mixins/screenAdapt.js')],
  onLoad: function (options) {
    if(options.titleText){
      this.setData({
        searchInprogressTitle: options.titleText,
        titleText: options.titleText
      })
    }else{
      this.setData({
        searchInprogressTitle: "期望行业"
      })
    }
    this.getNavHeight();
    const selectedIds = wx.getStorageSync('input');
    const list = [];
    let selectedIndexArr = [];
    industries.forEach(function (elem, index) {
      if (selectedIds.indexOf(elem.value) > -1) {
        selectedIndexArr.push(index);
      }
      list.push({
        id: elem.value,
        name: elem.text,
      });
    });
    
    this.setData({
      '_dataList._field': options.field ? options.field : 'industry',
      '_dataList._list': list,
      '_dataList._maxSelectedCount': options.max ? options.max : 3,
    });

    const _this = this;
    selectedIndexArr.forEach(function (elem) {
      _this._addToSelected(elem);
    });
  },
  onShow:function(){
    this.getNavHeight();
  },
  searchState(state, value) {
    if (state == 'search') {
      this.setData({
        searchInprogressTitle: "搜索行业"
      })
      if (value == '') {
        if (this.data.titleText){
          this.setData({
            searchInprogressTitle: this.data.titleText
          })
        }else{
          this.setData({
            searchInprogressTitle: "期望行业"
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
          searchInprogressTitle: "期望行业"
        })
      }
    }

  },
})