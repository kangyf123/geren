// components/popup/popup.js
import track from "../../mixins/trackEvent.js"
Component({
  properties: {
    name: {
      type: String,
      value: "",
    },
    position: {
      type: String,
      value: "",
    },
    img: {
      type: String,
      value: "",
    }, 
    mobile: {
      type: String,
      value: ""
    },
  },
  data: {
    isShow: false,
  },
  methods: {
    show: function () {
      this.setData({
        isShow: true,
      });
    },
    hide: function () {
      this.setData({
        isShow: false,
      });
    },
    _call: function () {
      this.hide();
      wx.makePhoneCall({
        phoneNumber: this.data.mobile,
      })
      track.trackEvent(function (options, track) {
        track(options.botton_call.id, { text: options.botton_call.text})
      })
    },
  }
})
