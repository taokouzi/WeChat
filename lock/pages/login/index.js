// pages/login/index.js
var app = getApp()
Page({
  data: {

    request_url: app.config().request_url,     //请求地址

    verifyCodeTime: '获取验证码',
    tel: '',

    is_wait_end:0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;

    var wait_time = 0;

    if (options.from == 'app' )
    { 
      wait_time = 210;
    }

    setTimeout(function () {
      that.setData({
        is_wait_end: 1
      })
    }, wait_time)

    wx.hideLoading();

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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
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
  onShareAppMessage: function () {
  
  },

  //手机号码输入
  mobileInputEvent: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },





  //获取验证码
  getCodeFunc:function(){
    var that = this;
    var tel = that.data.tel;

    //手机号码正则匹配
    var reg_tel = /^1\d{10}$/;

    if (!reg_tel.test(tel)) 
    {
      wx.showToast({
        icon: 'none',
        title: '手机号有误',
        duration: 1000
      });
      return false;
    }
    else 
    {
      wx.request({
        url: that.data.request_url + 'code.php?action=get_code',
        data: {
          mobilphone: tel
        },
        method: 'GET',
        header: { 'content-type': 'application/json' },
        success: function (res) {
          // console.log(res);
          if( res.data.code == 1 )
          {

            wx.showToast({
              icon: 'success',
              title: '验证码已发送',
              duration: 1000
            });

            that.daoJiShiFunc();
          }
          else if (res.data.code == 9002 )
          {
            wx.showToast({
              icon: 'none',
              title: '已发过短信了',
              duration: 1000
            });
          }
          else
          {
            wx.showToast({
              icon: 'none',
              title: res.data.msg,
              duration: 1000
            });
          }
        }
      })

    }

  },






  //倒计时
  daoJiShiFunc:function(){

    if (this.data.buttonDisable) {
      return false
    };

    var that = this;
    var c = 60;

    var intervalId = setInterval(function () {
      c--;
      that.setData({
        verifyCodeTime: '已发送（' + c + 's）',
        buttonDisable: true
      })
      if (c == 0) {
        clearInterval(intervalId);
        that.setData({
          verifyCodeTime: '获取验证码',
          buttonDisable: false
        })
      }
    }, 1000);
  },









  //提交
  formSubmit:function(e){

    var that = this;

    console.log(e);
    //电话号码
    var tel = e.detail.value.idTel;

    //验证码
    var code = e.detail.value.code;

    var reg_tel = /^1\d{10}$/;
    if (!reg_tel.test(tel)) 
    {
      wx.showToast({
        icon: 'none',
        title: '手机号有误',
        duration: 1000
      });
      return false;
    }

    var reg_code = /^\d{6}$/;
    if (!reg_code.test(code)) {
      wx.showToast({
        icon: 'none',
        title: '验证码错误',
        duration: 1000
      });
      return false;
    }







    //登录接口
    wx.request({
      url: that.data.request_url + 'user.php?action=login_mp',
      data: {
        mobilphone: tel,
        yzm: code
      },
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
         console.log(res);
        if( res.data.code == 1 )
        {
          console.log('存储登录的token = ' + res.data.token);

          wx.setStorageSync('token', res.data.token);
          wx.setStorageSync('tel', tel);
          console.log('登录成功！！');
          wx.redirectTo({
            url: '../index/index'
          })
        }
        else if (res.data.code == 9001 )
        {
          wx.showToast({
            icon: 'none',
            title: '验证码错误'
          });
        }
        else
        {
          wx.showToast({
            icon: 'none',
            title: res.data.msg
          });
        }
      }
    })


    
    

  }

})