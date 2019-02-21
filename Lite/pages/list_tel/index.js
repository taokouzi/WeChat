// pages/user/index.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    readnum:'加载中...'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    this.tel_list();
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
    this.readnum_tels();
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

  call: function (e) {
    var tel = e.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel
    })
  },

  tel_list:function()
  {
    let that = this;
    app.ajax('./res.php', { action:'tels'},function(res){
      console.log(res)
      if( res.data.code == 1 )
      {
        that.setData({
          tels:res.data.data
        })
      }
      wx.hideLoading()
    },
    function(){console.log('tels error')})
  },
  readnum_tels: function () {
    let that = this;
    app.ajax('./res.php', { action: 'readnum', r_status: 1 }, function (res) {
      if (res.data.code == 1) {
        that.setData({
          readnum: res.data.num
        })
      }
    }, function () { console.log('readnum error 1') })
  }

})