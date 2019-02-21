var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wname: '',
    tel: '',
    
    region: ['选择省份', '选择城市', '选择区县'],
    addr: '',
    // customItem: '全部'
  },
  back: function () {
    wx.switchTab({
      url: '/pages/self/index',
      success: function () { }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) 
  {
    this.setData({
      wname: this.data.wname,
      tel: this.data.tel,
      region: this.data.region,
      addr: this.data.addr,
    })

    this.add_list();
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


  add_list:function()
  {
    wx.showLoading({
      title: '加载中...',
    })
    let that = this;
    app.ajax('addr.php', { action: 'addr_list', user_id: app.data.user_id }, res=>{
      console.log(res);
      if (res.data.code == 1 && res.data.addr.userName )
      {
        that.setData({
          wname: res.data.addr.userName,
          tel: res.data.addr.telNumber,
          region: [res.data.addr.provinceName, res.data.addr.cityName, res.data.addr.countyName],
          addr: res.data.addr.detailInfo
        })
      }
      wx.hideLoading();
    },function(){console.log('addr_list fail');})
  },















  formSubmit:function(e)
  {
    var username = /^[\u4E00-\u9FA5A-Za-z]+$/;
    var usertel = /^0?1[3|4|5|6|7|8|9][0-9]\d{8}$/;

    // 姓名效验
    if (!username.test(e.detail.value.wname ))
    {
      wx.showToast({
        title: '姓名限制输入中文和英文',
        icon: 'none'
      })
      return;
    }

    // 手机号效验
    if (!usertel.test(e.detail.value.tel)) 
    {
      wx.showToast({
        title: '手机号错误',
        icon: 'none'
      })
      return;
    }
    
    if (!e.detail.value.wname || !e.detail.value.tel || !e.detail.value.addr || e.detail.value.ssx[0] == '选择省份' )
    {
        wx.showToast({
          title: '信息填写不完整',
          icon: 'none'
        })
        return;
    }



    wx.showLoading({ title: '保存中..' });



    app.ajax('addr.php', { 
        action: 'addr_edit', 
        user_id: app.data.user_id, 
        userName: e.detail.value.wname,
        telNumber: e.detail.value.tel,
        provinceName: e.detail.value.ssx[0],
        cityName: e.detail.value.ssx[1],
        countyName: e.detail.value.ssx[2],
        detailInfo: e.detail.value.addr
    }, res => {
      console.log(res);
      var icon;
      if( res.data.code == 1 )
      {
        icon = 'success'
      }
      else
      {
        icon = 'none'
      }
      wx.showToast({
        title: res.data.msg,
        icon: icon
      })
    }, function () { console.log('addr_edit fail'); })



    // setTimeout(function(){
    // wx.showToast({
    //   title: '保存成功！',
    //   icon: 'success'
    // })
    // }, 2000)


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  wxAddr: function () {
    var that = this;
    //先获取用户当前的设置
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.address']) {
          wx.authorize({
            scope: 'scope.address',
            success(res) {
              console.log(res.errMsg);//用户授权后执行方法
              that.chooseAddress();
            },
            fail(res) {
              //用户拒绝授权后执行
              wx.openSetting({})
            }
          })
        }
        else {
          that.chooseAddress();
        }
      }
    })
  },

  chooseAddress: function () 
  {
    var that = this;
    wx.chooseAddress({
      success: function (res) 
      {
        that.setData({
          wname : res.userName,
          tel : res.telNumber,
          region: [res.provinceName, res.cityName, res.countyName],
          addr : res.detailInfo
        })
      }
    })
  },










  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  }























})