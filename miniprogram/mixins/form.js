const app = getApp();
const util = require('../utils/util.js');
const Base64 = require("../lib/base64/base64.min.js").Base64;
module.exports = {
  data: {
    _isSubmitEnable: false,
  },
  _setToData(e) {
    const field = e.currentTarget.dataset.field;
    const val = e.detail.value;
    this.setData({
      [field]: val,
    });
    if (e.currentTarget.dataset.aftercallback) {
      this[e.currentTarget.dataset.aftercallback]();
    }
    
  },
  _validate (list, argsOptions = {}) {
    let result = {
      success: true,
      name: '',
      errType: '',
    };
    let options = {
      isShowErr: true,
      validatedRequiredOnly: false,
    };
    Object.assign(options, argsOptions);
    const setResult = function (success, name, errType) {
      result.success = success;
      result.name = name;
      result.errType = errType;
    }
    for (let i = 0; i < list.length; i++) {
      if (!result.success) {
        break;
      }
      const conf = list[i];
      const val = this.data[conf.field];
      if (conf.required) {
        if (val == undefined || val === "") {
          setResult(false, conf.name, 'empty');
          continue;
        }
      }
      
      if (!options.validatedRequiredOnly) {
        if (conf.type === 'email') {
          if (!util.isValidEmail(val)) {
            setResult(false, conf.name, 'format');
            continue;
          }
        }

        if (conf.type === 'mobile') {
          if (!util.isValidMobile(val)) {
            setResult(false, conf.name, 'format');
            continue;
          }
        }

        if (!isNaN(conf.minLen)) {
          if (val.length < conf.minLen) {
            setResult(false, conf.name, 'format');
            continue;
          }
        }

        if (!isNaN(conf.minLen)) {
          if (val.length > conf.maxLen) {
            setResult(false, conf.name, 'format');
            continue;
          }
        }
      }
      }
      

    if (options.isShowErr && !result.success) {
      util.showErrorMsg(result.errType, result.name);
    }
    return result.success;
  },
  getValidateConf: function () {
    return {}
  },
  _setSubmitEnableState: function () {
    const conf = this.getValidateConf();
    const arr = [];
    const keys = Object.keys(conf);
    keys.forEach(function (key) {
      arr.push(conf[key]);
    });
    const isValid = this._validate(arr, {
        isShowErr: false,
        validatedRequiredOnly: true,
      });
    this.setData({
      _isSubmitEnable: isValid,
    });
  },
  // 订阅微信消息通知modal位置
  modalcnt: function () {
    var _this = this;
    wx.showModal({
      title: '提示',
      showCancel: false,
      confirmText: "我知道了",
      content: '同意授权微信服务消息通知,避免错过求职进程消息提哦!',
      success: function (res) {
        if (res.confirm) {
          _this.getSubscribeMessage();
        }
      }
    })
  },
  // 获取openid成功
  getopenids: function () {
    var _this = this;
    wx.cloud.callFunction({
      name: "getopenid"
    }).then(res => {
      console.log(res.result, '获取openid成功');
      var openId = res.result.openid;
      _this.updateOpenId(openId);
    }).catch(err => {
      console.log(err, "获取openid失败")
    })
  },
  // 获取模版id成功
  getSubscribeMessage: function () {
    var _this = this;
    wx.requestSubscribeMessage({
      tmplIds: ['aeWpEr26TiSN4yNIUpzAxEUY6JymR8EYSROfKM04Qk4'],
      success(res) {
        //'accept'表示用户接受；'reject'表示用户拒绝；'ban'表示已被后台封禁
        if (res['aeWpEr26TiSN4yNIUpzAxEUY6JymR8EYSROfKM04Qk4'] =='accept'){
          // 用户操作状态 为 接受微信订阅
          _this.getopenids();
        }
      },
      fail(err) {
        console.log(err, '获取模版id失败')
      }
    })
  },
  // 更新openId
  updateOpenId: function (openId) {
    wx.$http({
      url: '/v1/Account/UpdateMemberOpenId',
      method: 'get',
      data: {
        openId: openId
      }
    }).then(function (data) {}).catch(function (err) {})
  },


  _ajaxLogin: function (data, callback) {
    const _this = this;
    if (data.Pwd) {
      data.Pwd = Base64.encode(data.Pwd);
    }
    wx.$http({
      url: '/v1/account/login',
      method: 'post',
      data: data,
    }).then(function (res) {
      console.log(res);
      wx.setStorageSync('hasJobIntention', res.HasHuntIntention);
      wx.setStorageSync('hasRelationPhone', res.HasRelationPhone);
      wx.setStorageSync('token', res.Token);
      util.setNameStringToStorage(res.DesiredOccupations, "jobIntentionName");
      app.globalData.isLogin = true;
      app.globalData.token = res.Token;

      // 由于目前只有微信登录实现了callback，因此有一些只有微信登录的逻辑页实现到了这里，如果以后有其他的也需要实现callback，那么需要再封装一下，现在简单来说，就不封装了    刘海涛    2019/12/5 11:43
      if (callback) {
        callback({
          SessonKey: data.SessonKey,  
        }, function () {
          res.HasRelationPhone = true;
          _this._navigateWhenLogin(res, data.LoginType);
        });
      } else {
        _this._navigateWhenLogin(res, data.LoginType);
      }
      // 这里按原逻辑需要刷新一下 解决从手机号快捷登录 导致得问题 Create by Allen .sun on 2020/03/30
      wx.setStorage({
        key: 'needRefersh',
        data: true,
      })
    });
  },
  _navigateWhenLogin: function (res, currentLoginType) {
    if (!res) {
      res = {
        HasRelationPhone: wx.getStorageSync('hasRelationPhone'),
        HasHuntIntention: wx.getStorageSync('hasJobIntention'),
      }
    }
    if (res.HasRelationPhone) {
      // create by zhaogang 2020-06-22
      // Note: 判断手机号登陆时是否绑定微信，用于微信消息订阅
      if (currentLoginType == 2 && !res.HasOpenId) {
        // 手机登录 未绑定微信 需要绑定微信
        wx.navigateTo({
          url: '/pages/login/login?noOpenid=true',
        });
        return;
      }

      if (res.HasHuntIntention) {
        let loginedNavigate = wx.getStorageSync("logined-navigate");
        if (loginedNavigate) {
          if (!loginedNavigate.startsWith("/")) {
            loginedNavigate = '/' + loginedNavigate;
          }
           
          if (loginedNavigate === '/pages/home/home' 
            || loginedNavigate === '/pages/recommends/recommends' 
            || loginedNavigate === '/pages/my/my') {
            wx.switchTab({
              url: loginedNavigate
            });
            } else {
              wx.navigateTo({
                url: loginedNavigate,
              });    
            }
          
          wx.removeStorageSync('logined-navigate');
        } else {
          wx.switchTab({
            url: '/pages/home/home'
          });
         
        }
          
        // create by zhaogang 2020-06-22
        // Note: 用于微信消息订阅方法
        this.modalcnt();

      } else {
        wx.navigateTo({
          url: '/pages/job-intention/job-intention',
        })
      }
    } else {
      wx.navigateTo({
        url: '/pages/login/bind-mobile/bind-mobile',
      })
    }
  },
  _ajaxSendVerifyCode: function () {
    const _this = this;
    wx.$http({
      url: '/v1/Account/SendVerifyCode',
      method: 'get',
      data: {
        phone: this.data.mobile,
        codeType: 0,
      },
    }).then(function () {
    });
  },
  _clearInput: function (e) {
    const name = e.currentTarget.dataset.field;
    this.setData({
      [name]: '',
    });
    this._setSubmitEnableState();
  },
}