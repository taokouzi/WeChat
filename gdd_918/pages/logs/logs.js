//logs.js
// const util = require('../../utils/util.js')

// Page({
//   data: {
//     logs: []
//   },
//   onLoad: function () {
//     this.setData({
//       logs: (wx.getStorageSync('logs') || []).map(log => {
//         return util.formatTime(new Date(log))
//       })
//     })
//   }
// })



import NumberAnimate from "../user/NumberAnimate";

Page({
  data: {

  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    
    this.setData({
      num1: '',
      num1Complete: ''
    });

    let num1 = 2128.01;
    let n1 = new NumberAnimate({
      from: num1,//开始时的数字
      speed: 2000,// 总时间
      refreshTime: 100,//  刷新一次的时间
      decimals: 2,//小数点后的位数
      onUpdate: () => {//更新回调函数
        this.setData({
          num1: n1.tempValue
        });
      },
      onComplete: () => {//完成回调函数
        this.setData({
          // num1Complete: " 完成了"
        });
      }
    });



  },
  onReady: function () {

  },
  onShow: function () {

    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },

  onUnload: function () {
    // 页面关闭

  },
  
})
