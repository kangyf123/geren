var app = getApp();
Page({
  data: {
    imgUrls: [{
      img: 'https://lg-5m19d6gc-1257165455.cos.ap-shanghai.myqcloud.com/five-1@2x.png',
        name: '一线专家指导，全面评估简历',
        subName: '五年以上工作经验的HR、猎头、简历专家，阅人、阅简历无数，更懂得什么样的简历更能打动HR。'
      },
      {
        img: 'https://lg-5m19d6gc-1257165455.cos.ap-shanghai.myqcloud.com/five-2@2x.png',
        name: '放大你的优势，突出你的能力',
        subName: '全方位解析个人能力，根据岗位需求，重点展示核心能力，突出个人优势与不可替代性。'
      },
      {
        img: 'https://lg-5m19d6gc-1257165455.cos.ap-shanghai.myqcloud.com/five-3@2x.png',
        name: '梳理工作经验，展示你的价值',
        subName: '根据过往工作经验，引入STAR法则全面分析，打造职业亮点，强化自身价值，为提高薪酬加码。'
      },
      {
        img: 'https://lg-5m19d6gc-1257165455.cos.ap-shanghai.myqcloud.com/five-4@2x.png',
        name: '提高简历曝光，获取更多机会',
        subName: '根据HR、猎头平时搜索、浏览简历习惯，在简历中增加关键词提升面试几率。'
      },
      {
        img: 'https://lg-5m19d6gc-1257165455.cos.ap-shanghai.myqcloud.com/five-5@2x.png',
        name: '解答职业困惑，规划职业发展',
        subName: '根据个人优势，兴趣爱好等全面分析，合理规划职业发展路线，收获不一样的职业生涯。'
      },
      {
        img: 'https://lg-5m19d6gc-1257165455.cos.ap-shanghai.myqcloud.com/five-6@2x.png',
        name: '缩短求职时间，快速获取工作',
        subName: '简历布局清晰、突出优势亮点给HR留下深刻印象，助力面试胜出快速获取工作。'
      }
    ],
    indicatorDots: true,
    autoplay: true,
    circular: true,
    interval: 3000,
    duration: 1000,
    listData: [
      { "code": "应届生", "text": "198元", "type": "198元", "typeR": "498元" },
      { "code": "1~3年", "text": "298元", "type": "248元", "typeR": "598元" },
      { "code": "4~10年", "text": "348元", "type": "298元", "typeR": "698元" },
      { "code": "10年以上", "text": "398元", "type": "348元", "typeR": "898元" },
    ]
  },
  //分享
  onShareAppMessage: function (res) {
    return {
      title: app.globalData.shareTitle,
      path: '/pages/introduction/index',
      success: function (e) {
        wx.showShareMenu({
          withShareTicket: true
        })
      }
    }
  },
  openMini () {
    wx.navigateToMiniProgram({
      appId: "wx3988aa3ac4ceb293"
    })
  }
})