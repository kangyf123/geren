const dataEdu = require('../../../data/edu.js');
Page({
  data: {
    EducationLevel:'',
    navHeight: '',
    showNavBut: true,
    query: {
      EducationId: 0,//会员教育标识(必填)
      IsCurrent: false,//当前项目结束时间是否为至今
      Institution: "",//学校结构
      StudyField: "",//专业
      DateFrom: "",//开始时间
      DateTo: "",//结束时间
      UnifiedAdmission: null,   //是否统招 1 是 0 否
      EducationLevel: {
        EducationLevel: "",//学历
        MBAStatus: 0, //是否有MBA[0,1
      },
    },
    info: {},
    conf: {
      UnifiedAdmission: [
        {
          id: 1,
          name: '统招',
        },
        {
          id: 0,
          name: '非统招',
        },
      ],
      EducationLevel: dataEdu,
    },
  },
  mixins: [require('../../../mixins/navigateTo.js'), require('../../../mixins/resume.js'), require('../../../utils/util.js')],
  onLoad: function () {
    const educationLevel = this.data.query.EducationLevel.EducationLevel;
    
    if (educationLevel) {
      let info = {};
      this.data.conf.EducationLevel.forEach(function (elem, index) {
        if (elem.id == educationLevel) {
          info = elem;
          info.index = index;
        }
      });

      this.setData({
        'info.EducationLevel.EducationLevel': info,
      });
      
    }

    this.setData({
      completeRules: {
        DateTo: 'checkDateTo',
      }
    });
    this.getNavHeight();
  },
  onShow(){
    this.getNavHeight();
    if (this.data.info.EducationLevel) {
      let EducationLevelId = this.data.info.EducationLevel.EducationLevel;
      let EducationLevel = this.data.conf.EducationLevel;
      let item;
      EducationLevel.forEach(i => {
        if (i.id == EducationLevelId) {
          item = i;
        }
      })
      this.setData({
        EducationLevel: item
      })
    }
  },
})