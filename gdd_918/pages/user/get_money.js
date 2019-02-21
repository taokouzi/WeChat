// pages/get_money/index.js
var app = getApp();
Page({

  data: {
      val:'',
      inputClass:'',

      frozen_red:'',  //冻结
      amount:'',  //可提现
      is_show_btn: '',

      session_id:'',
      is_tixian_show:'1',

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


        //我的 
        wx.request({
          url: that.data.request_url+'my.php?action=get_my',
          data: {
            session_id: res.data
          },
          method: 'GET',
          header: { 'content-type': 'application/json' },
          success: function (res) {
            
            if (res.data.data.amount <= 0 ){
              that.setData({
                is_tixian_show:'0'
              })
            }

            if( res.data.code == '1' ){
              that.setData({
                amount: res.data.data.amount,
                frozen_red: res.data.data.frozen_red
              })
            }
            else{
              console.log(res);
            }

          }
        })
    //我的 E N D


      }
    })
    //获取数据的session_id  E N D

  },



  //点击输入框
  bindTabTap:function(e){
    
      var that = this;

      that.setData({
        val: e.detail.value
      });

      var input_val = e.detail.value;

      wx.request({
        url: that.data.request_url +'my.php?action=get_my',
        data: {
          session_id: that.data.session_id
        },
        method: 'GET',
        header: { 'content-type': 'application/json' },
        success: function (res) {
          
          if (input_val.length > 0 ) {
            var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;

            // 输入的值不大于可提现的值 且 输入的值不小于0 则显示按钮
            if ( parseFloat(e.detail.value) <= parseFloat(res.data.data.amount) && parseFloat(e.detail.value) > 0 && reg.test(parseFloat(e.detail.value)) ){
              that.setData({
                inputClass: 'active',
                is_show_btn: '1'
              });
            }
            //否则 按钮禁用
            else{
              that.setData({
                inputClass: 'active',
                is_show_btn: '0'
              });
            }
            
          }
          else {
            that.setData({
              inputClass: '',
              is_show_btn: '0'
            });
          }
          

        }
      })


      
  },
  //点击输入框 E N D
  


  //全部提现
  totalMoney:function(e){

    var that = this;
    
    //我的 
    wx.request({
      url: that.data.request_url +'my.php?action=get_my',
      data: {
        session_id: that.data.session_id
      },
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        
        if (res.data.code == '1' ){
          that.setData({
            val: res.data.data.amount,
            inputClass: 'active',
            is_show_btn: '1',
          })
        }
        else{
          console.log(res);
        }

      }
    })
    //我的 E N D
  

  },
  //全部提现 E N D





  //申请提现（确认提现）
  get_money:function(e){
    var that = this;
    
  },
  //申请提现（确认提现） E N D


  // 点击提交表单  
  formSubmit: function (e) {

    var that = this;
/*
    wx.showToast({
      icon: 'loading',
      title: '提交申请中....'
    });

    var that = this;
    var list = e.detail.value;

    var money_reg = /^d*(?:.d{0,2})?$/;

    if ( !money_reg.test(list.money) ) {
      wx.showToast({
        icon: 'loading',
        title: '身份证格式错误'
      })
      return false;
    }
    */
    
    if (that.data.val <= 0 ){
      that.setData({
        is_show_btn: '0'
      });
    }
    wx.request({
      url: that.data.request_url +'profit.php?action=apply_cash',
      data: {
        session_id: that.data.session_id,
        money: that.data.val
      },
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        
        if (res.data.code == '1') {

          wx.showToast({
            icon: 'success',
            title: '成功',
            success: function () {
              wx.switchTab({
                 url: './index'
               });
            }
          });

        }
        else{
          console.log(res);
            wx.showToast({
              icon: 'loading',
              title: '提现失败',
            });
        }
      }
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
      path: '/pages/index/index?from=get_money',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }










})