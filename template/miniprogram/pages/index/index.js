//index.js
const app = getApp()

Page({
  data: {
    bannerList: [
      {
        Img: '../../images/01.png',
      }, {
        Img: '../../images/02.png',
      },
      {
        Img: '../../images/03.png',
      },
      {
        Img: '../../images/04.png',
      },
      {
        Img: '../../images/05.png',
      },{
        Img: '../../images/06.png',
      }
    ],
    
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    prolist:[
      {
        logo:'../../images/11.png',
        desc:'基础护肤'
      },
      {
        logo:'../../images/12.png',
        desc:'魅力彩妆'
      },
      {
        logo:'../../images/13.png',
        desc:'精选面膜'
      },
      {
        logo:'../../images/14.png',
        desc:'营养保健'
      },
      {
        logo:'../../images/15.png',
        desc:'日用个护'
      },
      {
        logo:'../../images/16.png',
        desc:'母婴护理'
      },
      {
        logo:'../../images/17.png',
        desc:'美发专区'
      },
      {
        logo:'../../images/18.png',
        desc:'科学美容'
      }
    ],
    imagg:[
      {
        img:'../../images/191.png',
        tex:'法国CLARNS娇韵诗',
        price:"299.00",
        add:'../../images/加入购物车.png'
      }
    ]
  },

})
    

