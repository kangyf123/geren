import pointData from "../common/js/config_point.js"

function track (id, data) {
  wx.uma.trackEvent(id.toString(), data || {});
}

module.exports = {
  trackEvent: (function (pointData) {
    return function (next) {
      next(pointData, track);
    }
  })(pointData)
}