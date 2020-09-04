Component({
  data: {
    selected: 0,
    color: "#999",
    selectedColor: "#3B87FF",
    "list": [
      {
        "pagePath": "../home/home",
        "text": "首页",
        "iconPath": "../imgs/icon-home.png",
        "selectedIconPath": "../imgs/icon-home-selected.png"
      },
      {
        "pagePath": "../recommends/recommends",
        "text": "消息",
        "iconPath": "../imgs/nav/Nav_icon__msg.png",
        "selectedIconPath": "../imgs/nav/Nav_icon__msg--active.png"
      },
      {
        "pagePath": "../my/my",
        "text": "我的",
        "iconPath": "../imgs/icon-user.png",
        "selectedIconPath": "../imgs/icon-user-selected.png"
      }
    ]
  },
  attached() {
    this.getMsgCount();
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    },
    getMsgCount: function () {
      console.log("获取消息数量！custom-tab-bar");
    }
  }
})