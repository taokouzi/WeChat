//app.js
App({
  data:{
    user_id: '',  //opyVZ5P1EdYLsusHWbpX-crH5e-w
    
  },
  onLaunch: function () {
    var that = this;


    var user = wx.getStorageSync('user') || {}; 
    var userInfo = wx.getStorageSync('userInfo') || {}; 

    // console.log(user);
    // console.log(userInfo);

    if (user )
    {
      this.data.user_id = user.openid;
    }


    if ( !user.openid || !userInfo.nickName ) 
    {
      // wx.login 获取code
      wx.login({
        success: res => {
          // console.log(res);
          if( res.code )
          {
            // code置换session_key、openid、unionId标识 （unionId仅限企业小程序）
            that.ajax('/wxLogin/wx.php', { 'code': res.code},res=>{
              // console.log(res);
              var obj={};
              obj.openid = res.data.openid;
              obj.session_key = res.data.session_key;

              that.data.user_id = res.data.openid;

              wx.setStorageSync('user', obj);

            },function(){console.log('wx_code fail');})
          }
          

        }
      })
    }

  },
  globalData: {
    userInfo: null
  },
  
  
  ajax: function (path, data, success, fail)
  {
    wx.request({
      url: 'https://oneh5.com/thq/zpll/thq/api/' + path,
      data: data,
      method: 'GET',
      scriptCharset: "utf-8",
      header: { 'content-type': 'json' },
      success: function (res) 
      {
        success(res)
      },
      fail: function (res) 
      {
        fail(res)
      },
    })
  }


})