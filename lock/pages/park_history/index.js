// pages/park_history/index.js

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: '',
    request_url: app.config().request_url,     //请求地址
    is_empty:true,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;

    var token = wx.getStorageSync('token');

    if (!token || token == null || token == undefined || token == '') {
      wx.redirectTo({
        url: '../login/index?from=app'
      })
      return false;
    }

    that.setData({
      token: token
    })

    wx.showLoading({
      title: '加载中',
    })
    
    that.showParkHistoryInfoFunc();


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



  // 停车记录回显
  showParkHistoryInfoFunc:function(){
    var that = this;
    
    that.setData({
      showloading: true
    })

    wx.request({
      url: that.data.request_url + 'parking_history.php?action=list',
      data: {
        token: that.data.token,
      },
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        //console.log(res);
  
        if ( res.data.code == '1' )
        {
          that.setData({
            is_empty:false,
            park_history: res.data.datas,
          })
        }
        else if (res.data.code == '9003' )
        {
          that.setData({
            empty_text: '暂无数据~'
          })
        }
        else
        {
          that.setData({
            empty_text: '状态码：' + res.data.code,
          })
        }

        // setTimeout(function () {
          wx.hideLoading()
        // }, 1000)

      },
      error:function(){
        that.setData({
          empty_text: '服务器数据异常！'
        })

        // setTimeout(function () {
          wx.hideLoading()
        // }, 1000)
        
      }
    })

  }


})