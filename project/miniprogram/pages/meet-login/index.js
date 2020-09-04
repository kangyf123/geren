/**
 *    Create by Allen.sun on 2020/03/20
 *    Module: meeting-login
 *    Description: 面试间登录逻辑
 */

const app = getApp();
const Utils = require('../../utils/util.js');
const api = require('../../common/js/api.js');
const APPID = require("../../utils/config.js").APPID;
// pages/index/index.js.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // used to store user info like portrait & nickname
    userInfo: {},
    hasUserInfo: false,
    // whether to disable join btn or not
    disableJoin: false,
    focus: true,
    isLonger: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.channel = "";
    this.uid = Utils.getUid();
    this.lock = false;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 只有提供了该回调才会出现转发选项
   */
  onShareAppMessage() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * callback to get user info
   * using wechat open-type
   */
  onGotUserInfo: function(e){
    this.onJoin();
  },
  /**
   * check if join is locked now, this is mainly to prevent from clicking join btn to start multiple new pages
   */
  checkJoinLock: function() {
    return !(this.lock || false);
  },
  
  lockJoin: function() {
    this.lock = true;
  },

  unlockJoin: function() {
    this.lock = false;
  },

  onJoin: function () {
  
    let _this = this;
    let value = this.channel || "";
    let uid = this.uid;
    if (value.length < 6 || isNaN(value)) {
      wx.showToast({
        title: '请输入六位数字面试间号码',
        icon:'none',
        duration: 2000
      })
      return
    }
 
    
    this.isExistenceRoom(value, function () {
      _this.checkRoomUserNum(value, uid);
    });
  },
  onInputChannel: function (e) {
    let value = e.detail.value;
    this.setData({
       isLonger: value.length == 6
    });
    this.channel = value;
  },
  isExistenceRoom (room,next) {
    wx.$http({
      url: api.GetRoomInfoByRoomNum,
      method: "get",
      data:{
        roomNum: room
      }
    }).then(res => {
      res ? next() : wx.showToast({
        icon:"none",
          title: '该面试房间暂未开通，请您联系猎头顾问开通!',
        duration: 3000
      })
    })
  },
  checkRoomUserNum(room, uid) {
    wx.request({
      url: "https://c-api.risfond.com/v1/Account/GetInterViewRoomDetail?roomNum=" + room,
      success: function (res) {
        let data = res.data.Data;
        let bs = data.broadcasters || [], t = bs.length;
        if (t < 5) {
          wx.navigateTo({
            url: `../meeting/meeting?channel=${room}&uid=${uid}&role=broadcaster`
          });
          return
        }
        wx.showToast({
          icon: "none",
          title: '该面试房间已满，请您联系猎头顾问解决！'
        })
      }
    });
  }
})