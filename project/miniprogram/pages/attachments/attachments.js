Page({
  data: {
    navHeight: '',
    showNavBut: true,
    list: [],
    count: 0,
  },
  mixins: [
    require('../../mixins/navigateTo.js'),
    require('../../utils/util.js'),
    require('../../utils/util.js'),
    require('../../mixins/screenAdapt.js'),
  ],
  onLoad: function (options) {
    this.ajaxGetAttachResume();
    this.getNavHeight();
  },
  onShow: function () {
    this.getNavHeight();
  },
  ajaxGetAttachResume: function () {
    const _this = this;
    wx.$http({
      url: '/v1/Member/GetAttachResumes',
    }).then(function (data) {
      const list = [];
      data.Data.forEach(function (elem) {
        if (elem.Name.endsWith('doc') || elem.Name.endsWith('docx')) {
          elem.fileType = 'doc';
        }
        if (elem.Name.endsWith('pdf')) {
          elem.fileType = 'pdf';
        }
        list.push(elem);
      });
      _this.setData({
        list: data.Data,
        count: data.Data.length,
      });
    });
  },
  removeAttachResume: function (e) {
    const _this = this;
    const id = e.currentTarget.dataset.id;

    wx.showModal({
      title: '提示',
      content: '确认删除此附件？',
      confirmText: '删除',
      confirmColor: '#3B87FF',
      success(res) {
        if (res.confirm) {
          _this.ajaxDeleteAttachResumes(id);
        }
      }
    })
  },
  ajaxDeleteAttachResumes: function (id) {
    const _this = this;
    wx.$http({
      url: '/v1/Member/DeleteAttachResumes',
      data: {
        memberAttachResumeID: id,
      },
    }).then(function (data) {
      _this.ajaxGetAttachResume();
    });
  },
  openDocument: function (e) {
    let url = e.currentTarget.dataset.url.replace('http', 'https');
    if (!url.startsWith("https")) {
      url = url.replace("http", "https");  
    }
    wx.downloadFile({
      url: url,
      success: function (res) {
        var filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          fail: function (res) {
            wx.showToast({
              title: '抱歉，当前附件预览失败',
              icon: 'none',
              duration: 2000
            })
          },
        })
      }
    })
  },
})