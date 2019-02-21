// pages/user/index.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{
      lv:1,
      lv_name:'废铁',
      nick:'用户昵称',
      head:'./images/head.png',
      visit_day_num:0,
      mc:0
    },
    sign_status:0,

    isUf: 1,
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getSetting({
      success(res) {
        // console.log(res)
        if (!res.authSetting['scope.userInfo']) {
          that.setData({
            isUf: 0
          })
        }
      }
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
    wx.showLoading({
      title: '加载中...',
    })
    this.info( app.data.openid );
    this.sign_status(app.data.openid );
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


  info: function (openid)
  {
    var that = this;
    app.ajax('./res.php', { action: 'info', openid: openid},function(res){
      // console.log(res)
      if( res.data.code == 1 )
      {
        if (res.data.data.head )
        {
          that.setData({
            info: res.data.data
          })
        }
      }
      wx.hideLoading()
    },function(){console.log('info error')})
  },

  sign_status: function (openid)
  {
    var that = this;
    app.ajax('./res.php', { action: 'sign_status', openid: openid }, function (res) {
      // console.log(res)
      if (res.data.code == 1) {
        that.setData({
          sign_status: res.data.status
        })
      }
    }, function () { console.log('sign_status error') })
  },

  sign: function (e) {
    var that = this;
    var openid = app.data.openid;;
    var sign_status = e.currentTarget.dataset.status;
    if (sign_status == '1' )
    {
      wx.showToast({
        title: 'Dear，明日再来打卡哦~',
        icon: 'none'
      })
    }
    else
    {
      wx.showLoading({
        title: '正在打卡...',
      })

      app.ajax('./res.php', { action: 'sign', openid: openid }, function (res) {
        if (res.data.code == 1) {
          that.sign_status(openid );
          that.info(openid );
        }
        wx.showToast({
          title: '打卡成功！',
          icon: 'success'
        })
      }, function () { console.log('sign_status error') })

    }
  },


  getUserInfo:function(e)
  {
    // console.log(e)
    if (e.detail.userInfo) 
    {
      // console.log('授权通过')

      this.save_userInfo(e.detail.userInfo.nickName, e.detail.userInfo.avatarUrl )

      this.setData({
        userInfo: e.detail.userInfo,
        isUf: 1
      })
    } 
    else
    {
      // console.log('拒绝')

    }
  },


  save_userInfo:function( nick,head )
  {
    var that = this;
    var openid = app.data.openid;
    // console.log(openid)
    app.ajax('./res.php', { action: 'save_userInfo', openid: openid, nick: nick,head: head }, function (res) {
      if (res.data.code == 1) {
        that.info(openid );
      }
    }, function () { console.log('save_userInfo error') })
  }
  
})