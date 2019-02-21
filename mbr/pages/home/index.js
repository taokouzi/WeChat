//index.js
//获取应用实例
const app = getApp()

// const wxParse = require("../wxParse/wxParse.js");

Page({
  data: {
    imgUrls: [
      'http://www.oneh5.com/thq/FLH/backend_api/api/./banner/kqz814.png',
      'http://www.oneh5.com/thq/FLH/backend_api/api/./banner/code810.png?v=1',
      'http://www.oneh5.com/thq/FLH/backend_api/api//banner/ert0601.png?v=5.31'
    ],
  },
  onLoad: function () {
    var that = this;

    // var tCenter = '<ul class="clear"><li><a style="position:relative;" class="" href="./mbr_intr.php" data-href=""><span style="" class=""></span><img style="width: 100%; height: 100%; display: inline-block;" data-original="http://www.oneh5.com/thq/FLH/backend_api/api/../images/upload/20180709/blockcard3.png" alt="" src="http://www.oneh5.com/thq/FLH/backend_api/api/../images/upload/20180709/blockcard3.png"><div class="modu_center clear"><p class="modu_text num1  none"></p><p class="modu_bbz num1  none"></p></div></a></li></ul>'; 


    // var c = wxParse.wxParse('tCenter', 'md', tCenter, that, 5);

    // console.log(tCenter);

    //   this.setData({
    //     center: tCenter
    //   })
  },
  
  zf:function()
  {
    wx.requestPayment(
      {
        'timeStamp': '1535533025',
        'nonceStr': '5K8264ILTKCH16CQ2502SI8ZNMTD98KL',
        'package': 'prepay_id=wx2018033010242291fcfe0db70013231072',
        'signType': 'MD5',
        'paySign': '6569ed5c352a99fe35bcfc9056b411e2',
        'success': function (res) {
          console.log(res);
         },
        'fail': function (res) { console.log(res);},
        'complete': function (res) { }
      })
  }


})
