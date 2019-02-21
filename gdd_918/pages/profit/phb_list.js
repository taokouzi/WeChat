// pages/phb_list/index.js
var app = getApp();
Page({

  data: {
    phb_arr:'',
    no1:'',
    no2:'',
    no3:'',
    my_rank:'',

    session_id:'',
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

        //排行榜
        wx.request({
          url: that.data.request_url + 'profit.php?action=profit_ranking',
          data: {
            session_id: res.data,
            page: 1
          },
          method: 'GET',
          header: { 'content-type': 'application/json' },
          success: function (res) {
            if( res.data.code == '1' ){
              that.setData({
                no1: res.data.data['123'][0],
                no2: res.data.data['123'][1],
                no3: res.data.data['123'][2],
                phb_arr: res.data.data['410'],
                my_rank: res.data.data['now_data'],    //我的名次 排名在第10之后
              })
            }
            else{
              console.log(res);
            }
          }
        })
    //排行榜 E N D


      }
    })
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
      title: that.data.my_rank[0].nickname + '赚到' + that.data.my_rank[0].frozen_money+'大洋，快来试试', 
      path: '/pages/index/index?from=phb_list',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})