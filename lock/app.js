//app.js
App({


  //自定义配置文件
  config:function(){

    var that = this;
    
    var obj={

      //token
      // 'token': wx.getStorageSync('token_t3'),
      
      //请求接口url
      'request_url': 'https://oneh5.com/thq/LOCK/backend_api/api/',
    };

    return obj;

  },

  //自定义配置文件 E N D
  onLaunch: function ( options )
  {
    var that = this;

    //取本地存储的token
    var token = wx.getStorageSync('token');
    console.log('token = ' + token);

    //如果没有token值，则跳转到去登录
    if (!token || token == null || token == undefined || token == '') {
      wx.redirectTo({
        url: '../pages/login/index?from=app'
      })
    }

  },
  globalData: {
    userInfo: null
  },

  
  
})

