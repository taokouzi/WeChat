//app.js
App({
  //自定义配置文件
  config:function(){

    var obj={
      
     /* 'request_url': 'https://gdd.51yyit.com/GDD/front_api/api/',  //请求接口url
      'pic_url': 'https://gdd.51yyit.com/GDD/backend/api/backend/',  //图片url（后台上传前端显示）
      'myPic_url': 'https://gdd.51yyit.com/GDD/front_api/api/',  //图片url（小程序上传）
    */

      
      'request_url': 'https://oneh5.com/thq/GDD/front_api/api/',  //请求接口url
      'pic_url': 'https://oneh5.com/thq/GDD/backend/api/backend/',  //图片url（后台上传前端显示）
      'myPic_url': 'https://oneh5.com/thq/GDD/front_api/api/',  //图片url（小程序上传）
      

      
     /* 'request_url': 'https://www.guangdiandian.cn/GDD/front_api/api/',  //请求接口url
      'pic_url': 'https://www.guangdiandian.cn/GDD/backend/api/backend/',  //图片url（后台上传前端显示）
      'myPic_url': 'https://www.guangdiandian.cn/GDD/front_api/api/',  //图片url（小程序上传）
      */
    };

    return obj;

  },
  //自定义配置文件 E N D

  againChangeSessionId: function (status )
  {
    var that = this;
    wx.login({
      success: function (data) 
      {
        console.log(data);
        if (data.code) 
        {
          if (status == 'login') 
          {
            //获取微信用户信息
            wx.getUserInfo({
              success: function (res) 
              {
                var userInfo = res.userInfo;
                that.requsetU(data.code, userInfo.nickName, userInfo.avatarUrl );
              },
              // 用户信息授权弹窗
              fail: function () 
              {
                console.log('获取微信用户信息失败，用户去授权');
                wx.showModal({
                  title: '请求授权用户信息',
                  content: '需要获取您的用户信息，请确认授权',
                  showCancel: false,
                  success: function (res) 
                  {
                    wx.openSetting({
                      success: function (dataAu) 
                      {
                        if (dataAu.authSetting["scope.userInfo"] == true) {
                          wx.showToast({
                            title: '授权成功',
                            icon: 'success',
                            duration: 1000
                          })
                          //再次授权，调用wx.getLocation的API
                          that.againChangeSessionId('login');
                        } 
                        else 
                        {
                          wx.showToast({
                            title: '授权失败',
                            icon: 'none',
                            duration: 1000
                          })
                        }
                      }
                    })
                  }
                })
              }
            });
          }
          else if (status == 'changeSessionId')
          { 
            console.log('9011处理');
            wx.getStorage({
              key: 'scan',
              success: function (res) 
              {
                var scan = res.data;
                that.requsetU(data.code, scan.nickName, scan.avatarUrl);
              }
            })
          }
        }
      },
      fail: function () {
        console.log('失败');
      }
    });
  },


  // 接口请求用户信息 置换sessionid
  requsetU: function(code, nickName, avatarUrl)
  {
    var that = this;
    wx.request({
      url: that.config().request_url + 'wx_mini_program.php?action=code2openid',
      data: {
        code: code,
        nickName:nickName,
        avatarUrl:avatarUrl
      },
      success: function (e) {
        console.log(e);
        if (e.data.code == 1) 
        {
          //存储session_id
          wx.setStorage({
            key: 'session_id',
            data: e.data.session_id,
            success: function (json) 
            {
              console.log('用户session_id : ' + e.data.session_id + ' 已存储');
              that.onShow();
            }
          })
          //存储session_id  E N D
        }
        else 
        {
          console.log('登录状态码 = ' + e.data.code);
        }
      }
    })
  },




  onLaunch: function () {
    // 
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    var that = this;
    //console.log(that.config().request_url);
    wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
        console.log('session 未过期2（处于登录状态）');
        wx.getStorage({
          key: 'session_id',
          success: function (rs) {
            console.log('SSSSSSSSS');
            console.log(rs);
            //console.log('appjs中取出的session_id = '+rs.data);
          },
          fail:function()
          {
            console.log('你妈');
            that.againChangeSessionId('login');
          }
        })
      },
      fail: function () 
      {
        wx.getUserInfo({
          success:function(resp)
          {
            console.log('session过期，已授权');
            // console.log(resp);

            wx.setStorage({
              key: 'scan',
              data: { 'nickName': JSON.parse(resp.rawData).nickName, 'avatarUrl': JSON.parse(resp.rawData).avatarUrl},
            })
            
            that.againChangeSessionId('changeSessionId');
            // console.log('啊啊啊啊啊啊啊啊啊啊');
          },
          fail:function(resp)
          {
            console.log('session过期，未授权');
            that.againChangeSessionId('login');
          }
        })
      }
    })
    


    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {

          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })

        }
      }
    })
  },
  globalData: {
    userInfo: null
  },

  
})

