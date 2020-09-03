// components/sun-fadeTip/index.js
Component({

  /**
   * 页面的初始数据
   */
  properties: {
    tipText : {
      type: String,
      value: "马上加入我们，做自己的CEO"
    },
    leftTip:{
      type:Boolean,
      value:false
    }
  },
  data: {
    showTip: false
  },
  lifetimes: {
    ready: function () {
      this.timeOutShell(function () {
        this.setData({
          showTip: true
        })
      }, 2000).next(function (fn) {
        fn(_ => {
          this.setData({
            showTip: false
          })
        }, 6000);
      })
    }
  },
  methods: {
     // 定时器自定义壳
    timeOutShell (fn, time) {
      function next(fn) {
          fn.call(this, this.timeOutShell);
      }
      let timer = setTimeout(_ => {
        fn.call(this);
        next
        clearTimeout(timer);
      }, time || 2000);
      return {
        next: next.bind(this)
      }
    }
  }
})