var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  back: function () {
    wx.switchTab({
      url: '/pages/self/index',
      success: function () { }
    })
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
    this.order_list();
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


  // 兑换记录
  order_list:function()
  {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    app.ajax('users.php', { 'action':'order_list','user_id':app.data.user_id},res=>{
      // console.log(res);
      if( res.data.code == 1 )
      {
        that.setData({
          isNot: false,
          dh_list: res.data.datas
        })
      }
      else
      {
        that.setData({
          isNot:true
        })
      }

      wx.hideLoading();

    },function(){console.log('order_list fail');})
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

  }
})