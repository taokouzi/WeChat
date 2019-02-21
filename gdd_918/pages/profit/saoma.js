// pages/profit/saoma.js
var util = require('../../utils/util.js');
var app = getApp();
Page({

  data: {
    session_id:'',

    task_id:'',
    qrcode:'',

    active_id:'',

    code:'',
    openid:'',

    request_url: app.config().request_url,     //请求地址
  },

  onLoad: function (options) {

    wx.showLoading({
      title: '加载中',
    });

    var that = this;
    //console.log(options);
    //console.log('options.q = ' + options.q);

    if (options.q){

      var task_id, qrcode;

      //从小程序收益扫一扫进入
      if (options.q == 'profit' ){  
        task_id = options.task_id2;
        qrcode = options.qrcode2;

        console.log(options);

        that.setData({
          session_id:options.session_id2
        })

      }
      //从微信扫一扫进入
      else{   
        var saoma_url = unescape(options.q);
        task_id = saoma_url.split('?')[1].split('&')[0].split('=')[1];    //获取二维码task_id参数
        qrcode = saoma_url.split('?')[1].split('&')[1].split('=')[1];   //获取二维码qrcode参数
        //console.log('saoma_url = ' + saoma_url + ' ; task_id = ' + task_id + ' ; qrcode = ' + qrcode);
      }
      that.setData({
        task_id: task_id,
        qrcode: qrcode
      })
    }

    
    
    wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
        console.log('session 未过期（扫码）');
        that.jump();
      },
      fail: function () {

        //登录态过期
        wx.login({
          success: function (data) {

            if (data.code) {
    
              //获取微信用户信息
              wx.getUserInfo({
                success: function (res) {

                  var userInfo = res.userInfo;
                  var nickName = userInfo.nickName;
                  var avatarUrl = userInfo.avatarUrl;
                  var gender = userInfo.gender; //性别 0：未知、1：男、2：女
                  var province = userInfo.province;
                  var city = userInfo.city;
                  var country = userInfo.country;
                  
            
                  
                  //发起网络请求
                  wx.request({
                    url: that.data.request_url+'wx_mini_program.php?action=code2openid',
                    data: {
                      code: data.code,
                      nickName: userInfo.nickName,
                      avatarUrl: userInfo.avatarUrl
                    },
                    success: function (e) {
                      console.log(e);
                     
                      if (e.data.code == 1) {

                        //存储session_id
                        wx.setStorage({
                          key: 'session_id',
                          data: e.data.session_id,
                          success: function (json) {
                            console.log('用户session_id : ' + e.data.session_id + ' 已存储（扫码）');
                            that.jump();
                          }
                        })
                        
                        //存储session_id  E N D
                      }
                      else {
                       
                        console.log('登录状态码（扫码） = ' + e.data.code);
                      }
                    }
                    
                  })
                }
              });
              //获取微信用户信息 E N D
            }
            else {
              console.log('获取用户登录态失败！（扫码）' + res.errMsg);
            }

          }
        });
        //登录 E N D
      }
    })



  },

  jump: function (){

    var that = this;
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];    //获取当前页面的对象
    var url = currentPage.route;    //当前页面url
    var opss = currentPage.options;    //如果要获取url中所带的参数可以查看options

    that.setData({
      user_from: opss.from
    })

    console.log('opss.from = ' + opss.from);
    console.log('taskiddd = ' + that.data.task_id + ' ; qrcodeee = ' + that.data.qrcode);
    
    if (opss.from == 'profit_up') {

      console.log('小程序扫一扫(上刊)');
      
      wx.request({
        url: that.data.request_url + 'my.php?action=is_scan',
        data: {
          session_id: that.data.session_id,  
          task_id: that.data.task_id, 
          qrcode: that.data.qrcode, 
        },
        method: 'GET',
        header: { 'content-type': 'application/json' },
        success: function (res) {

          if( res.data.code == '1' ){

            wx.redirectTo({
              url: './saoma_top_list?task_id=' + that.data.task_id + '&qrcode=' + that.data.qrcode,
              success: function (e) {
                console.log('status=1; go to saoma_top_list.wxml');
              }
            });
          }
          else if ( res.data.code == '9004' ){
            
            wx.showToast({
              icon: 'loading',
              title: '二维码已失效',
              success: function () {
                wx.switchTab({
                  url: './index'
                })
              }
            })
          }
          else{
            console.log(res);
          }
        }
      })
      
    }
    else if (opss.from == 'profit_down') {

      console.log('小程序扫一扫(下刊)');
      wx.request({
        url: that.data.request_url + 'my.php?action=is_down_scan',
        data: {
          session_id: that.data.session_id,
          task_id: that.data.task_id,
          qrcode: that.data.qrcode,
        },
        method: 'GET',
        header: { 'content-type': 'application/json' },
        success: function (res) {
          if (res.data.code == '1') {
            wx.redirectTo({
              url: './saoma_down_list?task_id=' + that.data.task_id + '&qrcode=' + that.data.qrcode,
              success: function (e) {
                console.log('status=5; go to saoma_down_list.wxml');
              }
            });
          }
          else if (res.data.code == '9004') {

            wx.showToast({
              icon: 'loading',
              title: '二维码已失效',
              success: function () {
                wx.switchTab({
                  url: './index'
                })
              }
            })
          }
          else {
            console.log(res);
          }
        }
      })

    }
    else{
      
      //获取数据的session_id
      wx.getStorage({
        key: 'session_id',
        success: function (rs) {
          //console.log(rs);
          that.setData({
            session_id: rs.data
          })

          console.log('微信扫一扫；我上传的session_id = ' + rs.data + ' , task_id = ' + that.data.task_id + ' , qrcode = ' + that.data.qrcode);
          
          wx.request({
            url: that.data.request_url + 'my.php?action=guest_scan_transfer',
            data: {
              session_id: rs.data,  //用户session_id
              task_id: that.data.task_id,    //任务id
              qrcode: that.data.qrcode,    //二维码id
            },
            method: 'GET',
            header: { 'content-type': 'application/json' },
            success: function (res) {
              
              if (res.data.code == '1') {
                //上刊扫码
                if (res.data.status == '1') {
                  wx.redirectTo({
                    url: './saoma_top_list?task_id=' + that.data.task_id + '&qrcode=' + that.data.qrcode,
                    success: function (e) {
                      console.log('status=1; go to saoma_top_list.wxml');
                    }
                  });
                }
                //分享红包拍照
                else if (res.data.status == '2') {
                  wx.redirectTo({
                    url: './saoma_interaction?task_id=' + res.data.task_id + '&qrcode_status=2&active_id=' + res.data.active_id + '&session_id=' + rs.data,
                    success: function (e) {
                      console.log('status=2; go to saoma_interaction.wxml');
                    }
                  });
                }
                //分享红包
                else if (res.data.status == '3') {
                  wx.redirectTo({
                    url: './saoma_interaction_share?task_id=' + res.data.task_id + '&qrcode_status=3&active_id=' + res.data.active_id + '&session_id=' + rs.data,
                    success: function (e) {
                      console.log('status=3; go to saoma_interaction_share.wxml');
                    }
                  });
                }
                //任务详情
                else if (res.data.status == '4') {
                  wx.redirectTo({
                    url: '../index/task_details?id=' + res.data.task_id,
                    success: function (e) {
                      console.log('status=4; go to task_details.wxml');
                    }
                  });
                }
                //下刊扫码
                else if (res.data.status == '5') {
                  wx.redirectTo({
                    url: './saoma_down_list?task_id=' + res.data.task_id,
                    success: function (e) {
                      console.log('status=5; go to saoma_down_list.wxml');
                    }
                  });
                }
              }
              else {
                console.log(res);
              }
            }
            
          })
        },
        fail: function () {
          console.log('获取session_id失败（扫码）');
        }
      })

    }


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
  onShareAppMessage: function (e) {
    var that = this;
    if (e.from === 'menu') {
      // 来自页面内转发按钮
      console.log(e.target)
    }
    return {
      title: '广点点（广告接单平台）',
      path: '/pages/index/index?from=saoma',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
  
})