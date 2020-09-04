// components/sun-map/sun-map.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    latitude: {
      type: Number,
      value: 39.921899999999994
    },
    longitude: {
      type: Number,
      value: 116.44355000000003
    },
    address: {
      type: String,
      value: "地址"
    },
 
    covers: {
      type: Array,
      value: [{
        latitude: 23.099994,
        longitude: 113.344520,
        iconPath: '/imgs/location.png'
      }, {
        latitude: 23.099994,
        longitude: 113.304520,
          iconPath: '/imgs/location.png'
      }]
    }
  },
  lifetimes: {
    ready: function () {
      //this.mapCtx = wx.createMapContext('myMap');
      setTimeout(_ => {
        this.setData({
          markers: [{
            id: 1,
            latitude: this.properties.latitude,
            longitude: this.properties.longitude,
            name: this.properties.address,
            iconPath: "/imgs/location.png",
            width: "24rpx",
            height: "24rpx"
          }],
          showLabel: true
        })
      }, 500)
     
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    mapCtx: null,
    markers: {
      type: Array,
      value: [{
        id: 1,
        latitude: 39.921899999999994,
        longitude: 116.44355000000003,
      }]
    },
    showLabel: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getRoute () {
      wx.openLocation({
        latitude: this.properties.latitude,
        longitude: this.properties.longitude,
        name: this.properties.address,
        scale: 100
      })
    }
  }
})
