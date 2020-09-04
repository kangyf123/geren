// pages/internal-recruitment/index.js
import api from "../../common/js/api.js"
const util = require('../../utils/util.js');
Page({
  mixins: [require('../../mixins/navigateTo.js'), require('../../mixins/trackEvent.js')],
  /**
   * 页面的初始数据
   */
  data: {
    Recommender:0,
    heartNum: 0,
    heartState: false,
    src: "",
    List:[],
    videoRecruitClientId: null,
    userKey: null,
    selectorData:[],
    cityName: null,
    localData: {},
    page: 1,
    totalCount: 0,
    hideTipModal: false,
    jumpOpts:{
      switch: true,
      url: ""
    }
  },
  _handlerNavigateTo (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    });
    this.setData({
      hideTipModal: true
    })
  },
  tipClose () {
    this.setData({ hideTipModal: true})
  },
  getCompanyOfCityStruct: function () {
    //先注释掉缓存
    // let arr = wx.getStorageSync("structCityData");
    // if (arr.length > 0) return;
    wx.$http({
      url: api.GetCompanyOfCityStruct,
      method: "post"
    }).then(res => {
      wx.setStorage({
        key: 'structCityData',
        data: res,
      })
    })
  },
  // DONE:分公司列表
  _getClientRecruitList () {
    let _this = this;
    if (!this.data.cityName) return;
      wx.$http({
        url: api.GetClientRecruitDefault,
        method: "post",
         data: {
           CityName: this.data.cityName,
           PageIndex: this.data.page,
           PageSize: 5
         }
      }).then(res => {
        if (_this.data.page == 1) {
          _this.setData({
            src: res.CompanyVideoUrl,
            List: res.list,
            videoRecruitClientId: res.videoRecruitClientId,
            heartNum: res.videoSupportAmount,
            totalCount: res.RecordCount
          })
         // _this._getSupportState();
          return
        } 
        _this.setData({
          List: _this.data.List.concat(res.list)
        })
      })

  },
  // DONE:城市数据
  _getCompanyOfCity () {
    let _this = this;
    wx.$http({
      url: api.GetCompanyOfCity,
      method: "post"
    }).then(res => {
      //let cityName = this.data.localData && this.data.localData.Province;
      //this.data.cityName = cityName ? cityName :res[0];
      _this.setData({
        selectorData: res.map(name => { return { Id: name, Text: name} })
      });
    })
  },
  // DONE:sunSelector 派发出来的方法
  sunSelectorEvent (e) {
    this.data.cityName = e.detail;
    this.data.page = 1;
    this.data.totalCount = 0;
    this._getClientRecruitList();
  },
  // DONE:公司列表带参跳转
  complistClick (e) {
    // DONE: 当前推荐人的 StaffId
    let StaffIdInfo = '&StaffId=' +  this.data.Recommender
    wx.navigateTo({
      url: 'internal-job/index?id=' + e.currentTarget.dataset.id + StaffIdInfo,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // DONE: 通过扫码 进入 
    //       没有内招客户的默认跳转到 全国公司 || 当前位置的所在公司 
    //       保存推荐人的 StaffId
    this.data.Recommender = options.StaffId || 0;
    this.setData({
      localData: wx.getStorageSync("localData") || { City: "全国" }
    });
    // DONE: 获取随机userkey
    this.data.userKey = util.RandomCode.getCode("userRandomCode");
    this._getCompanyOfCity();
    this.getCompanyOfCityStruct();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    this.trackEvent(function (opts, track) {
      track(opts.into_recruitment.id)
    });
    if (this.data.backData) {
      this.setData({
        localData: {
          City: this.data.backData.data
        }
      })
    };
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
    if (this.data.totalCount >  this.data.List.length) {
      this.data.page++;
      this._getClientRecruitList();
    } else {
      wx.showToast({
        icon:"none",
        title: '数据就这么多啦'
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
   return {
     title: '告别前任，从"薪"出发',
     imageUrl: "https://rnss.oss-cn-beijing.aliyuncs.com/StaffFiles/ruishijingying/222.jpg"
     }   
  }
})