// components/input-panel/input-panel.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    keywords: {
      type: String,
      value: "",
    },
    limit: {
      type: Number,
      value: 20,
    },
    type: {
      type: String,
      value: "input",
    },
    unit: {
      type: String,
      value: "",
    },
    placeholder: {
      type: String,
      value: "",
    }
  },
  data: {
    counter: 0,
    inputType: 'text',
    isPageShow: false,
  },
  ready: function () {
    if (this.data.type === 'number') {
      this.setData({
        inputType: 'number',
      });
    }
    this.setData({
      counter: this.data.keywords.length,
      isPageShow: true,
    });
  
  },
  methods: {
    bindInput: function (e) {
      this.setData({
        counter: e.detail.value.length,
      });
      var myEventDetail = {
        value: e.detail.value,
      };
      this.triggerEvent('input', myEventDetail)
    },
    clearInput: function () {
      this.setData({
        counter: 0,
      });
      var myEventDetail = {
        value: '',
      };
      this.triggerEvent('input', myEventDetail)
    },
  },
})
