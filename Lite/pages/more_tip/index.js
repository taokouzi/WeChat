// pages/more_tip/index.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    readnum:'加载中...',
    status: 0 //1地址 2//邮编
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var status = 0;
    // 地址
    if ( options.id == 'addr' ){
      this.readnum(2);
      status = 1;
    }
    // qq群
    else if (options.id == 'qq' ){
      this.readnum(6);
      status = 2;
    }
    
    var date = this.getNowFormatDate();
    this.setData({
      date: date,
      status: status
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

 

  readnum: function ( r_status )
  {
    let that = this;
    app.ajax('./res.php', { action: 'readnum', r_status: r_status }, function (res) { 
      // console.log(res)
      if( res.data.code == 1 )
      {
        that.setData({
          readnum: res.data.num
        })
      } 
    }, function () { console.log('readnum error ' + r_status)})
  },
  getNowFormatDate:function () {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if(month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  }
})