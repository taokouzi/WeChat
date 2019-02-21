// pages/user/index.js

//引入图片预加载组件
const ImgLoader = require('../../img-loader/img-loader.js')

// 预加载loading图
const imgUrlThumbnail = './images/lazylod.png'

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: '',
    request_url: app.config().request_url,     //请求地址


    // 预加载
    imgUrlOriginal:'',
    imgUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 预加载
    this.imgLoader = new ImgLoader(this)
    var that = this;
    
    wx.showLoading({
      title: '加载中...',
    })

    var token = wx.getStorageSync('token');

    if (!token || token == null || token == undefined || token == '') {
      wx.redirectTo({
        url: '../login/index?from=app'
      })
      return false;
    }

    that.setData({
      token: token
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
    var that = this;
    
    that.showUserInfoFunc(that);
    
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


  // 默认显示用户信息
  showUserInfoFunc:function( that ){
    wx.request({
      url: that.data.request_url + 'userinfo.php?action=get_userinfo',
      data: {
        token: that.data.token,
      },
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res);
        const imgUrlOriginal = res.data.datas.car_img.replace('http','https');
        const headIcon = res.data.datas.head_icon.replace('http', 'https');
        console.log(imgUrlOriginal);
        if (res.data.code == 1) 
        {
          that.setData({
            user_datas: res.data.datas,
            headIcon: headIcon,
            imgUrlOriginal: imgUrlOriginal
          })
          that.loadImage();
        }
        else {
          console.log('默认用户信息显示错误');
        }

        // setTimeout(function () {
          wx.hideLoading();
        // }, 500)

      }
    })
  },

  // 预加载
  loadImage() {
    //加载缩略图
    this.setData({
      imgUrl: imgUrlThumbnail
    })

    var imgUrlOriginal = this.data.imgUrlOriginal;
    // console.log(imgUrlOriginal);

    //同时对原图进行预加载，加载成功后再替换
    this.imgLoader.load(imgUrlOriginal, (err, data) => {

      if (!err)
        this.setData({ imgUrl: data.src })
    })
  },


  //退出登录
  outLoginFunc:function(){
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: function (res) 
      {
        if (res.confirm) 
        {
          wx.removeStorageSync('token');
          wx.redirectTo({
            url: '../login/index?from=app'
          })
          
        } 
        else if (res.cancel) 
        {
          console.log('用户点击取消')
        }
      }
    })  
  },


  noEditFunc:function(){
    wx.showModal({
      title: '提示',
      content: '资料审核中，不能进行当前操作',
      showCancel: false,
      confirmText: '知道了',
      success: function (res) {

      }
    })
  },


  ////
  imageOnLoad(ev) {
 //   console.log(`图片加载成功，width: ${ev.detail.width}; height: ${ev.detail.height}`)
  },
  imageOnLoadError() {
 //   console.log('图片加载失败')
  }

})