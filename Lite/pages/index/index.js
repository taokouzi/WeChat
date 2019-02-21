// pages/index/index.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatordots: true,
    autoplay: true,
    interval: "3500",
    duration: "800",
    

    msgList:'',
    share:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    this.up_visit();
    this.share();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.banner();
    this.weather();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    if( e.from == 'button' )
    {
      // console.log('帅')
    }

    let share = this.data.share;
    // console.log(share)
    return{
      title: share.title,
      desc: share.text,
      imageUrl: share.img
    }
    
  },



  share:function()
  {
    let that = this;
    app.ajax('res.php', { action: 'share' }, function (res) {
      // console.log(res)
      
      that.setData({
        share: res.data.data
      })
    }, function () {
      console.log('share error')
    })
  },

  // 天气
  weather:function(){
    var that = this;
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    wx.request({
      url: 'https://www.apiopen.top/weatherApi',
      data: {
        "city":'温江区'
      },
      method: 'GET',
      scriptCharset: "utf-8",
      header: { 'content-type': 'json' },
      success: function (res) {
        // console.log(res)
        if( res.data.code == 200 )
        {
          that.setData({
            msgList:[
              { url: 'x', title: year + '年' + month + '月' + res.data.data.forecast[0].date + ' 涌泉街道 ' + res.data.data.forecast[0].type + ' 当前温度' + res.data.data.wendu+'℃' },
              { ulr: 'x', title: res.data.data.ganmao}
            ]
          })
        }
      },
      fail: function () {
        console.log('weather error')
      },
    })
  },



  banner:function()
  {
    let that = this;
    app.ajax('res.php', { action:'banner',local:1},function(res){
      if( res.data.code == 1 )
      {
        that.setData({
          banner: res.data.data
        })
      }
      else
      {
        that.setData({
          banner:[{
            'img':'./images/banner/banner1.jpg'
          }]
        })
      }
      wx.hideLoading();
    },function(){
      console.log('bannner error')
    })

  },

  up_visit:function(){
    app.ajax('res.php', { action: 'up_visit' }, function (res) {
    }, function () {
      console.log('up_visit error')
    })
  }


})