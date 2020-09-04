// pages/citySelector/index.js
const App = getApp(); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selector: null,
    navHeight: 64,
    localData: "",
    selected: "",
    cityData: [],
    navBackQuery: {},
    posTop: 177,
    currentIndex: 0
  },
  chooseMover (e) {
    let index = Number(((e.touches[0].clientY - 177) / 20).toFixed(0));
    if (index == this.data.currentIndex) return;
    let city = this.data.cityData[index + 1];
    if (!city) return;
    this.data.currentIndex = index;
    this.setData({
      selector: city.Id
    })
  },
  chooseMoverEnd () {
    this.data.currentIndex = 0;
  },
  // 点击城市逻辑
  selectorClick (e) {
    let dataset = e.currentTarget.dataset, selected = "", type = dataset.type, _this = this;
    if (type == "local" || type == "hot") {
      selected = dataset.type + "_" + dataset.city
    } else {
      selected = dataset.city;
    }
    this.data.backUrl = "/pages/internal-recruitment/index";
    console.log(dataset);
    this.setData({
      selected: selected,
      navBackQuery: {
        data: dataset.city
      }
    });
    setTimeout(function () {
      _this._navback();
    }, 300)
  },
  _navback () {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      backData: this.data.navBackQuery
    });
    wx.navigateBack({
      delta: 1
    })
  },
  // 选择滚动位置
  choosertap: function (e) {
    this.setData({
      selector: e.currentTarget.dataset.pos
    })
  },
  initSelector: function (city) {
    let flag = true, _this = this;
    this.setData({
      cityData: wx.getStorageSync("structCityData")
    })
    if (this.cityData && this.cityData.length !== 0) {
        return;
    }
    if (city) this.data.cityData.forEach(o => {
      if (!flag) return;
      o.Cities.forEach(cy => {
        if (!flag) return;
        if (cy.CityName !== city) return;
        flag = false;
        _this.setData({
          selector: cy.CityNamePY
        })
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let city = options.city;
    this.initSelector(city);
    let local = wx.getStorageSync("localData");
    let targetCity = city == "全国" ? "local_" + local.City : city;
    this.setData({
      navHeight: wx.getStorageSync("navHeight") || 64,
      localData: local.City,
      selected: targetCity,
      navBackQuery: {
        data: city
      }
    });
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

  }
})