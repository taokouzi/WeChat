//app.js
App({
  globalData:{
    userInfo:null,
    imgDir: 'http://hongbao.h5h5h5.cn/BizHall/redApp/images/',
    openPage: 1
  },
  onLaunch: function () {
    var that = this;
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    that.getUserInfo();
    //判断是否展示开屏页
    wx.request({
      url: 'https://hongbao.h5h5h5.cn/CrmServiceWeb/service/actiSoService/getSysCfg',
      data: {'keys':'test1'},
      method: 'GET', 
      dataType: 'json',
      success: function(res){
        if(res.resultCode==0){
          that.globalData.openPage = res.result[0]['test1'];
        }
      }
    })
  },
  getUserInfo:function(cb){
    var that = this;
    if(that.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo);
    }else{
      //获取用户信息
      wx.getUserInfo({
        success: function (res) {
          that.globalData.userInfo = res.userInfo;
          typeof cb == "function" && cb(that.globalData.userInfo);
        }
      })
    }
  },
  updateUserInfo: function(updateData){
    var that = this;
    var data = {
      'jscode': '',
      'type': updateData.type?updateData.type:0,
      'action': 1,
      'nickName': that.globalData.userInfo.nickName,
      'portrait': that.globalData.userInfo.avatarUrl
    }
    if(updateData.phone){
      data['mobile'] = updateData.phone;
    }
    wx.login({
      success: function (res) {
        if (res.code) {
          data.jscode = res.code;
          wx.request({
            url: 'https://hongbao.h5h5h5.cn/CrmServiceWeb/service/actiSoService/updateWxUserInfo',
            data: data,
            method: 'POST'
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg);
        }
      }
    })
  }
})