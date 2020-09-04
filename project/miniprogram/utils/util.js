const upload = require('./upload.js');
const validate = require('./validate.js');
const amapFile = require('../lib/map/amap-wx.js');
const QQmap = require('../lib/QQMAP/qqmap-wx-jssdk.min.js');

const GLB = getApp();
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}


function showErrorMsg(type, name) {
  let msg = '';
  if (type === 'empty') {
    msg = '请填写' + name;
  } else {
    msg = '请输入正确的' + name;
  }
  wx.showToast({
    title: msg,
    icon: 'none',
    duration: 2000
  })
}

function getMobileWithStar(mobile) {
  return mobile.substr(0, 3) + '****' + mobile.substr(7);
}

function getDatePartObj(date) {
  let targetDate;
  if (typeof date === 'string') {
    if (!date) {
      return "";
    }
    targetDate = getDateObj(date);
  } else {
    targetDate = date;
  }
  const now = getDateObj();
  const obj = {};

  let hours = targetDate.getHours() > 12 ? targetDate.getHours() - 12 : targetDate.getHours();
  let minutes = targetDate.getMinutes() < 10 ? "0" + targetDate.getMinutes() : targetDate.getMinutes();
  obj.time = hours + ':' + minutes;

  obj.ampm = targetDate.getHours() > 12 ? '下午' : '上午';

  let dateStr = '';
  if (targetDate.getFullYear() !== now.getFullYear()) {
    dateStr = targetDate.getFullYear() + '年' + (targetDate.getMonth() + 1) + '月' + targetDate.getDate() + '日';
  } else {
    dateStr = (targetDate.getMonth() + 1) + '月' + targetDate.getDate() + '日';
  }
  obj.date = dateStr;

  const weekConf = ['日', '一', '二', '三', '四', '五', '六'];
  obj.week = '星期' + weekConf[targetDate.getDay()];
  return obj;
}

function getDateStr(date) {
  let targetDate;
  if (typeof date === 'string') {
    if (!date) {
      return "";
    }
    
    targetDate = getDateObj(date);
  } else {
    targetDate = date;
  }

  const now = getDateObj();
  let dateStr = '';
  if (targetDate.getFullYear() !== now.getFullYear()) {
    dateStr = targetDate.getFullYear() + '年' + (targetDate.getMonth() + 1) + '月' + targetDate.getDate() + '日';
  } else {
    if (targetDate.getMonth() === now.getMonth() && targetDate.getDate() === now.getDate()) {
      let minutes = targetDate.getMinutes();
      dateStr = targetDate.getHours() + ':' + (minutes < 10 ? '0' + minutes: minutes);
    } else {
      dateStr = (targetDate.getMonth() + 1) + '月' + targetDate.getDate() + '日';
    }
  }
  return dateStr;
}

function splitStrToArrayByNewLineToken(str) {
  return str.split(/\r?\n/);
}

function dictionaryMapping(key, objType) {
  if(key==0||key==null){
    return;
  }
  key = key - 1;
  let dictionaryObj = {};
  dictionaryObj.stepType = ['初试', '复试', '终试'];
  dictionaryObj.waiveType = ['不考虑机会', '放弃面试', '放弃offer', '放弃入职'];
  for (let index in dictionaryObj) {
    if (index == objType){
      let typeArr = dictionaryObj[index];
      let typeName = typeArr[key];
      return typeName;
    }
  }
  return typeName;
}

function getNavHeight(){
  if (wx.getStorageSync('navHeight')) {
    let navH = wx.getStorageSync('navHeight');
    navH = navH + 'px';
    this.setData({
      navHeight: navH
    })
  }
}

function setNameStringToStorage (list, key) {
  let nameArr = [];
  if (list instanceof Array) {
    list.forEach(function (elem) {
      nameArr.push(elem.OccupationName);
    });
    wx.setStorageSync(key, nameArr.join('、'));
  } else {
    wx.removeStorageSync(key)
  }
  
}

function fixDateStr (str) {
  if (str == '0001-01-01') {
    return "";
  }
  return str;
}

function fixPitureStr (img) {
  if (!img || img === "/static/images/defaultphoto_middle.gif") {
    return "http://static2.risfond.com/photos-preivew/dd259bbf769749abb3c47650227bcb8a.png";
  }
  return img;
}

// 创建Date对象必须用这个，因为对iphone手机做了兼容性处理
function getDateObj (dateStr) {
  if (!dateStr) {
    return new Date();
  }
  
  var dateStr = dateStr.replace(/[-.]/g, '/');
  if ((dateStr.match(/\//g) || []).length == 1) {
    dateStr += "/1";
  }

  return new Date(dateStr);
}
// user settings Create by Allen.sun on 2020/03/11
function getSettings (type) {
  type = "scope." + type;
  return new Promise((reslove, reject) => {
    wx.getSetting({
      success(res) {
        let res_status = res.errMsg;
        if (res_status !== "getSetting:ok") {
          reject(res.errMsg);
          return
        }
        reslove({
          detail: res.authSetting[type],
          type: type
        })
      }
    })
  })
  
}
// 地理位置封装 Create by Allen.sun on 2020/03/11
function getLocation () {
  return new Promise((resolve, reject) => {
        wx.getLocation({
          type: 'wgs84',
          isHighAccuracy: true,
          success: res => {
            let res_state = res.errMsg == "getLocation:ok";
            if (!res_state) {
              reject(res)
              return;
            }
            let qqmapsdk = new QQmap({key: getApp().globalData.qqmapKey});
            qqmapsdk.reverseGeocoder({
              location: {
                latitude: res.latitude,
                longitude: res.longitude
              },
              success: function (res) {
                let info = res.result.address_component;
                let ret = {
                  Province: info.province.replace("市", ""),
                  City: info.city.replace("市", "")
                }
                resolve(ret)
              },
              fail: function (mis) {
                reject(mis)
              }
            })
          },
          fail: mis => {
            reject(mis)
          }
      })
  }) 
}


let logitems = [];
let dbgRtmp = false;
let systemInfoChecked = false;
let uid = `${parseInt(Math.random() * 1000000)}`;
let timer;

const debounce = function(fn, delay) {
  return function () {
    let context = this
    let args = arguments
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}

const formatTimeAorag = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const millisecond = date.getMilliseconds();

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second, millisecond].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const requestPermission = (scope, cb) => {
  wx.getSetting({
    success(res) {
      if (res.authSetting[scope]) {
        cb && cb();
      } else {
        wx.authorize({
          scope: scope,
          success() {
            cb && cb();
          }
        })
      }
    }
  })
}


const log = (msg, level) => {
  return
  let time = formatTimeAorag(new Date());
  logitems.push(`${time}: ${msg}`);
  if (level === "error") {
  //  console.error(`${time}: ${msg}`);
  } else {
  //  console.log(`${time}: ${msg}`);
  }
}

const getUid = () => {
  return uid;
}

const mashupUrl = (url, channel) => {
  return url;
}

const checkSystemInfo = (app) => {
  if (!systemInfoChecked) {
    systemInfoChecked = true;
    wx.getSystemInfo({
      success: function (res) {
        log(`${JSON.stringify(res)}`);
        let sdkVersion = res.SDKVersion;
        let version_items = sdkVersion.split(".");
        let major_version = parseInt(version_items[0]);
        let minor_version = parseInt(version_items[1]);

        app.globalData.systemInfo = res;

        if (major_version <= 1 && minor_version < 7) {
          wx.showModal({
            title: '版本过低',
            content: '微信版本过低，部分功能可能无法工作',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    })
  }
}

function handleGetTabBar (scope,index) {
  if (typeof scope.getTabBar === 'function' && scope.getTabBar()) {
    scope.getTabBar().setData({
      selected: index
    })
  }
}

// 生成随机BASE64字符串用于标记当前用户（产品说不考虑清缓存的问题）;
function createBase64RandomCode(min, max, charStr) {
  var returnStr = "",
    range;
  if (typeof min == 'undefined') {
    min = 32;
  }
  if (typeof max == 'string') {
    charStr = max;
  }
  range = ((max && typeof max == 'number') ? Math.round(Math.random() * (max - min)) + min : min);
  charStr = charStr || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < range; i++) {
    var index = Math.round(Math.random() * (charStr.length - 1));
    returnStr += charStr.substring(index, index + 1);
  }
  return returnStr;
}

let RandomCode = {
  code: null,
  key: [],
  create: function (key) {
    console.log(createBase64RandomCode());
    if (wx.getStorageSync(key)) {
      RandomCode.key.push(key);
      return;
    }
    RandomCode.code = createBase64RandomCode();
    if (!RandomCode.code) return;
    RandomCode.key.push(key);
    console.log(key);
    console.log(RandomCode.code);
    wx.setStorageSync(key, RandomCode.code)
  },
  getCode: function (key) {
    if (RandomCode.key.indexOf(key) == -1 ) {
      console.error("RandomCode: 未包含" + key +"的储存记录，已经重新模拟处理")
      return createBase64RandomCode();
    }
    let code = wx.getStorageSync(key);
    if (!code) {
      console.error("RandomCode: 包含" + key + "但是储存的值已经被清除或者遇到其他问题, 已经重新模拟处理");
      return createBase64RandomCode();
    }
    return code
  }
}
function createSunCode(page,token, queryString, next) {
  function getCode (page,token) {
    wx.request({
      url: "https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=" + token,
       data: {
        scene: queryString,
         page: (page || "pages/internal-recruitment/index") //这里按照需求设置值和参数   
      },
      method: "post",
      responseType: 'arraybuffer',
      success: function (res) {
        var src = wx.arrayBufferToBase64(res.data);
        next(src);
      }
    })
  }
  if (!token) {
    getAccessToken(function (res) {
        getCode(page, res.data.access_token)
    });
    return
  }
  getCode(page, token);
 
}

function getAccessToken (next) {
  wx.request({
    url: "https://api.weixin.qq.com/cgi-bin/token",
    data: {
      grant_type: "client_credential",
      appid: "wx2b32ce8195bd6d29",
      secret: "0c516c4783b16bdd1e28c976b2bc87a6"
    },
    method: "get",
    success: function (res) {
      next(res)
    }
  })
}

function getAndSaveDataToLocal (options, key,getKey) {
  if (wx.getStorageSync(key)) return;
  wx.$http(options).then(res => {
    let data = getKey ? res[getKey] : res;
    console.log(data);
      if (!data) return; 
       wx.setStorage({
          key: key,
         data: data,
       })
    });
}

module.exports = {
  getNavHeight: getNavHeight,
  dictionaryMapping: dictionaryMapping,
  formatTime: formatTime,
  uploadImgs: upload.uploadImgs,
  isValidEmail: validate.isValidEmail,
  isValidMobile: validate.isValidMobile,
  showErrorMsg: showErrorMsg,
  getMobileWithStar: getMobileWithStar,
  getDateStr: getDateStr,
  getDatePartObj: getDatePartObj,
  splitStrToArrayByNewLineToken: splitStrToArrayByNewLineToken,
  setNameStringToStorage,
  fixDateStr: fixDateStr,
  fixPitureStr: fixPitureStr,
  getDateObj: getDateObj,
  getLocation: getLocation,
  getUid: getUid,
  checkSystemInfo: checkSystemInfo,
  formatTime: formatTime,
  requestPermission: requestPermission,
  log: log,
  clearLogs: function () {logitems = []},
  getLogs: function () { return logitems },
  mashupUrl: mashupUrl,
  debounce: debounce,
  handleGetTabBar: handleGetTabBar,
  RandomCode: RandomCode,
  createSunCode: createSunCode,
  getAccessToken: getAccessToken,
  getAndSaveDataToLocal
};