const app = getApp();
const util = require('../../utils/util.js');
Component({
  properties: {
    data: {
      type: Object,
      value: {},
    },
    hasHeadhunter: {
      type: Boolean,
      value: true,
    },
    navTo:{
      type: Boolean,
      value: true,
    },
    needFormatValue:{
      type: Boolean,
      value: true,
    }
  },
  data: {
    publishDate: '',
    job: {},
    staff: {},
    isLock: false,
  },
  lifetimes: {
    attached: function () {
      
    },
  },
  methods: {
    navigateTo: function (e) {
      // add navTo control navigateTo no use
      if (!this.properties.navTo) {
        return
      }
      if (this.data.isLock) {
        return;
      }
      this.setData({
        isLock: true,
      });

      const _this = this;
      if (!app.globalData.isLogin) {
        wx.navigateTo({
          url: '/pages/login/login',
          complete: function () {
            _this.setData({
              isLock: false,
            });
          },
        })
        return;
      }

      wx.navigateTo({
        url: '/pages/jobs/details/details?id=' + this.data.job.JobId,
        complete: function () {
          _this.setData({
            isLock: false,
          });
        },
      })
    },
    navigateToHeadhunter: function (e) {
      if (this.data.isLock) {
        return;
      }
      this.setData({
        isLock: true,
      });
      const _this = this;
      wx.navigateTo({
        url: '/pages/headhunters/details/details?id=' + this.data.staff.StaffId,
        complete: function () {
          _this.setData({
            isLock: false,
          });
        },
      });
    }
  },
})
