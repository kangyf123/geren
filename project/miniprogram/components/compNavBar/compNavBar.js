// components/compNavBar/compNavBar.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showHeart: {
      type: Boolean,
      value: true,
    },
    heartNum: {
      type: Number,
      value: 0
    },
    heartState: {
      type: Boolean,
      value: false,
      observer (value) {
        value && this.setData({ isHeart: true });
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    isHeart: false,
    navTop: app.globalData.navTop,
    navHeight: app.globalData.navHeight
  },

  /**
   * 组件的方法列表
   */
  methods: {
    addHeart () {
      if (this.data.isHeart) {
        wx.showToast({
          title: '已经赞过了',
          icon: 'none'
        })
        return;
      }
      this.setData({
        isHeart: !this.data.isHeart
      })
      this.triggerEvent('addSupport');
    },
    _navback () {
      let pages = getCurrentPages();
      if (pages.length == 1) {
        wx.reLaunch({
          url: '/pages/home/home',
        });
          return
      }
      wx.navigateBack({
        delta: 1
      })
    }
  }
})
