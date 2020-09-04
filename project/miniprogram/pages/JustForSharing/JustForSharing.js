let app = getApp();
Page({
  data: {
    newIndustry: '',
    newTitle: '',
    isScreenBottomRound: false, // 兼容苹果x系列
    currentIndex: 0,
    showNavBut: true,
    jobId: 0,
    shareCode: '',
    drawingStartPosition: [256, 360, 324], // 画图根据图片算出来的起始位置
    backImg: {
      '0': 'cloud://yun-uvfqf.7975-yun-uvfqf-1302389649/01.png',
      '1': 'cloud://yun-uvfqf.7975-yun-uvfqf-1302389649/02.png',
      '2': 'cloud://yun-uvfqf.7975-yun-uvfqf-1302389649/04.png'
    },
    JobDetail: {
      "JobId": 0,
      "Title": "", //招聘职位
      "NumberOfHiring": 0, //招聘数量
      "Location": "", //工作区域
      "SalaryFrom": 0, //岗位年薪  单位元
      "SalaryTo": 0, //岗位年薪 单位元
      "Industry": "0", // 所属行业
      "AgeFrom": 0, // 年龄
      "AgeTo": 0, //  年龄
      "EducationLevel": "" //学历
    }
  },
  onLoad: function (options) {
    this.setData({
      jobId: options.id
    });
    this.getJobDetailByJobId(options.id);
    this.getQRCodeByJob(options.id);
    this.setData({
      isScreenBottomRound: app.globalData.isScreenBottomRound
    })
  },
  // 保存图片
  saveCanvas: function () {
    let _this = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 345,
      height: 600,
      canvasId: 'shareImg',
      success: function (res) {
        console.log(res.tempFilePath);
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            // console.log(res, '图片生成了');
            wx.showModal({
              content: '图片已保存到相册',
              showCancel: false,
              confirmText: '好的',
              confirmColor: '#333',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定');
                }
              }
            })
          }
        })
      }
    }, _this)
  },
  // 画图canvas
  initCanvas: function () {
    let _this = this;
    let currentIndex = _this.data.currentIndex; // 画图的索引
    let canvasHeight = _this.data.drawingStartPosition[currentIndex]; // 画图的起始位置
    let bgImg = _this.data.backImg[currentIndex];
    let saveTipsText = "扫码投递职位";
    let saveTips = "cloud://yun-uvfqf.7975-yun-uvfqf-1302389649/666.png";
    let JobDetail = _this.data.JobDetail;
    let newTitle = '';
    let newIndustry = '';

    // 名字 过长...
    if (JobDetail.Title.length > 11) {
      newTitle = JobDetail.Title.substring(0, 11) + '...'
    } else {
      newTitle = JobDetail.Title
    }

    // 所属行业 过长...
    if (JobDetail.Industry.length > 12) {
      newIndustry = JobDetail.Industry.substring(0, 12) + ' ...'
    } else {
      newIndustry = JobDetail.Industry
    }

    let textData = [
      `招聘职位：${newTitle}`,
      `招聘数量：${JobDetail.NumberOfHiring}人`,
      `工作区域：${JobDetail.Location}`,
      `岗位年薪：${JobDetail.SalaryFrom / 10000 }-${JobDetail.SalaryTo / 10000 }万`,
      `所属行业：${newIndustry}`,
      `其他要求：${JobDetail.AgeFrom}-${JobDetail.AgeTo}岁  |  ${JobDetail.EducationLevel}`,
    ];
    let SunCode = _this.data.shareCode;
    wx.showLoading({
      title: '图片生成中...',
      mask: true
    });

    // 绘制需要的背景图
    let promise1 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: bgImg,
        success: function (res) {
          // console.log(res, 'bgImg');
          resolve(res);
        }
      })
    });

    // 绘制需要的长按识别小程序码图片文字
    let promise2 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: saveTips,
        success: function (res) {
          // console.log(res, 'saveTips');
          resolve(res);
        }
      })
    });

    // 绘制太阳码图片
    let promise3 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: SunCode,
        success: function (res) {
          // console.log(res, 'SunCode');
          resolve(res);
        }
      })
    });
    Promise.all(
      [promise1, promise2, promise3]
    ).then(res => {
      // 创建 canvas 画布
      const ctx = wx.createCanvasContext('shareImg', _this);

      // 背景
      ctx.drawImage(res[0].path, 0, 0, 345, 600);

      // 创建招聘信息文字部分  
      ctx.setFillStyle('#000'); //  颜色
      ctx.setFontSize(14); //  字号
      textData.forEach((item, index) => {
        ctx.fillText(item, 42, canvasHeight + index * 24);
      });

      // 绘制下面线
      ctx.setStrokeStyle('#EEEEEE');
      ctx.moveTo(40, canvasHeight + 144);
      ctx.lineTo(305, canvasHeight + 144);
      ctx.setLineWidth(1);
      ctx.stroke();

      // 只有currentIndex为0的时候 是竖着的 其他时候是横着的
      if (currentIndex == 0) {
        // 绘制太阳码
        ctx.drawImage(res[2].path, 135, canvasHeight + 168, 70, 70);

        // 绘制太阳码下面提示文案
        ctx.setFillStyle('#000'); //  颜色
        ctx.font = 'normal bold 14px sans-serif';
        ctx.fillText(saveTipsText, 130, canvasHeight + 266);

        // 绘制长安识小程序icon
        ctx.drawImage(res[1].path, 126, canvasHeight + 280, 90, 18);
      } else {

        // 绘制太阳码下面提示文案
        ctx.setFillStyle('#000'); //  颜色
        ctx.font = 'normal bold 14px sans-serif';
        ctx.fillText(saveTipsText, 42, canvasHeight + 175);

        // 绘制长安识小程序icon
        ctx.drawImage(res[1].path, 42, canvasHeight + 185, 90, 18);

        // 绘制太阳码
        ctx.drawImage(res[2].path, 250, canvasHeight + 157, 52, 52);
      }

      ctx.draw(false, () => {
        setTimeout(() => {
          wx.hideLoading();
          _this.saveCanvas();
        }, 2000)
      });
    })
  },
  // 换一换
  currentBindChange: function (e) {
    this.setData({
      currentIndex: e.detail.current
    })
  },
  // 换一换 按钮
  currentChange: function () {
    let index = 0;
    if (this.data.currentIndex == 2) {
      index = 0
    } else {
      index = this.data.currentIndex + 1;
    }
    this.setData({
      currentIndex: index
    });
  },
  // 获取职位详情
  getJobDetailByJobId: function (jobId) {
    let _this = this;
    let newTitle = '';
    let newIndustry = '';
    wx.$http({
      url: '/v1/account/GetJobDetailByJobId',
      data: {
        jobId: jobId
      }
    }).then(Data => {
      // console.log(Data, '获取职位详情');
      // 名字 过长图片位置展示需要...
      if (Data.Title.length > 11) {
        newTitle = Data.Title.substring(0, 11) + '...'
      } else {
        newTitle = Data.Title
      }
      // 所属行业 过长...
      if (Data.Industry.length > 12) {
        newIndustry = Data.Industry.substring(0, 12) + ' ...'
      } else {
        newIndustry = Data.Industry
      }

      _this.setData({
        JobDetail: Data,
        newTitle: newTitle,
        newIndustry: newIndustry
      });
    })
  },
  // 获取职位分享二维码
  getQRCodeByJob: function (jobId) {
    let _this = this;
    wx.$http({
      url: '/v1/Account/GetQRCodeByJob',
      data: {
        jobId: jobId
      }
    }).then(data => {
      // console.log(data, '获取职位分享二维码');
      _this.setData({
        shareCode: data
      })
    })
  },
  saveText: function () {
    let JobDetail = this.data.JobDetail;
    let data =
      `
      急招！急招！
      招聘职位：${JobDetail.Title}
      招聘数量：${JobDetail.NumberOfHiring}人
      工作区域：${JobDetail.Location}
      岗位年薪：${JobDetail.SalaryFrom / 10000 }-${JobDetail.SalaryTo / 10000 }万
      所属行业：${JobDetail.Industry}
      其他要求：${JobDetail.AgeFrom}-${JobDetail.AgeTo}岁  |  ${JobDetail.EducationLevel}
    `
    wx.setClipboardData({
      data: data,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data)
          }
        })
      }
    })
  },
  onShareAppMessage: function () {
    // path: '/pages/jobs/details/details?id=' + this.data.jobId
    return {
      title: '急招！急招！',
      path: '/pages/jobs/details/details?id=' + this.data.jobId
    }
  }
})