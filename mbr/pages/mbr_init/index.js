// pages/mbr_init/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mbrIcons:[
      { text: '送话费'},
      { text: '会员折扣' },
      { text: '积分赠送' },
      { text: '海量优惠券' },
      { text: '运费减免' },
      { text: '尊贵标识' },
      { text: '头像框' }, 
      { text: '补签卡' },
      { text: '积分福利' },
      { text: '生日关怀' },
      { text: '演出赛门票' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      mbrIcons: this.data.mbrIcons
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
  
  }
})