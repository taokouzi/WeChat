var app = getApp();
var images = ['kaiping1.gif','kaiping2.gif','kaiping3.gif','kaiping4.gif','kaiping5.gif','kaiping6.gif','kaiping7.gif','kaiping8.gif'];
Page({
  data: {
    userInfo: {},
    src: '',
    coverImg:{
      hidden: false, //首页默认图片是否隐藏
      top: 0, //上面图片的top值
      bottom: 0, //下面图片的bottom值
      locked: false //首页展开触摸锁定
    }
  },
  bindViewTap: function() {
    wx.navigateTo({
      url: '../list/list'
    })
  },
  onShow: function(){
    this.setData({
      src: app.globalData.imgDir+images[Math.floor(Math.random()*8)]
    });
  }
})
