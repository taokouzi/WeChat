// pages/profit/profit_.js
var app = getApp();
Page({
  data: {
      task:'',
      camara:' ',
      adv:' ',
      stop:' ',
      share:' ',
      session_id:'',
      all:'',

      is_show:'0',
      
      request_url: app.config().request_url,     //请求地址
  },


  onShow: function (options) {

    var that = this;

    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];    //获取当前页面的对象
    var url = currentPage.route;    //当前页面url
    var ops = currentPage.options;    //如果要获取url中所带的参数可以查看options


    //获取数据的session_id
    wx.getStorage({
      key: 'session_id',
      success: function (res) {
        that.setData({
          session_id: res.data
        })
        
      }
    })
    //获取数据的session_id  E N D


    //历史收益详情
    wx.request({
      url: that.data.request_url+'profit.php?action=old_profit',
      data: {
        member_id: ops.member_id,
        task_id: ops.task_id
      },
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res);
        if( res.data.code == '1' ){
          that.setData({
            task: res.data.data.task,
            camara: res.data.data.photo,    //拍照红包
            adv: res.data.data.adver_share,   //广告红包
            stop: res.data.data.stop,   //停车红包
            share: res.data.data.task_share,   //分享红包
            all: res.data.data.all,
            is_show:'1'
          })
        }
        else{
          console.log(res);
        }
      }
    })
    //历史收益详情 E N D
  },




  onShareAppMessage: function (e) {
    var that = this;
    if (e.from === 'menu') {
      // 来自页面内转发按钮
      console.log(e.target)
    }
    return {
      title: '广点点（广告接单平台）',
      path: '/pages/index/index?from=profit_details',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }

})