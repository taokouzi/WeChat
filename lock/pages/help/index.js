// pages/help/index.js
var app = getApp()
Page({
  data: {

    request_url: app.config().request_url,     //请求地址
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    this.showHelpInfoFunc();
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
  onShareAppMessage: function () {
  
  },

  showHelpInfoFunc:function(){
    var that = this;
    wx.request({
      url: that.data.request_url + 'faq.php',
      data: {
        
      },
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res);
        if( res.data.code == 1 )
        {
          that.setData({
            faq: res.data.faq
          })
        }

        // setTimeout(function () {
          wx.hideLoading();
        // }, 500)

      }
    })
  }

})