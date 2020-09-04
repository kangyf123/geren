let errCode = {
  // 拉流
  "-2301": "网络断连，且经多次重连抢救无效，更多重试请自行重启播放",
  "-2302": "获取加速拉流地址失败",
  "2101": "当前视频帧解码失败",
  "2102": "当前音频帧解码失败",
  "2103": "网络断连, 已启动自动重连",
  "2104": "网络来包不稳：可能是下行带宽不足，或由于主播端出流不均匀",
  "3001": "RTMP -DNS解析失败",
  "3002": "RTMP服务器连接失败",
  "3003": "RTMP服务器握手失败",
  "3005": "RTMP 读/写失败",
   // 推流
  "-1301": "打开摄像头失败",
  "-1302": "打开麦克风失败",
  "-1303": "视频编码失败",
  "-1304": "音频编码失败",
  "-1305": "不支持的视频分辨率",
  "-1306": "不支持的音频采样率",
  "-1307": "网络断连，且经多次重连抢救无效，更多重试请自行重启推流",
  "-1308": "开始录屏失败，可能是被用户拒绝",
  "-1309": "录屏失败，不支持的Android系统版本，需要5.0以上的系统",
  "-1310": "录屏被其他应用打断了",
  "-1311": "Android Mic打开成功，但是录不到音频数据",
  "-1312": "录屏动态切横竖屏失败",
  "1103": "硬编码启动失败,采用软编码",
  "1104": "视频编码失败",
  "1105": "新美颜软编码启动失败，采用老的软编码",
  "1106": "新美颜软编码启动失败，采用老的软编码",
  "3001": "RTMP -DNS解析失败",
  "3002": "RTMP服务器连接失败",
  "3003": "RTMP服务器握手失败",
  "3004": "RTMP服务器主动断开，请检查推流地址的合法性或防盗链有效期",
  "3005": "RTMP 读/写失败",
  "10001": "用户禁止使用摄像头",
  "10002": "用户禁止使用录音",
  "10003": "背景音资源（BGM）加载失败",
  "10004": "等待画面资源（waiting-image）加载失败"
},
unusualCode = {
   // 拉流
  "2105": "当前视频播放出现卡顿",
  "2106": "硬解启动失败，采用软解",
  "2107": "当前视频帧不连续，可能丢帧",
  "2108": "当前流硬解第一个I帧失败，SDK自动切软解",
  // 推流
  "1101": "网络状况不佳：上行带宽太小，上传数据受阻",
  "1102": "网络断连, 已启动自动重连",
},
succCode = {
   // 拉流
  "2002": "已经连接 RTMP 服务器,开始拉流",
  "2001": "已经连接服务器",
  "2003": "网络接收到首个视频数据包(IDR)",
  "2004": "视频播放开始",
  "2005": "视频播放进度",
  "2006": "视频播放结束",
  "2007": "视频播放Loading",
  "2008": "解码器启动",
  "2009": "视频分辨率改变",
   // 推流
  "1001": "已经连接推流服务器",
  "1002": "已经与服务器握手完毕,开始推流",
  "1003": "打开摄像头成功",
  "1004": "录屏启动成功",
  "1005": "推流动态调整分辨率",
  "1006": "推流动态调整码率",
  "1007": "首帧画面采集完成",
  "1008": "编码器启动"
},
agora = {
  "500": "内部错误", // 解决方案: 销毁并退出频道后，重建 client 对象，调用 rejoin 方法尝试重连
  "501": "服务进程异常失去连接", // 解决方案: 销毁并退出频道后，重建 client 对象，调用 rejoin 方法尝试重连
  "502": "当前服务器过载", // 解决方案: 销毁并退出频道后，重建 client 对象，调用 rejoin 方法尝试重连
  "503": "服务进程正常退出",
  "901": "未找到服务器", // 解决方案: 检查是否开启小程序的服务权限；也可能是没有配置域名或 uid 参数格式不正确；你还可以检查网络；检查传入的 App ID、Dynamic Key 是否有效
  "903": "发送消息超时",
  "904": "websocket 断开", // 解决方案: 销毁并退出频道后，重建 client 对象，调用 rejoin 方法尝试重连
  "905": "websocket 连接失败" // 解决方案: 销毁并退出频道后，重建 client 对象，调用 rejoin 方法尝试重连
};

export const videoCode = Object.assign({}, errCode, unusualCode, succCode);