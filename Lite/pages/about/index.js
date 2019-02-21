// pages/about/index.js
var app = getApp();
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
    this.readnum_guanyu();
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

  
  readnum_guanyu: function () {
    let that = this;
    app.ajax('./res.php', { action: 'readnum', r_status: 3 }, function (res) {
      if (res.data.code == 1) {
        that.setData({
          readnum: res.data.num
        })
      }
    }, function () { console.log('readnum error 3') })
  }
})