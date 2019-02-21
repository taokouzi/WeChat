// pages/red_bag_share/index.js
var app = getApp();
Page({

  data: {
      shareArr:'',

      session_id:'',
      share_title:'',
      id:'',  //活动id

      is_show:'0',

      http: app.config().pic_url,
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

          wx.request({
            url: that.data.request_url+'my.php?action=get_recommend',
            data: {
              session_id: res.data
            },
            method: 'GET',
            header: { 'content-type': 'application/json' },
            success: function (res) {
              console.log(res);
              if( res.data.code == '1' ){
                that.setData({
                  shareArr: res.data.data,
                  share_title: res.data.data.recommend_adver,
                  id: res.data.data.id,   //活动id
                  is_show:'1'
                })
              }
              else if (res.data.code == '9003') {
                that.setData({
                  is_show: '2'
                })
              }
              else{
                console.log(res);
              }
            }
          })
          
        }
      })
      //获取数据的session_id  E N D
      
  },

 //推荐给好友
  onShareAppMessage: function (res) {

    var that = this;

    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res);
    }
    return {
      title: that.data.share_title,
      path: '/pages/index/index?shareing=' + that.data.session_id+'&recomedId='+that.data.id,
      imageUrl: that.data.http + that.data.shareArr.recommend_pic,
      success: function (res) {
        // 转发成功
        console.log('转发成功 recomedId = ' + that.data.id);
      },
      fail: function (res) {
        // 转发失败
        console.log('转发失败');
      }
    }
  },






  //推荐有奖
  tui_jian: function (e) {

    var that = this;

    wx.request({
      url: that.data.request_url+'my.php?action=get_recommend',
      data: {
        session_id: that.data.session_id
      },
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res);
      }
    })
  },
  //推荐有奖 E N D




})