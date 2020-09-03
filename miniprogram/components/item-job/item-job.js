const app = getApp();
const util = require('../../utils/util.js');
Component({
  properties: {
    data: {
      type: Object,
      value: {},
    },
    isNewdate: {  // 新增应聘时间
      type: Boolean,
      value: false,
    },
    hasHeadhunter: {
      type: Boolean,
      value: true,
    },
    showIndus: {
      type: Boolean,
      value: false,
    },
    needDate: {
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
      let job, staff;
      if (this.data.hasHeadhunter) {
        job = this.data.data.Job;
        staff = this.data.data.Staff;
        this.setData({
          job: job,
          staff: staff,
        });
      } else {
        job = this.data.data;
        this.setData({
          job: job,
        });
      }
      // 只有极速应聘才需要展示过滤的时间 
      if(this.data.isNewdate){
        let dateStr = util.getDateStr(job.CreateTime);
        this.setData({
          publishDate: dateStr,
        });
      }
    },
  },
  methods: {
    navigateTo: function (e) {
      if (this.data.isLock) {
        return;
      }
      this.setData({
        isLock: true,
      });

      const _this = this;
      // 未登录 可以查看职位详情 2020-07-21 created
      
      // if (!app.globalData.isLogin) {
      //   wx.navigateTo({
      //     url: '/pages/login/login',
      //     complete: function () {
      //       _this.setData({
      //         isLock: false,
      //       });
      //     },
      //   })
      //   return;
      // }
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
