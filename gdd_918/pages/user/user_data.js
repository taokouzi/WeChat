var app = getApp();
Page({
  data: {
    img_arr: [],
    formdata: '',  
    userDatas:'',

    car_style:[
      { name: 'wang', value: '网约车', checked: 'true' },
      { name: 'wang_not', value: '非网约车', }
    ],
    iconColor:"#008be6",

    arrayStyle: ['微型车', '小型车','紧凑型车', '中型车', '中大型车','豪华型'],
    arrayColor:['白色','银色','灰色','黑色','红色','蓝色','棕灰色','其他'],
    indexBrand: 0,
    indexStyle: 1,
    indexColor: 2,
    xingshiSrc: "images/xsz.png",
    jiashiSrc: "images/jsz.png",
    
    buy_date: '选择购车年份',

    brands: ['请选择'],
    models: ['请选择'],
    brandindex: 0,
    brandindex2: 0,
    index1: 0,
    isJias: '',
    isXings: '',

    session_id:'',
    user_from:'',      //当前页面的来源  可能为个人中心跳转 可能为任务详情跳转 等
    task_id:'' ,
    tel:'',

    buy_car_end_year:'',  

    picImgUrl: app.config().myPic_url,

    request_url: app.config().request_url,     //请求地址
  },



  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    var pages = getCurrentPages(); 
    var currentPage = pages[pages.length - 1];    //获取当前页面的对象
    var url = currentPage.route;    //当前页面url
    var options = currentPage.options;    //如果要获取url中所带的参数可以查看options

    var that = this;
    
    that.setData({
      user_from: options.from,
      task_id: options.id
    })
   // that.data.user_from = options.from;
   // that.data.task_id = options.id;
    

   
    //动态设置购车最大时间
    that.setData({
      buy_car_end_year: that.buy_car_year().split(' ')[0]
    })


    //获取汽车品牌
    wx.request({
      url: that.data.request_url+'my.php?action=get_bran',
      data: {},
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        //console.log(res);
        var objectArray = res.data;
        var brands = ['请选择'];

        for (var i = 0; i < objectArray.length; i++) {
          brands.push(objectArray[i].brand_name, )
        }

        that.setData({
          brands: brands,

        })

      }
    })
    //获取汽车品牌 E N D



    //获取数据的session_id
    wx.getStorage({
      key: 'session_id',
      success: function (even) {

        that.setData({
          session_id: even.data
        })

        //console.log(options.id);
        //options.id=1 完善资料  =0 游客填写资料
       
        if (options.id == '1') {

          that.setData({
            isJias: that.data.isJias,
            isXings: that.data.isXings
          })


          wx.request({
            url: that.data.request_url + 'my.php?action=get_my_tel',
            data: {
              session_id: even.data
            },
            method: 'GET',
            header: { 'content-type': 'application/json' },
            success: function (res) {
              //console.log(res);
              if( res.data.code == '1' ){
                  that.setData({
                    tel: res.data.tel
                  })
              }
            }
          })



          //用户资料展示
          wx.request({
            url: that.data.request_url +'my.php?action=get_my_edit',
            data: {
              session_id: even.data
            },
            method: 'GET',
            header: { 'content-type': 'application/json' },
            success: function (res) {
              console.log(res);
              if( res.data.code == '1' ){
                that.setData({
                  userDatas: res.data.date,
                  brandindex: res.data.date.car_brand,
                  indexColor: res.data.date.car_color,
                  buy_date: res.data.date.car_date + ' 年',
                  jiashiSrc: that.data.picImgUrl + res.data.date.drive_pic,
                  xingshiSrc: that.data.picImgUrl + res.data.date.travel_pic,
                })

                //获得汽车型号
                wx.request({
                  url: that.data.request_url +'my.php?action=get_model',
                  data: { id: parseFloat(res.data.date.car_brand) },
                  method: 'GET',
                  header: { 'content-type': 'application/json' },
                  success: function (res2) {
                    //console.log(res2);
                    var modelArray = res2.data;
                    var models = [];
                    for (var j = 0; j < modelArray.length; j++) {
                      models.push(modelArray[j].car_model, )
                    }
                    that.setData({
                      models: models,
                      brandindex2: res.data.date.car_model
                    })
                  }
                })
                //获取汽车型号 E N D

                if (res.data.date.car_type == '2') {
                  that.setData({
                    car_style: [
                      { name: 'wang', value: '网约车', checked: 'true' },
                      { name: 'wang_not', value: '非网约车', }
                    ]
                  })
                }
                else {
                  that.setData({
                    car_style: [
                      { name: 'wang', value: '网约车' },
                      { name: 'wang_not', value: '非网约车', checked: 'true' }
                    ]
                  })
                }
              }
              else{
                cosnole.log(res);
              }
              wx.hideLoading();
            }
          })
          //用户资料展示 E N D
        }

      }
    })
    //获取数据的session_id    E N D

  },



  //汽车品牌
  bindPickerChange0: function (e) {

    var that = this;
    console.log(e.detail.value);
    this.setData({
      brandindex: e.detail.value,
      index1: 0
    })

    //获得汽车型号
    wx.request({
      url: that.data.request_url +'my.php?action=get_model',
      data: { id: parseFloat(e.detail.value) },
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res2) {
        //console.log(res2)
        var modelArray = res2.data;
        var models = [];

        for (var j = 0; j < modelArray.length; j++) {

          models.push(modelArray[j].car_model, )

        }

        that.setData({
          models: models
        })


      }
    })
    //获取汽车型号 E N D
  },

  //选择型号
  bindPickerChange1: function (e) {
    this.setData({
      brandindex2: e.detail.value
    })
  },

  //车型
  bindStyleChange: function (e) {
    this.setData({
      indexStyle: e.detail.value
    })
  },

  //颜色
  bindColorChange: function (e) {
    this.setData({
      indexColor: e.detail.value
    })
  },

  //购车年份 
  bindBuyCarDateChange: function (e) {
    this.setData({
      buy_date: e.detail.value+' 年'
    })
  },


  //驾驶证（上传）
  jiashiChange: function () {

    var that = this
    
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], //compressed
      sourceType: ['camera'],
      success: function (res) {
        wx.showLoading({
          title: '驾驶证上传中...',
        })
        var tempFilePath = res.tempFilePaths;
        //console.log(tempFilePath);
        wx.uploadFile({
          url: that.data.request_url +'my.php?action=upload_my', 
          filePath: tempFilePath[0],
          name: "drive_pic",
          formData: {
            session_id: that.data.session_id
          },
          success: function (res6) {
            
            //console.log(JSON.parse(res6.data).code);
            if (JSON.parse(res6.data).code == '1' ){
              that.setData({
                isJias: JSON.parse(res6.data).data,
              })
              //wx.hideLoading();
              wx.showToast({
                title: '驾驶证上传成功',
                icon: 'success',
                duration: 1000
              })
            }
            else{
              console.log(res6);
            }
          }
        })

        that.setData({
          jiashiSrc: res.tempFilePaths
        })
      }
    })
  },


  //行驶证（上传）
  xingshiChange: function () {

    var that = this;

    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认1
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        wx.showLoading({
          title: '行驶证上传中...',
        })
        var tempFilePath = res.tempFilePaths;
        //console.log(tempFilePath);
        wx.uploadFile({
          url: that.data.request_url +'my.php?action=upload_my',
          filePath: tempFilePath[0],
          name: "travel_pic",
          formData: {
            session_id: that.data.session_id
          },
          success: function (res6) {
            
           // console.log(res6);
            if( JSON.parse(res6.data).code == '1' ){
              that.setData({
                isXings: JSON.parse(res6.data).data,
              })
              //wx.hideLoading();
              wx.showToast({
                title: '行驶证上传成功',
                icon: 'success',
                duration: 1000
              })
            }
            else{
              console.log(res6);
            }
          }
        })

        that.setData({
          xingshiSrc: res.tempFilePaths
        })
      }
    })
  },
  
 
  // 点击提交表单
  formSubmit: function (e) {

    var that = this;

    var list = e.detail.value;
    console.log(list);
    
    //姓名验证
    var rename_reg = /^([\u4E00-\u9FFF]|\w){2,6}$/;
    if ( !rename_reg.test(list.rename) ){
        wx.showToast({
          icon: 'loading',
          title: '姓名仅支持中文'
        });
        return false;
    }
    //身份证验证
    var icCard_reg = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
    ///^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|(\d{3}[X|x]))$/;
    
    if ( !icCard_reg.test(list.idCard) ){
        wx.showToast({
          icon: 'loading',
          title: '身份证号码格式错误'
        });
        return false;
    }
    //汽车品牌
    if (that.data.brandindex == 0 ){
        wx.showToast({
          icon: 'loading',
          title: '请选择汽车'
        });
        return false;
    } 
    //购买时间
    if (that.data.buy_date == '选择购车年份'){
        wx.showToast({
          icon: 'loading',
          title: '请选择购买年份'
        });
        return false;
    }
    if (that.data.task_id != '1' ){
    //驾驶证
    console.log('驾驶证 = ' + that.data.isJias);
    if (that.data.isJias == '') {
      wx.showToast({
        icon: 'loading',
        title: '请上传驾驶证'
      });
      return false;
    }
    //行驶证
    if (that.data.isXings == '') {
      wx.showToast({
        icon: 'loading',
        title: '请上传行驶证'
      });
      return false;
    }
    }

    //车主类型转义存储
    var carType = '';
    if (list.carR_style == 'wang' ){
        carType = '2';
    }
    else{
        carType = '1';
    }

    wx.showToast({
      icon: 'loading',
      title: '提交申请中....'
    });

    console.log(that.data.isJias);
    console.log(that.data.isXings);

    wx.request({
      url: that.data.request_url +'my.php?action=save_my',
      data: {
        session_id: that.data.session_id,
        rename: list.rename,    //姓名
        id_num: list.idCard,    //身份证
        car_brand: list.car,  //车品牌 
        car_model: list.carModel,    //车型号
        car_color: list.color,  //车颜色
        car_date: list.year,    //购买年份
        car_type: carType,    //车主类型
        drive_pic: that.data.isJias,    //驾驶证
        travel_pic: that.data.isXings,    //行驶证
      },
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        //console.log(res);
    
        if( that.data.tel == '0' ){
          return false;
        }


        if( res.data.code == '1' ){
          wx.showToast({
            icon: 'success',
            title: '提交成功',
            success: function () {

              //console.log('user_from = ' +that.data.user_from);

              //任务详情（接任务）
              if (that.data.user_from == 'task_details') {
                wx.showModal({
                  title: '提示',
                  content: '资料认证已提交，等待审核中...',
                  showCancel: false,
                  confirmColor: '#008be6',
                  confirmText: '知道了',
                  success: function (res) {
                    wx.switchTab({
                      url: '../index/index',
                      success: function (e) {   //成功后跳转链接 并刷新链接
                        var page = getCurrentPages().pop();
                        if (page == undefined || page == null) return;
                        page.onLoad();
                      }
                    });
                  }
                })
                console.log('../index/top_reserve?id=' + that.data.task_id + '&session_id=' + that.data.session_id);
                /*wx.navigateTo({
                  url: '../index/top_reserve?id=' + that.data.task_id + '&session_id=' + that.data.session_id
                });*/
              }
              //收益页面
              else if (that.data.user_from == 'profit') {
                wx.showModal({
                  title: '提示',
                  content: '资料认证已提交，等待审核中...',
                  showCancel: false,
                  confirmColor: '#008be6',
                  confirmText: '知道了',
                  success: function (res) {
                    wx.switchTab({
                      url: '../index/index',
                      success: function (e) {   //成功后跳转链接 并刷新链接
                        var page = getCurrentPages().pop();
                        if (page == undefined || page == null) return;
                        page.onLoad();
                      }
                    });
                  }
                })
              }
              //个人中心
              else if (that.data.user_from == 'user_center') {
                wx.switchTab({
                  url: './index',
                  success: function (e) {   //成功后跳转链接 并刷新链接
                    var page = getCurrentPages().pop();
                    if (page == undefined || page == null) return;
                    page.onLoad();
                  }
                });
              }


            }
          });
        }
        else{
          console.log(res);
        }
      }
    });


  },

  //购车最新年份
  buy_car_year: function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
      + " " + date.getHours() + seperator2 + date.getMinutes()
      + seperator2 + date.getSeconds();
    return currentdate;
  },






  onShareAppMessage: function (e) {
    var that = this;
    if (e.from === 'menu') {
      // 来自页面内转发按钮
      console.log(e.target)
    }
    return {
      title: '广点点（广告接单平台）',
      path: '/pages/index/index?from=user_data',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },




  //授权获取手机号
  getPhoneNumber: function (e) {
    var that = this;
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      console.log('拒绝授权');
      wx.showModal({
        title: '提示',
        showCancel: false,
        confirmColor: '#008be6',
        confirmText: '知道了',
        content: '拒绝授权手机号，审核通过后不能够收到短信通知哦',
        success: function (res) {
          if (that.data.user_from == 'task_details' || that.data.user_from == 'profit') {
            wx.switchTab({
              url: '../index/index',
              success: function (e) {   //成功后跳转链接 并刷新链接
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad();
              }
            });
          }
          
          //个人中心
          else if (that.data.user_from == 'user_center') {
            wx.switchTab({
              url: './index',
              success: function (e) {   //成功后跳转链接 并刷新链接
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad();
              }
            });
          }
         
        }
      })
    }
    else {
      console.log('同意授权');
      wx.request({
        url: that.data.request_url + 'getuserinfo.php',
        data: {
          session_id: that.data.session_id,
          iv: e.detail.iv,
          encryptedData: e.detail.encryptedData
        },
        method: 'GET',
        header: { 'content-type': 'application/json' },
        success: function (res) {
          if (that.data.user_from == 'task_details' || that.data.user_from == 'profit') {
            wx.switchTab({
              url: '../index/index',
              success: function (e) {   //成功后跳转链接 并刷新链接
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad();
              }
            });
          }
          //个人中心
          else if (that.data.user_from == 'user_center') {
            wx.switchTab({
              url: './index',
              success: function (e) {   //成功后跳转链接 并刷新链接
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad();
              }
            });
          }
        }
      })
    }
  },
  //授权获取手机号 E N D

  
});
