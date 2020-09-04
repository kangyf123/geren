//app.js
require('/common/mixins.js');
const Utils = require("./utils/util.js");
const Api = require("./common/js/api.js")
import "umtrack-wx";
const umenConfig = require("./common/js/umenConfig.js")
App({
  umengConfig: umenConfig,
  globalData: {
    userInfo: null,
    isLogin: false,
    token: '',
    host: '',
    isScreenBottomRound: false,
    mapKey:"133f34bc4f72423612bda8fe7d30011c",
    switchTabData: {},
    qqmapKey: "4SMBZ-ZTC33-4HB32-YVAO5-Q5D2H-4SB4Y"
  },
  onLaunch: function () {
    wx.cloud.init({
      env: "yun-uvfqf"
    });

    /* 版本自动更新代码 */
    this.checkUpDate();

    Utils.checkSystemInfo(this);
    wx.authorize({
      scope: 'scope.record',
    });

    this._initLoginStatus();
    this._initHttp();
    let menuButtonObj = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: res => {
        let statusBarHeight = res.statusBarHeight,
            navTop = menuButtonObj.top,  // 胶囊按钮与顶部的距离
            navHeight = statusBarHeight + menuButtonObj.height + (menuButtonObj.top - statusBarHeight) * 2;// 导航高度
        this.globalData.navHeight = navHeight;
        this.globalData.navTop = navTop;
        this.globalData.windowHeight = res.windowHeight;
        if (res.model.indexOf("iPhone X") > -1) {
          this.globalData.isScreenBottomRound = true;
        } else {
          this.globalData.isScreenBottomRound = false;
        }
      },
      fail(err) {
        wx.showToast({
          title: '自定义导航获取信息失败',
        })
      }
    });
    Utils.getAndSaveDataToLocal({ url: Api.Getindustry, method: "get" }, "industryData");
    Utils.getAndSaveDataToLocal({ url: Api.Getoccupation, method: "get" }, "occupationData");
    //this.resetRecommendBadgeNum();
  },
  checkUpDate() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  _initLoginStatus: function () {
    const token = wx.getStorageSync('token');
    // console.log("t", token)
    if (token) {
      this.globalData.isLogin = true;
      this.globalData.token = token;
    } else {
      // 添加此处是为了真机调试 解决带有token的问题
      this.globalData.isLogin = false;
    }
  },
  _initHttp: function () {
    const _this = this;
    const hostConf = {
      //dev:  'http://192.168.30.7:9999',       // 开发环境，接口部署在接口环境中
      local:  'http://192.168.30.7:5022',       // 本地环境，接口部署在开发者本地开发环境中
      prod:  'https://c-api.risfond.com',       // 正式环境
      zai:   "http://192.168.30.10:5022" ,    
      deng: "http://192.168.30.252:5022", 
      yfb:"http://testc-api.risfond.com"        // 预发布环境
    };
    const host = hostConf.local;
    this.globalData.host = hostConf.local;
    wx.$http = function (option, thrown) {
      //进入方法
      this.canTaggerEvent = false;
      wx.showLoading({
        title: '正在加载',
        mask: true
      })
      return new Promise((resolve, reject) => {
        const targetData = {};
        if (option.data) {
          Object.keys(option.data).forEach(function (key) {
            if (option.data[key] !== undefined) {
              targetData[key] = option.data[key];
            }
          });
        }
        wx.request({
          url: host + option.url + (option.type == 'get' ? targetData : ""),
          data: targetData,
          method: option.method,
          header: {
            "content-Type": "application/json; charset=utf-8",
            "Authorization": "Bearer " + _this.globalData.token,
          },
          success: function (res) {
            if (res.statusCode !== 200) {
              if (res.statusCode === 401) {
                if (option.ignoreLogin) {
                  resolve();
                  return;
                }
                wx.navigateTo({
                  url: '/pages/login/login',
                })
                return;
              } else {
                wx.showModal({
                  title: '网络请求失败，请检查网络',
                  content: '',
                  showCancel: false,
                  success: function () {
                    resolve(res.data.Data);
                  },
                })
//                resolve(res.data.Data);

                return;
              }

            }

            if (!res.data.State) {
              let errMsg;
              if (res.data.ErrorCode === -1) {
                errMsg = '服务器错误，请联系系统管理员';
              } else {
                errMsg = res.data.ErrorMsg || "";
              }
              wx.showModal({
                title: errMsg,
                content: '',
                showCancel: false
              })
              reject(res.data.Data);
              return;
            }
            resolve(res.data.Data);
          },
          complete: function () {
            wx.hideLoading();
          },
          fail: function (mis) {

            let errMessage = '网络请求失败，请检查网络！';
            if (mis.errMsg.indexOf('timeout') > 0) {
              errMessage = '网络超时！'
            }
            wx.showModal({
              title: errMessage,
              content: '',
              showCancel: false
            })

            resolve(mis.errMsg)
            return;
          }
        })
      });
    };
  },
  clearRecommendBadgeNum: function () {
    wx.removeTabBarBadge({
      index: 1,
    });
  },
  ajaxGetNewestRecommend: function (callback) {
    wx.$http({
      url: '/v1/Member/GetNewestRecommend',
    }).then(function (data) {
      let num = 0;
      Object.keys(data.Data).forEach(key => {
        if (!data.Data[key]) return;
        num += data.Data[key];
      })
      callback && callback(num,data.Data);
    });
  },
  resetRecommendBadgeNum: function (callback) {
    const _this = this;
    if (this.globalData.isLogin) {
      this.ajaxGetNewestRecommend(function (num,data) {
        // if (num > 0) {
        //   wx.setTabBarBadge({
        //     index: 1,
        //     text: String(num),
        //   })
        // } else {
        //   _this.clearRecommendBadgeNum();
        // }
        callback && callback(data);
      });
    } else {
      _this.clearRecommendBadgeNum();
      callback && callback(num);
    }
  },
  logout: function () {
    this.globalData.isLogin = false;
    this.globalData.token = "";
    wx.clearStorage();
    // this.resetRecommendBadgeNum();
  },
})
