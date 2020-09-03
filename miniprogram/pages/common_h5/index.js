// pages/common_h5/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"",
    url: "",
    showNav: false
  },
  messageFromH5 (e) {
    wx.navigateToMiniProgram({
      appId: "wx3988aa3ac4ceb293"
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options.mode && options.mode == "cp" && (options.url = "https://wx.diggmind.com/?channel_code=ruishicp");
    this.setData({
      url: options.url
    })
    if (options.title) {
      this.setData({
        title: options.title
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   var Timer = setTimeout(_ => {
     wx.setNavigationBarTitle({
       title: this.data.title,
     });
     clearTimeout(Timer);
   },3000);
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})