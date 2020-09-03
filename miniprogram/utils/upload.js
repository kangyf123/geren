const appSet = getApp();
function chooseImageTap (url, callback) {
  var that = this;
  let imagesList = [];
  let maxSize = 1024 * 1024 * 2;
  let maxLength = 1;
  let flag = true;
  let fileType = ['png', 'jpg', 'jpeg'];
  wx.chooseImage({
    count: 1, //最多可以选择的图片总数
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      wx.showToast({
        title: '正在上传...',
        icon: 'loading',
        mask: true,
        duration: 500
      })

      for (let i = 0; i < res.tempFiles.length; i++) {
        if (res.tempFiles[i].size > maxSize) {
          flag = false;
          wx.showModal({
            content: '图片大小不超过2M',
            showCancel: false,
          });
          return;
        }

        let fileSplit = res.tempFiles[i].path.split(".")
        let ext = fileSplit[fileSplit.length - 1];
        if (fileType.indexOf(ext) === -1) {
          wx.showModal({
            content: '支持上传的图片格式有png, jpg, jpeg',
            showCancel: false,
          });
          return;
        }
      }

      if (res.tempFiles.length > maxLength) {
        wx.showModal({
          content: '最多能上传' + maxLength + '张图片',
          showCancel: false,
        });
        return;
      }

      if (flag == true && res.tempFiles.length <= maxLength) {
        imagesList = res.tempFilePaths;
      }
      wx.uploadFile({
        url: getApp().globalData.host + url,
        filePath: res.tempFilePaths[0],
        name: 'images',
        header: {
          "Content-Type": "multipart/form-data",
          "Authorization": "Bearer " + getApp().globalData.token,
        },
        success: function (e) {
          console.log(e)
          let resp = JSON.parse(e.data);
          resp.Data.ViewUrl = resp.Data.ViewUrl.replace("http://", "https://");
          callback(resp);
        },
        fail: function (data) {
          wx.showModal({
            content: JSON.stringify(data),
            showCancel: false,

          });
        }
      })
    },
  })

}

module.exports = {
  uploadImgs: chooseImageTap,
}