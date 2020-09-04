// components/sun-selector/sun-selector.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    selectedDataProps: {
      type: String,
      value: "",
      observer: function (val) {
        this.properties.selectedDataProps && this.setInitSelecter(this.properties.selectedDataProps, this.properties.selectorData);
        this.setData({
          selectedData: val
        });
      }
    },
    jumpAnotherPage: {
      type: Object,
      value: {
        switch: false,
        url: ""
      }
    },
    selectorData: {
      type: Array,
      value: [],
      observer: function (val) {
        this.properties.selectedDataProps && this.setInitSelecter(this.properties.selectedDataProps, this.properties.selectorData);
      }
    },
    title: {
      type: String,
      value: "sun_seletor_title"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    selectorIndex: 0,
    showDropPanel: false,
    selector: "",
    selectedData: "",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setInitSelecter (value, arr) {
      let index = 0;
      arr.forEach((o, i) => { 
        if (index > 0) return;
        Object.keys(o).forEach(key => {
          value.indexOf(o[key]) >= 0  && (index = i)
        })
      });
      this.setIniteSelectedBar(index);
      this.triggerEvent('sunSelectorEvent', index == 0 ? "全国" : value);
    },
    setIniteSelectedBar (index) {
      setTimeout(_ => {
        this.setData({
          selectorIndex: index,
          selector: "scrollbar_" + index
        })
      }, 500)
    },
    scrollbarClick (e) {
      let dataset = e.currentTarget.dataset, index = dataset.index, selectorid = dataset.selectorid, selector = dataset.selector;
      if (index == this.data.selectorIndex) return;
      this.setData({ selectorIndex: index, selectedData: selectorid});
      this.triggerEvent('sunSelectorEvent', selectorid);
      this.data.selector = selector;
      if (this.data.showDropPanel) {
        this.sunSelectorSwitchPanel();
      }
    },
    sunSelectorSwitchPanel () {
      let _this = this, o = this.properties.jumpAnotherPage;
      if (o.switch) {
        wx.navigateTo({
          url: '/pages/citySelector/index?city=' + this.data.selectedData,
        })
        return
      }

      this.setData({
        showDropPanel: !this.data.showDropPanel
      });
      let timer = setTimeout(_ => {
        this.setData({
          selector: _this.data.selector
        });
      },500)
    }
  }
})
