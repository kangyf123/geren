// 主要用于简历的基本信息编辑，把通用逻辑抽象了出来
const util = require('../utils/util.js');
module.exports = {
  data: {
    query: {},
    isComplete: false,
    exclude: [],
    completeRules: {},   // 如果需要自定义校验规则，则把校验规则写在这里
    info: {},
    conf: {},
    isEdited: false,
    isLoading: false,
  },
  onLoad: function () {
    const stoData = wx.getStorageSync('input12');
    this.beforeOnLoad && this.beforeOnLoad(stoData);
    const query = this.data.query,
      info = this.data.info;
    if (stoData && stoData.isIgnoreSelected === true) {
      this._changeIsComplete();
      return;
    }
    if (stoData) {
      Object.keys(query).forEach(function (key) {
        query[key] = stoData[key];
      });
      
      Object.keys(info).forEach(function (key) {
        info[key] = stoData[key];
      });
      
      this.setData({
        query: query,
        info: info
      });
     
    }
    const conf = this.data.conf,
      _this = this;

    Object.keys(conf).forEach(function (key) {
      conf[key].forEach(function (elem, index) {
        if (elem.id == query[key]) {
          elem.index = index;
          _this.setData({
            ['info.' + key]: elem,
          });
        }
      });
    });
    this._changeIsComplete();
  },
  onShow: function () {
    const PageData = {
      industry: wx.getStorageSync("industry"),
      job: wx.getStorageSync("job"),
      input: wx.getStorageSync("input")
    }
    Object.keys(PageData).forEach(key => {
      let stoData = PageData[key];
      
      if (!stoData) return;
      if (stoData.url === '') {
        if (typeof stoData.data === 'object') {
          console.log(stoData.field);
          this.setData({
            ['query.' + stoData.field]: Object.keys(stoData.data)[0],
            ['info.' + stoData.field]: Object.values(stoData.data)[0]
          });
        } else {
          this.setData({
            ['query.' + stoData.field]: stoData.data
          });
        }
        this.setData({
          isEdited: true,
        });

      }
      this._changeIsComplete();
      wx.removeStorageSync(key);
    })
  },
  _changeIsComplete: function () {
    const query = this.data.query,
      _this = this;
    let isComplete = true;

    Object.keys(query).forEach(function (key) {
      if (_this.data.exclude.indexOf(key) > -1) {
        return true;
      }
      if (_this.data.completeRules[key]) {
        if (!_this[_this.data.completeRules[key]]()) {
          isComplete = false;
        }
        return true;
      }
      if (query[key] === undefined || query[key] === null || query[key] === "") {
        isComplete = false;
        return false;
      }

      if (typeof query[key] === 'object') {
        Object.keys(query[key]).forEach(function (oKey) {
          if (query[key][oKey] === undefined || query[key][oKey] === null || query[key][oKey] === "") {
            isComplete = false;
            return false;
          }
        });
      }
    });
    this.setData({
      isComplete: isComplete,
    });
  },
  _save: function (e) {
    if (!this.data.isComplete || this.data.isLoading) {
      return;
    }
    this.setData({
      isLoading: true,
    });
    const _this = this,
      url = e.currentTarget.dataset.url;
    wx.$http({
      url: url,
      method: 'post',
      data: this.data.query,
    }).then(function (data) {
      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 2000,
        success: function () {
          // 保存时 清除保存的薪资
          wx.removeStorageSync('input12');

          wx.navigateBack({
            complete: function () {
              _this.setData({
                isLoading: false,
              });
            },
          });
        },
      })
    });
  },
  _dateChange: function (e) {
    
    const value = e.detail.value;
    let type;
    if (e.detail.type === 'startDate') {
      if (e.currentTarget.dataset.start) {
        type = e.currentTarget.dataset.start;
      } else {
        type = e.currentTarget.dataset[e.detail.type];
      }
    }
    if (e.detail.type === 'endDate') {
      if (e.currentTarget.dataset.end) {
        type = e.currentTarget.dataset.end;
      } else {
        type = e.currentTarget.dataset[e.detail.type];
      }
    }
    
    this.setData({
      ['query.' + type]: value,
      isEdited: true,
    });
    if (e.detail.isEndCurrent !== undefined) {
      this.setData({
        'query.IsCurrent': e.detail.isEndCurrent,
      });
    } else {
      
    }
    this._changeIsComplete();
  },
  _bindSelectChange: function (e) {
    const type = e.currentTarget.dataset.type,
      val = e.detail.value,
      conf = e.currentTarget.dataset.conf;
    let selected = this.data.conf;
    if (conf) {
      selected = selected[conf][val];
    } else {
      selected = selected[type][val];
    }
    selected.index = val;
    this.setData({
      ['query.' + type]: selected.id,
      ['info.' + type]: selected,
      isEdited: true,
    });
    this._changeIsComplete();
  },
  checkDateTo: function () {
    if (this.data.query.DateTo || this.data.query.IsCurrent) {
      return true;
    }
    return false;
  },
}