const util = require("../../utils/util");
const api = require("../../common/js/api")
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text:{
      type: String,
      value: ""
    },
    content: {
      type: String,
      value: "加入锐仕方达，自己做老板"
    },
    show: {
      type: Boolean,
      value: false
    },
    bgList: {
      type: Array,
      default: [],
      observer: function (arr) {
        if (!arr[0]) return;
          this.imgListLen = arr.length;
          this.changeImgTarget();
      }
    },
    QCquery: {
      type: Object,
      value: {},
      observer (obj) {
        if (!obj.appid) return;
        this.getQCcode(obj)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    codeUrlBase64: "",
    codeUrl: "",
    imgListLen: 6,
    selectedListIndex: 0,
    selectedTagetUrl: "",
    painting:{},
    shareImagePath: "",
    userImg: "",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getQCcode (data) {
      wx.$http({
          url:api.GetQRCodePic,
          method: "post",
          data: data,
      }).then(res => {
          this.setData({
              codeUrl: res
          });
      })
    },
    currentChange (e) {
        this.data.selectedListIndex = e.detail.current;
        this.changeImgTarget();
    },
    trrigerClose () {
      this.triggerEvent("close")
    },
    eventGetImage (e) {
        const { tempFilePath, errMsg } = e.detail;
        if (errMsg !== 'canvasdrawer:ok') return;
        this.setData({
            shareImagePath: tempFilePath,
            painting: {}
        });
        this.saveImageToPhotosAlbum(this.data.shareImagePath);

    },
    changeImgTarget () {
      this.data.selectedListIndex >= 0 && this.setData({
        selectedTagetUrl: this.properties.bgList[this.data.selectedListIndex].PicUrl
      })
    },
    imgChange () {
      if (this.data.selectedListIndex >= this.data.imgListLen - 1) {
        this.setData({selectedListIndex: 0});
        return
      }
      this.setData({selectedListIndex: this.data.selectedListIndex + 1});
      this.changeImgTarget();

    },
    saveImg () {
      wx.showLoading({
          title: "正在生成图片..."
      })
      if (this.data.codeUrl) {
          this.createImg(this.data.selectedTagetUrl, this.getUserImg(), this.getTitleText(), this.properties.content);
          return
      }
    },
    getTitleText () {
      return this.properties.text + "期待您的加入"
    },
    getUserImg () {
        return  "/imgs/Common__risfond_logo.png"
    },
    createImg (bgImg, uerImg, text, content) {
        this.setData({
          painting: {
            "width": 360,
            "height": 532,
            "clear": true,
            "views": [{
              "type": "image",
              "url": bgImg,
              "top": 17,
              "left": 15,
              "width": 345,
              "height": 460
            }, {
              "type": "rect",
              "background": "#fff",
              "top": 316,
              "left": 30,
              "width": 315,
              "height": 135
            }, {
              "type": "rect",
              "background": "#eee",
              "top": 361,
              "left": 30,
              "width": 315,
              "height": 1
            }, {
              "type": "image",
              "url": uerImg,
              "top": 330,
              "left": 45,
              "width": 58,
              "height": 19
            }, {
              "type": "text",
              "content": text,
              "fontSize": 12,
              "color": "#333",
              "top": 334,
              "left": 115
            }, {
              "type": "text",
              "content": content,
              "fontSize": 14,
              "bolder": true,
              "MaxLineNumber": 3,
              "width": 176,
              "breakWord": true,
              "color": "#333",
              "top": 379,
              "left": 45
            }, {
              "type": "image",
              "url": "https://jystatic.risfond.com/personalpic/card-longtip.png",
              "top": 409,
              "left": 45,
              "width": 104,
              "height": 20
            }, {
              "type": "image",
              "url": this.data.codeUrl,
              "top": 370,
              "left": 260,
              "width": 70,
              "height": 70
            }]
          }
        })
    },
    saveImageToPhotosAlbum (imgSrc) {
      wx.saveImageToPhotosAlbum({
        filePath: imgSrc,
        success: function (res) {
          wx.hideLoading();
          wx.showToast({
            title: '保存成功',
          })
        },
        fail: function (err) {
          console.log(err)
        }
      })
    }
  }
})
