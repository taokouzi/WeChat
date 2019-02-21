// pages/fault/index.js
var app = getApp()

Page({
  data: {
    token: '',
    request_url: app.config().request_url,     //请求地址
    types: ['网络连接失败', '蓝牙连接失败', '硬件损坏', '其他'],
    type_i: 0,

    car_id:'',
    lock_id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    
    var token = wx.getStorageSync('token');

    if (!token || token == null || token == undefined || token == '') {
      wx.redirectTo({
        url: '../login/index?from=app'
      })
      return false;
    }

    var car_id = options.car_id;
    var lock_id = options.lock_id;

    that.setData({
      token: token,
      car_id: car_id,
      lock_id: lock_id
    })

    // var a = that.getUrlCanFunc();
    console.log(options);
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




  // // 故障类型选择
  faultTypeChangeFunc:function(e){
    this.setData({
      type_i: e.detail.value
    })
  },




  //提交
  submitFaultInfoFunc:function(e){
    console.log(e);
    var that = this;

    //车位编号
    var car_id = that.data.car_id;  

    //地锁编号
    var lock_id = that.data.lock_id;

    //故障类型
    var fault_type = that.data.types[e.detail.value.fault_type];

    //故障说明
    var fault_text = e.detail.value.fault_text;


    wx.showLoading({
      title: '提交中...',
    })
    

    if (fault_text.length < 1 )
    {
      wx.showToast({
        title: '请填写故障情况说明',
        icon: 'none'
      })
      return false;
    }


    

    wx.request({
      url: that.data.request_url + 'report.php?action=submit',
      data: {
        token: that.data.token,
        lock_no: lock_id,
        type_id: fault_type,
        desc: fault_text
      },
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        
        if( res.data.code == 1 )
        {
          wx.showToast({
            title: '提交成功',
            icon: 'success'
          })

          setTimeout(function () {
            wx.navigateTo({
              url: '../index/index'
            })
          }, 1000)

        }
        else if (res.data.code == 9002 )
        {
          wx.showToast({
            title: '已经上报过了',
            icon: 'success'
          })

          setTimeout(function(){
            wx.navigateTo({
              url: '../index/index'
            })
          },1000)
          
        }
        else
        {
          console.log(res);
        }
      }
    })




  },




  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})