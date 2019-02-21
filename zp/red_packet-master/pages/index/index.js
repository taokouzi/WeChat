var app = getApp();
Page({
  data: {
    userInfo: {},
    src: '',
    coverImg:{
      hidden: false,
      top: 0, //上面图片的top值
      bottom: 0, //下面图片的bottom值
      locked: false //首页展开触摸锁定
    },
    openPage: app.globalData.openPage==1?true:false
  },
  resetCoverImg: function() {
    this.setData({
      coverImg:{
        hidden: false,
        top: '0',
        bottom: '0'
      }
    })
  },
  bindOpenTap: function () {
    var that = this;
    if(!that.data.coverImg.locked){
      that.setData({coverImg:{locked: true}});
      var dis = 0;
      var timer = setInterval(function(){
          dis -= 1;
          that.setData({
            coverImg:{
              top: dis+'%',
              bottom: dis+'%'
            }
          })
        },10);
        setTimeout(function(){
          clearInterval(timer);
          //展开首页图
          that.setData({
            coverImg:{
              hidden: true,
              locked: false
            }
          })
          //未展示开屏页直接跳转
          if(that.data.openPage){
            that.goToOpenPage();
          }else{
            that.goToListPage();
          }
        },500);
    }
  },
  goToListPage: function() {
    wx.navigateTo({
      url: '../list/list'
    })
  },
  goToOpenPage: function() {
    wx.navigateTo({
      url: '../open/open'
    })
  },
  //分享
  onShareAppMessage: function() {
      app.updateUserInfo({'type':0});
      return {
          title: '优惠猎手PRO',
          desc: '优惠猎手PRO',
          path: 'pages/index/index'
      }
  },
  onShow: function() {
      this.resetCoverImg();
  }
})
