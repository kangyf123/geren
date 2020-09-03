// components/agora-pusher.js
const Utils = require("../../utils/util.js")
const videoCode = require("../../common/js/liveConfig.js");

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    minBitrate: {
      type: Number,
      value: 200
    },
    maxBitrate: {
      type: Number,
      value: 500
    },
    width: {
      type: Number,
      value: 0
    },
    height: {
      type: Number,
      value: 0
    },
    x: {
      type: Number,
      value: 0
    },
    y: {
      type: Number,
      value: 0
    },
    muted: {
      type: Boolean,
      value: !1
    },
    debug: {
      type: Boolean,
      value: !1
    },
    enableCamera: {
      type: Boolean,
      value: true
    },
    beauty: {
      type: String,
      value: 0
    },
    aspect: {
      type: String,
      value: "3:4"
    },
    cls: {
      type: String,
      value: "touchView"
    },
    /**
     * 0 - loading, 1 - ok, 2 - error
     */
    status: {
      type: String,
      value: "loading",
      observer: function (newVal, oldVal, changedPath) {
      //  Utils.log(`player status changed from ${oldVal} to ${newVal}`);
      }
    },
    url: {
      type: String,
      value: "",
      observer: function (newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
      //  Utils.log(`pusher url changed from ${oldVal} to ${newVal}, path: ${changedPath}`);
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    pusherContext: null,
    detached: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * start live pusher via context
     * in most cases you should not call this manually in your page
     * as this will be automatically called in component ready method
     */
    start() {
      this.data.pusherContext.stop();
      if (this.data.detached) {
      //  Utils.log(`try to start pusher while component already detached`);
        return;
      }
      this.data.pusherContext.start();
    },

    /**
     * stop live pusher context
     */
    stop() {
   //   Utils.log(`stopping pusher`);
      this.data.pusherContext.stop();
    },

    /**
     * switch camera direction
     */
    switchCamera() {
      let _this = this;
      this.data.pusherContext.switchCamera({
        success: function () {
          _this.triggerEvent('stateChange', {
            code: "0001",
            message: "切换摄像头成功",
            detail: "pusher"
          });
        },
        fail: function () {
          _this.triggerEvent('stateChange', {
            code: "0002",
            message: "切换摄像头失败",
            detail: "pusher"
          });
        }
      });
    },

    /**
     * 推流状态更新回调
     */
    recorderStateChange: function (e) {
      console.warn("pusher state", e.detail)
      if (e.detail.code < 0) {
        this.triggerEvent('stateChange', {
          code: "0003",
          message: "重新链接",
          detail: "pusher"
        });
      }
      // if (e.detail.code == 1003 || e.detail.code == 1008) {
      //   this.triggerEvent('stateChange', {
      //     code: e.detail.code,
      //     message: e.detail.message,
      //     detail: "pusher"
      //   });
      // }
      
      if (e.detail.code === -1307) {
        //re-push
      //  Utils.log('live-pusher stopped', "error");
        this.setData({
          status: "error"
        })
        //emit event
        this.triggerEvent('pushfailed');
      }

      if (e.detail.code === 1008) {
        //started
        //Utils.log(`live-pusher started`);
        if(this.data.status === "loading") {
          this.setData({
            status: "ok"
          })
        }
      }
    },
    recorderNetChange: function(e) {
      //Utils.log(`network: ${JSON.stringify(e.detail)}`);
      console.warn("pusher net", e.detail)
    },
    onLiveError (e) {
      console.warn(e);
    }
  },

  /**
   * 组件生命周期
   */
  ready: function () {
    this.data.pusherContext || (this.data.pusherContext = wx.createLivePusherContext(this));
  },
  moved: function () {

   },
  detached: function () {
    // auto stop pusher when detached
    this.data.pusherContext && this.data.pusherContext.stop();
    this.data.detached = true;
  }
})
