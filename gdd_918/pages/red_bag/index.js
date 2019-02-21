// pages/red_bag/index.js
var app = getApp();
Page({

  data: {
    isCamera: true,
    cameraId:'',    //任务id
    cameraIsZuo:'',
    cameraActiveId:'',    //执行id
    cameraMemberId:'0',    //用户id

    isPark: true,
    parkId:'',
    parkIsZuo:'',
    parkActiveId: '',
    parkMemberId:'0',

    isAdv: true,
    advId:'',
    advIsZuo:'',
    advActiveId: '',
    advMemberId:'0',

    isShare: true,
    shareId:'',
    shareIsZuo:'',
    shareActiveId: '',
    shareMemberId:'0',

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


        wx.request({
          url: that.data.request_url + 'profit.php?action=is_red',
          data: {
            session_id: res.data,  //用户session_id
            active_type: 1     //拍照红包
          },
          method: 'GET',
          header: { 'content-type': 'application/json' },
          success: function (res) {
            //console.log(res);
            //console.log('拍照 = ' + res.data.code);
            if (res.data.code == 1) {
              that.setData({
                isCamera: true,
                cameraId: res.data.data.task_id,
                cameraActiveId: res.data.data.active_id,
                cameraMemberId: res.data.data.member_id,
                cameraIsZuo: res.data.data.is_zuo,
              })
            }
            else {
              that.setData({
                isCamera: false
              })
            }
          }
        });
        wx.request({
          url: that.data.request_url + 'profit.php?action=is_red',
          data: {
            session_id: res.data,  //用户session_id
            active_type: 2     //停车红包
          },
          method: 'GET',
          header: { 'content-type': 'application/json' },
          success: function (res) {
            //console.log(res);
            //console.log('停车 = ' + res.data.code);
            if (res.data.code == 1) {
              that.setData({
                isPark: true,
                parkId: res.data.data.task_id,
                parkActiveId: res.data.data.active_id,
                parkMemberId: res.data.data.member_id,
                parkIsZuo: res.data.data.is_zuo,
              })
            }
            else {
              that.setData({
                isPark: false
              })
            }
          }
        });
        wx.request({
          url: that.data.request_url + 'profit.php?action=is_red',
          data: {
            session_id: res.data,  //用户session_id
            active_type: 3     //广告红包
          },
          method: 'GET',
          header: { 'content-type': 'application/json' },
          success: function (res) {
            //console.log(res);
            //console.log('广告 = ' + res.data.code);
            if (res.data.code == 1) {
              that.setData({
                isAdv: true,
                advId: res.data.data.task_id,
                advActiveId: res.data.data.active_id,
              //  advMemberId: res.data.data.member_id,
                advIsZuo: res.data.data.is_zuo2,
              })
            }
            else {
              that.setData({
                isAdv: false         ////////////
              })
            }
          }
        });
        wx.request({
          url: that.data.request_url + 'profit.php?action=is_red',
          data: {
            session_id: res.data,  //用户session_id
            active_type: 4    //分享红包
          },
          method: 'GET',
          header: { 'content-type': 'application/json' },
          success: function (res) {
            //console.log(res);
            //console.log('分享 = ' + res.data.code);
            if (res.data.code == 1) {
              that.setData({
                isShare: true,
                shareId: res.data.data.task_id,
                shareActiveId: res.data.data.active_id,
               // shareMemberId: res.data.data.member_id,
                shareIsZuo: res.data.data.is_zuo2,
              })
            }
            else {
              that.setData({
                isShare: false /////////////
              })
            }
          }
        });


      }
    })
    //获取数据的session_id  E N D

    
    
  },

  cameraTap:function(){
    wx.showToast({
      title: '拍照红包已领取',
      icon: 'loading',
      duration: 1000
    })
  },

  parkTap: function () {
    wx.showToast({
      title: '停车红包已领取',
      icon: 'loading',
      duration: 1000
    })
  },

  advTap: function () {
    wx.showToast({
      title: '广告红包已领取',
      icon: 'loading',
      duration: 1000
    })
  },

  shareTap: function () {
    wx.showToast({
      title: '分享红包已领取',
      icon: 'loading',
      duration: 1000
    })
  },


  onShareAppMessage: function (e) {
    var that = this;
    if (e.from === 'menu') {
      // 来自页面内转发按钮
      console.log(e.target)
    }
    return {
      title: '广点点（广告接单平台）',
      path: '/pages/index/index?from=red_bag_index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }

})