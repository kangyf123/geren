module.exports = {
  data: {
    list: [],
    count: -1,     // -1代表还没有请求过数据，0以及以上代表数据条数
    filters: {
      page: 1,
      size: 5,
    },
    isLoading: false,
  },
  onShow: function () {
    this.beforeOnShow && this.beforeOnShow();
    this.getList();
  },
  compileList: function (res) {
    this.setData({
      isLoading: false,
    });
    if (res.Page === 1) {
      this.setData({
        'list': res.Data,
        'count': res.RecordCount,
      });
    } else {
      this.setData({
        'list': this.data.list.concat(res.Data),
      });
    }
  },
  getList: function () {
    if (this.data.isLoading) {
      return;
    }
    this.setData({
      isLoading: true,
    });
    this.searchList();
  },
  reachBottomSwitch:function () {
    if (this.data.developerHandler) return; 
    if (!this.data.isLoading && this.data.filters.page * this.data.filters.size < this.data.count) {
      this.setData({
        'filters.page': this.data.filters.page + 1,
      });
      this.getList();
    }
  },
  searchList: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {
    this.reachBottomSwitch();
  },
}