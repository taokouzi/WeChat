import NumberAnimate from "NumberAnimate";
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hb_num:'',
    js_num:'',

    nickName: '加载中...',
    avatarUrl: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },



  hbNumAnim:function( )
  {
    var that = this;
    let hb_num = 6.0085;
    let n1 = new NumberAnimate({
      from: hb_num,//开始时的数字
      speed: 1500,// 总时间
      refreshTime: 100,//  刷新一次的时间
      decimals: 4,//小数点后的位数
      onUpdate: () => {//更新回调函数
        that.setData({
          hb_num: parseFloat(n1.tempValue).toFixed(4)
        });
      },
      onComplete: () => {//完成回调函数
        that.setData({

        });
      }
    });
  },


  jfNumAnim: function () {
    var that = this;
    let jf_num = 10086;
    let n2 = new NumberAnimate({
      from: jf_num,//开始时的数字
      speed: 1500,// 总时间
      refreshTime: 100,//  刷新一次的时间
      decimals: 0,//小数点后的位数
      onUpdate: () => {//更新回调函数
        that.setData({
          jf_num: parseFloat(n2.tempValue).toFixed(0)
        });
      },
      onComplete: () => {//完成回调函数
        that.setData({

        });
      }
    });
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () 
  {
    // this.hbNumAnim();
    // this.jfNumAnim();

    var userInfo = wx.getStorageSync('userInfo');
    
    if (!userInfo.nickName) {
      wx.switchTab({
        url: '../home/index'
      })
    }
    else
    {
      this.setData({
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl
      })
    }


    this.setData({
      hb_num:0.1415,
      jf_num:10086
    })

  },


  // 提现
  txFunc:function(e)
  {
    var that = this;
    console.log(e);
    var red_num = e.currentTarget.id;
    if ( red_num < 1 )
    {
      wx.showToast({
        title: '提现金额需大于1元',
        icon: 'none'
      })
    }
    else
    {
      wx.showLoading({title: '提现中...'})

      setTimeout(function(){
        wx.showToast({
          title: '提现成功！',
          icon: 'success'
        })

        that.info_num();

      },1500)
    }
    
  },



  // 信息回显
  info_num:function()
  {

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

  }
})