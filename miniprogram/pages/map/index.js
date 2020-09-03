Page({
  data: {
    latitude: 30.5427,
    longitude: 104.0527,
    markers: [{
      id: 1,
      latitude: 30.5427,
      longitude: 104.0527
    }]
  },
  onLoad() {
    this.openLocation();
  },
  openLocation() {
    wx.openLocation({
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      scale: 28,
      name: '西部电信中心',
      address: '益州大道1666号'
    })
  }
})