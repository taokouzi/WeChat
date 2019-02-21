//app.js
App({
  data:{
    openid: '',  //opyVZ5P1EdYLsusHWbpX-crH5e-w
    
  },
  onLaunch: function () {
    var that = this;
    var openid = wx.getStorageSync('openid') || ''; 

    if (openid )
    {
      that.data.openid = openid;
    }
    else
    {
      // wx.login 获取code
      wx.login({
        success: res => {
          // console.log(res);
          if( res.code )
          {
            // code置换session_key、openid、unionId标识 （unionId仅限企业小程序）
            that.ajax(
              'wxLogin/wx.php', 
              { 'code': res.code},
              function(json)
              {
                // console.log(json);
                wx.setStorageSync('openid', json.data.openid);
                that.data.openid = json.data.openid;
              },
              function(){console.log('wx_code fail');})
          }
        }
      })
    }

  },
  
  
  
  ajax: function (path, data, success, fail)
  {
    wx.request({
      url: 'https://www.oneh5.com/Lite/res/' + path,
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