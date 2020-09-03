const app = getApp();
import track from "./trackEvent.js"

module.exports = {
  data: {
    _navigateTo: {
      locked: false,
    },
  },
  _navigateWithLoginTo (e) {
    let data = e && e.currentTarget.dataset, isPointer = data.point == 1, pointkey = data.pointkey;
    // isPointer ? track.trackEvent(function (options, track) {
    //   track(options[pointkey].id, { text: options[pointkey].text})
    // }) : "";
    if (app.globalData.isLogin) {
      this._navigateTo(e);
    } else {
      wx.setStorageSync('logined-navigate', this.route);
      this._navigateTo("/pages/login/login");
    }
  },
  _navigateTo (e) {
    if (this.data._navigateTo.locked) {
      return; 
    }
    this.setData({
      '_navigateTo.locked': true,
    });
    let url,
      hasBefore = false;
    if (typeof e === 'string') {
      url = e;
    } else {
      url = e.currentTarget.dataset.url;
        let isPointer = e.currentTarget.dataset.point == 1,
        pointKey = e.currentTarget.dataset.pointkey;
      // 设置埋点 create by Allen.sun on 2020/04/07
      if (isPointer) {
        track.trackEvent(function (options, track) {
          track(options[pointKey].id, { text: options[pointKey].text })
        })
      }
      if (e.currentTarget.dataset.beforenavigate) {
        this[e.currentTarget.dataset.beforenavigate] && this[e.currentTarget.dataset.beforenavigate](e);
      }
    }
 

    wx.navigateTo({
      url: url,
      complete: () => {
        this.setData({
          '_navigateTo.locked': false,
        });
      },
    })
  },
}