// pages/login/index.js

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSend:false,
    isLogin:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.redirectTo({
    //   url: '../login/index',
    // })
    this.setData({
      text:'获取验证码'
    })
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

  getPhoneNumber:function(e){
    console.log(e);
  },
  formSubmit:function(e){
    console.log(e);
    let that = this;
    let tel = e.detail.value.tel;
    let telReg = /^0?1[3|4|5|6|7|8|9][0-9]\d{8}$/;

    let code = e.detail.value.code;
    let codeReg = /^\d{6}$/;

    let ltype = e.detail.target.dataset.id;

    if (!that.data.isSend || !that.data.isLogin )
    {
    if ( !telReg.test(tel)) {
      wx.showToast({
        icon: 'none',
        title: '手机号错误'
      });
    }
    else 
    {
      // 获取验证码
      if (ltype == 'code' && !that.data.isSend )
      {
        that.data.isSend = true;
        app.ajax(
          'sign.php', 
          {
            'action': 'get_code',
            'tel': tel
          }, 
          function (res) {
             console.log(res) 
            if( res.data.code == 9000 )
            {
              wx.showToast({
                icon: 'success',
                title: '已发送'
              });

              var times = 60;
              var intervalId = setInterval(function () {
                times--;

                that.setData({
                  text: '已发送（' + times + 's）'
                })

                if (times <= 0) {
                  clearInterval(intervalId);
                  that.setData({
                    text: '获取验证码'
                  })
                  that.data.isSend = false;
                }

                console.log(that.data.isSend);
              }, 1000);
              
            }
          }, 
          function (res) { 
            console.log(res) 
            that.data.isSend = false;
          }
        )
      }
      // 登录
      else if (ltype == 'login' && !that.data.isLogin )
      {
        if (!codeReg.test(code)) {
          wx.showToast({
            icon: 'none',
            title: '验证码格式错误'
          });
        }
        else
        {
          that.data.isLogin = true;
          app.ajax(
            'sign.php',
            {
              'action': 'validata_code',
              'tel': tel,
              'code':code
            },
            function (res) {
              console.log(res)
              if( res.data.code == 9000 )
              {
                wx.showToast({
                  icon: 'success',
                  title: '登录成功，页面跳转中...'
                });
              }
            },
            function(res){
              console.log(res)
            }
          )
        }
      }
    }
    }
  }
})