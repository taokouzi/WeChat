// pages/edit_phone/index.js
var app =getApp();
Page({
  data: {
    verifyCodeTime:'获取验证码',
    header_id:'',

    session_id:'',
    mobile:'',

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
      }
    })
    //获取数据的session_id  E N D


    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];    //获取当前页面的对象
    var url = currentPage.route;    //当前页面url
    var options = currentPage.options;    //如果要获取url中所带的参数可以查看options

    that.setData({
      mobile:options['tel']
    })



  },



  //手机号码输入
  mobileInputEvent: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },



  //验证码倒计时
  verifyCodeEvent: function (e) {
    //console.log(e);
    var that = this;
    var mobile = that.data.mobile;
    console.log(mobile);
    //手机号码正则匹配
    var reg_tel = /^1\d{10}$/;
    if (!reg_tel.test(mobile)) {
      wx.showToast({
        icon: 'loading',
        title: '手机号有误！',
        duration:1000
      });
      return false;   
    }
    else{

      //我的
      wx.request({
        url: that.data.request_url+'my.php?action=tel',
        data: {
          session_id: that.data.session_id,
          tel: mobile
        },
        method: 'GET',
        header: { 'content-type': 'application/json' },
        success: function (res) {

          if( res.data.code == '1' ){
            that.data.header_id = res.header['Set-Cookie'].split(';')[0];
          }
          else{
            console.log(res);
          }

        }
      })
    //我的 E N D

    }


    if (this.data.buttonDisable){ 
      return false 
    };

    var that = this;
    var c = 60;

    var intervalId = setInterval(function () {
      c--;
      that.setData({
        verifyCodeTime: c + 's后重发',
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

    
    //app.sendVerifyCode(function () { }, mobile);//获取短信验证码接口
  },


  //提交修改手机号码(验证码验证)
  formSubmit: function (e) {

    /*wx.showToast({
      icon: 'loading',
      title: '提交申请中....'
    });*/

    var that = this;
    var list = e.detail.value;
    console.log(list.code);

    wx.request({
      url: that.data.request_url +'my.php?action=validate_code',
      data: {
        session_id: that.data.session_id,
        tel: list.tel,
        code: list.code
        },
      method: 'GET',
      header: { 'content-type': 'application/json', 'Cookie': that.data.header_id },
      success: function (res) {
        console.log(res);
        if( res.data.code == 1 ){
            wx.showToast({
              icon: 'success',
              title: '成功！'
            });
            wx.switchTab({
              url: './index',
              success: function (e) {   //成功后跳转链接 并刷新链接
                var page = getCurrentPages().pop();
                console.log(page);
                if (page == undefined || page == null) return;
                page.onLoad();
              }
            });
        }
        else{
            wx.showToast({
              icon: 'loading',
              title: '提交失败'
            });
        }

      }
    })


  },
  //提交修改手机号码 E N D




  onShareAppMessage: function (e) {
    var that = this;
    if (e.from === 'menu') {
      // 来自页面内转发按钮
      console.log(e.target)
    }
    return {
      title: '广点点（广告接单平台）',
      path: '/pages/index/index?from=edit_phone',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }

})