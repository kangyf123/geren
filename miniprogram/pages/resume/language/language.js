Page({
  data: {
    navHeight: '',
    showNavBut: true,
    query: {
      LanguageId: "",
      ProficiencyId: "",
    },
    info: {
      LanguageId: {},
      ProficiencyId: {},
    },
    conf: {
      LanguageId: [{
          id: "01",
          name: '汉语',
        },
        {
          id: "02",
          name: '英语',
        },
        {
          id: "03",
          name: '日语',
        },
        {
          id: "04",
          name: '法语',
        },
        {
          id: "05",
          name: '德语',
        },
        {
          id: "06",
          name: '韩语/朝鲜语',
        },
        {
          id: "07",
          name: '俄语',
        },
        {
          id: "09",
          name: '西班牙语',
        },
        {
          id: "14",
          name: '葡萄牙语',
        },
        {
          id: "12",
          name: '阿拉伯语',
        },
        {
          id: "13",
          name: '意大利语',
        }

      ],
      ProficiencyId: [
        {
          id: "1",
          name: '一般',
        },
        {
          id: "2",
          name: '熟练',
        },
        {
          id: "3",
          name: '精通',
        }
      ],
    },
  },
  mixins: [require('../../../mixins/navigateTo.js'), require('../../../mixins/resume.js'), require('../../../utils/util.js')],
  bindSelectChange: function(e) {
    const type = e.currentTarget.dataset.type,
      val = e.detail.value,
      selected = this.data.conf[type][val];
    this.setData({
      ['query.' + type]: selected.id,
      ['info.' + type]: selected,
    });
    this._changeIsComplete();
  },
  onLoad: function (options) {
    this.getNavHeight();
  },
  onShow: function () {
    this.getNavHeight();
  },
})