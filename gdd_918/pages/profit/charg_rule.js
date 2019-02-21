// pages/charg_rule/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    session_id:'',
    init_down:'',
    init_up:'',
    request_url: app.config().request_url,     //请求地址
  },

  onShow: function (options) {
    var that = this;

    //获取数据的session_id
    wx.getStorage({
      key: 'session_id',
      success: function (res) {

        that.setData({
          session_id: res.data
        })

        console.log(res.data);
        //计费规则
        wx.request({
          url: that.data.request_url+'profit.php?action=profit_rule',
          data: {
            session_id: res.data
          },
          method: 'GET',
          header: { 'content-type': 'application/json' },
          success: function (res) {
            console.log(res);
            that.setData({
              rule_arr: res.data.data,
              red_adver: res.data.data.red_adver,
              red_photo: res.data.data.red_photo,
              red_share: res.data.data.red_share,
              red_stop: res.data.data.red_stop,
              init_up: res.data.data.init_up,
              init_down: res.data.data.init_down,
            })



          }
        })
    //计费规则 E N D




      }
    });
    //获取数据的session_id  E N D


    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    var that = this;
    if (e.from === 'menu') {
      // 来自页面内转发按钮
      console.log(e.target)
    }
    return {
      title: '广点点（广告接单平台）',
      path: '/pages/index/index?from=charg_rule',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})