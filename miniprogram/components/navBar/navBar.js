const App = getApp();
const routeObj = require('../../data/routeObj.js');
const tabs = require('../../data/tabs.js');
Component({
  options: {
    addGlobalClass: true,
  },
  externalClasses: ['custom-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    navBackQuery: {
      type: Object,
      value: {}
    },
    navBack: { // 使用navgaiter 返回，并带参数到onshow
      type: Boolean,
      value: false,
    },
    pageName: String,
    showNavBut: {
      type: Boolean,
      value: false
    },
    showNewNavBut: {
      type: Boolean,
      value: false
    },
    showNavButHome: {
      type: Boolean,
      value: false
    },
    bgColor: {
      type: String,
      value: '#fff'
    },
    textColor:{
      type: String,
      value: '#000'
    },
    iconColor: {
      type: String,
      value: '#000'
    },
    isEdited: {
      type: Boolean,
      value: false,
    },
    backUrl: {
      type: String,
      value: "",
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    isAlertloading: true,
    isLocked: false,
  },
  lifetimes: {
    attached: function() {
    
      this.setData({
        navHeight: App.globalData.navHeight,
        navTop: App.globalData.navTop
      });
      wx.setStorageSync('navHeight', App.globalData.navHeight);
      wx.setStorageSync('navTop', App.globalData.navTop);
    }
  },
  pageLifetimes: {
    show: function(opction) {
      
      // 页面被展示
      // let pages = getCurrentPages();
      // let currentRoute = pages[pages.length - 1].route;
    },
    hide: function() {
      // 页面被隐藏
    },
    resize: function(size) {
      // 页面尺寸变化
    }
  },
  /**
   * 组件的方法列表
   */
  created() {},
  methods: {
    // 回退
    _navBack: function () {
      let pages = getCurrentPages();
      if (pages.length == 1) {
        wx.reLaunch({
          url: '/pages/home/home',
        });
        return
      }
      if (this.data.isLocked) {
        return;
      }
      let _this = this;

      let currentRoute = pages[pages.length - 1].route;
      let navigateBackNum;

      // 扩展优化nav返回带参 Create by Allen.sun on 2020/05/18
      if (this.properties.navBack) {
        let prevPage = pages[pages.length - 2];
        prevPage.setData({
          backData: this.properties.navBackQuery
        })
        wx.navigateBack({
          delta: 1
        })
        return
      }
      for (let route of routeObj) {
        if (route == currentRoute) {
          navigateBackNum = 2;
          break;
        } else {
          navigateBackNum = 1;
        }
      }
      if (this.data.isEdited) {
        wx.showModal({
          title: '提示',
          content: '是否放弃本次编辑？',
          showCancel: true,
          cancelText: "否",
          cancelColor: '#000000',
          confirmText: "是",
          confirmColor: '#3B87FF',
          success: function (res) {
            if (res.confirm) {
              if (!_this._navigateToBackUrl()) {
                wx.navigateBack({
                  delta: navigateBackNum,
                  complete: function () {
                    _this.setData({
                      isLocked: false,
                    });
                  },
                });
              }
            };
          },
        })
      } else {
        if (!_this._navigateToBackUrl()) {
          wx.navigateBack({
            delta: navigateBackNum,
            complete: function () {
              _this.setData({
                isLocked: false,
              });
            },
          });
        }

      }
    },

    // 回主页
    _toHome: function() {
      if (this.data.isLocked) {
        return;
      }
      const _this = this;
      wx.navigateTo({
        url: '/pages/home/home',
        complete: function () {
          _this.setData({
            isLocked: false,
          });
        },
      })
    },
    _navigateToBackUrl: function () {
      const _this = this;
      if (this.data.backUrl) {
        if (tabs.indexOf(this.data.backUrl) > -1) {
          wx.switchTab({
            url: this.data.backUrl,
            complete: function () {
              _this.setData({
                isLocked: false,
              });
            },
          });
        } else {
          wx.navigateTo({
            url: this.data.backUrl,
            complete: function () {
              _this.setData({
                isLocked: false,
              });
            },
          })
        }
        return true;
      }
      return false;
    },
    _navigateTo: function (e) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    }
  }
})
