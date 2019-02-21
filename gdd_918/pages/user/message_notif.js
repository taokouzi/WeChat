// pages/message_notif/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: [
      {
        link: '../logs/logs',
        url: 'images/b2.png'
      },
      {
        link: '../logs/logs',
        url: 'images/b1.png'
      },
      {
        link: '../logs/logs',
        url: 'images/b2.png'
      },
      {
        link: '../logs/logs',
        url: 'images/b3.png'
      }
    ],
    indicatordots: true,
    autoplay: true,
    interval: "3500",
    duration: "800",

    msg_list:'',

    session_id:'',

    request_url: app.config().request_url,     //请求地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {

    var that = this;

    //获取数据的session_id
    wx.getStorage({
      key: 'session_id',
      success: function (res) {

        that.setData({
          session_id: res.data
        })


        //提醒通知
        wx.request({
          url: that.data.request_url+'my.php?action=get_notice',
          data: {
            session_id: res.data
          },
          method: 'GET',
          header: { 'content-type': 'application/json' },
          success: function (res) {
            
            if( res.data.code == '1' ){
              that.setData({
                msg_list: res.data.data
              })
            }
            else{
              console.log(res);
            }
          }
        })
    //提醒通知 E N D


      }
    })
    //获取数据的session_id  E N D


  },





  onShareAppMessage: function (e) {
    var that = this;
    if (e.from === 'menu') {
      // 来自页面内转发按钮
      console.log(e.target)
    }
    return {
      title: '广点点（广告接单平台）',
      path: '/pages/index/index?from=message_notif',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }



})