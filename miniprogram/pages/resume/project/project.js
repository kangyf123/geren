Page({

  data: {
    navHeight: '',
    showNavBut: true,
    query: {
      Id: 0, //编辑必填,新增为0
      ProjectName: "", //项目名称
      DateFrom: "", //开始时间
      DateTo: "", //结束时间
      IsCurrent: false, //是否至今
      JobTitle: "", //职位名称
      Duty: "", // 职责
      Performance: "", //业绩
      ProjectIntroduction:""
    },
    isComplete: false,
  },
  mixins: [require('../../../mixins/navigateTo.js'), require('../../../mixins/resume.js'),require('../../../utils/util.js')],
  onLoad(){
    this.getNavHeight();
    this.setData({
      completeRules: {
        DateTo: 'checkDateTo',
      }
    });
  },
  onShow(){
    this.getNavHeight();
  }
})