var app = getApp();
Page({

  data: {
   /* styles: [
      { name: '1', value: '网约车', checked: 'true' },
      { name: '0', value: '非网约车', }
    ],
    iconColor: "#008be6",*/
    carphoto45Src: "images/zp45.png",
    mileageSumSrc: "images/yb.png",
    orderSumSrc: "images/ddjtz.png",
    carPic: ' ',
    kmPic: ' ',
    ordPic: ' ',
    taskSrc: 'images/bg.png',
    showModalStatus: false,
    money_num: '',
    redHeight: '',

    session_id: '',
    task_id:'',


    qrcode:'',  //二维码id
    is_wang: true,   //是否是网约车

    request_url: app.config().request_url,     //请求地址
  },

  onLoad: function () {

    var that = this;


    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];    //获取当前页面的对象
    var url = currentPage.route;    //当前页面url
    var options = currentPage.options;    //如果要获取url中所带的参数可以查看options

    var that = this;

    that.setData({
      qrcode: options.qrcode,
    })


    //获取数据的session_id
    wx.getStorage({
      key: 'session_id',
      success: function (rs) {

        that.setData({
          session_id: rs.data
        })

        //  高度自适应
        wx.getSystemInfo({
          success: function (res) {
            var advWidth = res.windowWidth;
            that.setData({
              redHeight: 300 * 1.3264
            });
          }
        });

        var pages = getCurrentPages();
        var currentPage = pages[pages.length - 1];    //获取当前页面的对象
        var url = currentPage.route;    //当前页面url
        var options = currentPage.options;    //如果要获取url中所带的参数可以查看options

        that.setData({
          task_id: options.task_id
        })


        //判断是否是网约车
        wx.request({
          url: that.data.request_url+'profit.php?action=is_car_type',
          data: {
            session_id: rs.data,
          },
          method: 'GET',
          header: { 'content-type': 'application/json' },
          success: function (res) {
            //console.log(res);
            if (res.data.code == '1') {
              if (res.data.data.is_net_car == '1') {  //是网约车
                that.setData({
                  is_wang: true
                })
              }
              else {               //不是网约车
                that.setData({
                  is_wang: false
                })
              }
            }
            else {
              console.log(res);
            }

          }
        })
        //判断是否是网约车  E N D

      }
    })
    //获取数据的session_id  E N D
  },



  //侧后方45°车照
  carPhoto45Change: function () {
    var that = this
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认1
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {

        var tempFilePath = res.tempFilePaths;
        
        wx.uploadFile({
          url: that.data.request_url +'task.php?action=svae_pic',
          filePath: tempFilePath[0],
          name: "car_pic",
          formData: {
            session_id: that.data.session_id,
            active_type:5,    //5扫码上刊 6扫码下刊
            task_id: that.data.task_id,
          },
          success: function (res) {
            //console.log(res);
            if (JSON.parse(res.data).code == 1 ){
              that.setData({
                carPic: JSON.parse(res.data).data
              })
            }
            else{
              console.log(res);
            }
          }
        })

        that.setData({
          carphoto45Src: res.tempFilePaths
        })
      }
    })
  },

  //里程数
  mileageSumChange: function () {
    var that = this
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认1
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {

        var tempFilePath = res.tempFilePaths;
        wx.uploadFile({
          url: that.data.request_url +'task.php?action=svae_pic',
          filePath: tempFilePath[0],
          name: "km_pic",
          formData: {
            session_id: that.data.session_id,
            active_type: 5,    //5扫码上刊 6扫码下刊
            task_id: that.data.task_id,
          },
          success: function (res) {
            //console.log(res);
            if (JSON.parse(res.data).code == 1) {
              that.setData({
                kmPic: JSON.parse(res.data).data
              })
            }
            else{
              console.log(res);
            }
          }
        })

        that.setData({
          mileageSumSrc: res.tempFilePaths
        })
      }
    })
  },

  //订单数
  orderSumChange: function () {
    var that = this
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认1
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {

        var tempFilePath = res.tempFilePaths;
        wx.uploadFile({
          url: that.data.request_url +'task.php?action=svae_pic',
          filePath: tempFilePath[0],
          name: "order_pic",
          formData: {
            session_id: that.data.session_id,
            active_type: 5,    //5扫码上刊 6扫码下刊
            task_id: that.data.task_id,
          },
          success: function (res) {
            //console.log(res);
            if (JSON.parse(res.data).code == 1) {
              that.setData({
                ordPic: JSON.parse(res.data).data
              })
            }
            else{
              console.log(res);
            }
          }
        })

        that.setData({
          orderSumSrc: res.tempFilePaths
        })
      }
    })
  },




  //点击提交
  formSubmit: function (e) {

    var that = this;
    var list = e.detail.value;
   // console.log(e);

    //上传车照
    if (that.data.carPic == ' ') {
      wx.showToast({
        icon: 'loading',
        title: '请上传45°车照'
      });
      return false;
    }
    //里程数
    var km_reg = /^[0-9]+([.]{1}[0-9]{1,2})?$/;
    if (!km_reg.test(list.km)) {
      wx.showToast({
        icon: 'loading',
        title: '输入正确的里程数'
      });
      return false;
    }
    //上传里程照
    if (that.data.kmPic == ' ') {
      wx.showToast({
        icon: 'loading',
        title: '请上传里程照'
      });
      return false;
    }

    //当车主类型为网约车时 验证订单数
    if (that.data.is_wang ){
      
      //订单数
      var ord_reg = /^\d+$/;
      if (!ord_reg.test(list.ord)) {
        wx.showToast({
          icon: 'loading',
          title: '输入正确的订单数'
        });
        return false;
      }

      //上传订单照
      if (that.data.ordPic == ' ') {
        wx.showToast({
          icon: 'loading',
          title: '请上传订单照'
        });
        return false;
      }

    }
        
   // console.log('qrcode = ' + that.data.qrcode + ' ; ' + that.data.carPic + ' ; ' + that.data.ordPic + ' ; ' + that.data.kmPic);
    //上刊扫码提交
    wx.request({
      url: that.data.request_url +'task.php?action=up_scan',
      data: {
        session_id: that.data.session_id,  //用户session_id
        km_num: list.km,   //里程数
        ord_num: list.ord, //订单数
        car_pic:that.data.carPic,
        order_pic: that.data.ordPic,
        km_pic: that.data.kmPic,
        qrcode: that.data.qrcode       //二维码
      },
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
          //console.log(res);
          if( res.data.code == '1' ){
            wx.showToast({
              icon: 'success',
              title: '提交成功',
              success:function(){
                wx.switchTab({
                  url: './index',
                  success: function (e) {   //成功后跳转链接 并刷新链接
                    var page = getCurrentPages().pop();
                    if (page == undefined || page == null) return;
                    page.onLoad();
                  }
                });
              }
            });
            
          }
          else{
            console.log(res);
            wx.showToast({
              icon: 'loading',
              title: '系统异常'
            });
          }
      }
    })

  },
  //点击提交 E N D


  onShareAppMessage: function (e) {
    var that = this;
    if (e.from === 'menu') {
      // 来自页面内转发按钮
      console.log(e.target)
    }
    return {
      title: '广点点（广告接单平台）',
      path: '/pages/index/index?from=saoma_top_list',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }

})

