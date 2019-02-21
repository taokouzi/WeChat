// pages/red_bag_camera/index.js
var app = getApp();
Page({

  data: {
    carphoto45Src: "images/zp45.png",
    mileageSumSrc: "images/yb.png",
    orderSumSrc: "images/ddjtz.png",
    carPic: ' ',
    kmPic: ' ',
    ordPic: ' ',

    showModalStatus: false,
    money_num: '',
    redHeight: '',
    red_over: false,

    session_id: '',
    taskId: '',
    activeId: '',
    memberId:'',
    is_wang: true,   //是否是网约车

    request_url: app.config().request_url,     //请求地址
  },

  
  onShow: function (options) {

    var that = this;

    //URL传参
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];    //获取当前页面的对象
    var url = currentPage.route;    //当前页面url
    var ops = currentPage.options;    //如果要获取url中所带的参数可以查看options
    //console.log(ops);
    that.setData({
      taskId: ops.taskId,  //任务id
      activeId: ops.activeId,
      memberId: ops.memberId
    }); 


    //获取数据的session_id
    wx.getStorage({
      key: 'session_id',
      success: function (rs) {

        that.setData({
          session_id: rs.data
        })

        //判断是否是网约车
        wx.request({
          url: that.data.request_url + 'profit.php?action=is_car_type',
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


    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var advWidth = res.windowWidth;
        that.setData({
          redHeight: 300 * 1.3264
        });
      }
    });

  },

//侧后方45°车照
  carPhoto45Change: function () {
    var that = this
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认1
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        //console.log(res);
        //console.log(that.data.taskId + ',' + that.data.activeId + ',' + that.data.memberId);
        var tempFilePath = res.tempFilePaths;
        wx.uploadFile({
          url: that.data.request_url+'profit.php?action=upload_photo',
          filePath: tempFilePath[0],
          name: "car_pic",
          formData: {
            task_id: that.data.taskId,
            active_id: that.data.activeId,
            member_id: that.data.memberId,
          },
          success: function (res) {
            that.setData({
              carPic: JSON.parse(res.data).data
            })
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
        //console.log(that.data.taskId + ',' + that.data.activeId + ',' + that.data.memberId);
        var tempFilePath = res.tempFilePaths;
        wx.uploadFile({
          url: that.data.request_url +'profit.php?action=upload_photo',
          filePath: tempFilePath[0],
          name: "km_pic",
          formData: {
            task_id: that.data.taskId,
            active_id: that.data.activeId,
            member_id: that.data.memberId,
          },
          success: function (res) {
              that.setData({
                kmPic: JSON.parse(res.data).data
              })
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
        //console.log(that.data.taskId + ',' + that.data.activeId + ',' + that.data.memberId);
        var tempFilePath = res.tempFilePaths;
        wx.uploadFile({
          url: that.data.request_url +'profit.php?action=upload_photo',
          filePath: tempFilePath[0],
          name: "order_pic",
          formData: {
            task_id: that.data.taskId,
            active_id: that.data.activeId,
            member_id: that.data.memberId,
          },
          success: function (res) {
            that.setData({
              ordPic: JSON.parse(res.data).data
            })
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


    //上传车照
    if( that.data.carPic == ' ' ){
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
    
    //订单数
    if (that.data.is_wang) {

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
    
    
    //console.log(that.data.taskId + ',' + that.data.activeId + ',' + that.data.memberId + ',' + that.data.session_id + ',' + list.km + ',' + list.ord);
    //console.log('car_pic = ' + that.data.carPic + ' ; km_pic = ' + that.data.kmPic + ' ; order_pic = ' + that.data.ordPic);
    wx.request({
      url: that.data.request_url +'profit.php?action=photo',
      data: {
        session_id: that.data.session_id,  //用户session_id
        task_id: that.data.taskId,
        active_id: that.data.activeId,
        member_id: that.data.memberId,
        km_num : list.km,   //里程数
        order_num : list.ord, //订单数
        car_pic: that.data.carPic,    //车身照图片路径
        km_pic: that.data.kmPic,    //里程照图片路径
        order_pic: that.data.ordPic   //订单照图片路径
      },
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        
        if( res.data.code == '1' ){
          //获得随机红包
          wx.request({
            url: that.data.request_url +'profit.php?action=get_frozen_red',
            data: {
              session_id: that.data.session_id,  //用户session_id
              active_id: that.data.activeId,     //红包活动id
            },
            method: 'GET',
            header: { 'content-type': 'application/json' },
            success: function (res) {

              if (res.data.code == '1' || res.data.code == '11') {
                if (res.data.code == '11') {

                  that.setData({
                    money_num: '红包已被领完~',
                    red_over: true
                  })

                  wx.request({
                    url: that.data.request_url + 'profit.php?action=pai_no_red',
                    data: {
                      session_id: that.data.session_id,  //用户session_id
                      task_id: that.data.taskId,     //红包活动id
                    },
                    method: 'GET',
                    header: { 'content-type': 'application/json' },
                    success: function (res) {
                        //console.log(res);
                        if( res.data.code == '1' ){
                          console.log('好');
                        }
                    }
                  });

                }
                else {
                  that.setData({
                    money_num:res.data.data.red_num,
                    red_over: false
                  })
                }


                if (!that.data.red_over) {
                  //领取红包
                  wx.request({
                    url: that.data.request_url + 'profit.php?action=frozen_red',
                    data: {
                      session_id: that.data.session_id,  //用户session_id
                      active_id: that.data.activeId,    //执行id
                      task_id: that.data.taskId,
                      red_num: that.data.money_num,   //红包金额
                    },
                    method: 'GET',
                    header: { 'content-type': 'application/json' },
                    success: function (res) {
                      console.log(res);

                    }
                  })
                  //领取红包 E N D
                }
                var currentStatu = e.detail.target.dataset.statu;
                that.util(currentStatu);
              }
              else{
                console.log(res);
              }
              
            }
          })
        //获得随机红包 E N D
        }
        else{
          console.log(res);
        }
        

      }
    })

  },
  //点击提交 E N D



  //点击‘好’
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu);
    
    var that = this;


    wx.navigateBack({
      url: './index'
    })
    //console.log(that.data.session_id + ',' + that.data.activeId + ',' + that.data.taskId + ',' + that.data.money_num);
    
    
  },

  //显示红包
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 100, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });
    // 第2步：这个动画实例赋给当前的动画实例 
    this.animation = animation;
    // 第3步：执行第一组动画 
    animation.opacity(0).step();
    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })
    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animation.opacity(1).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })

      //关闭 
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示 
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  },





  onShareAppMessage: function (e) {
    var that = this;
    if (e.from === 'menu') {
      // 来自页面内转发按钮
      console.log(e.target)
    }
    return {
      title: '广点点（广告接单平台）',
      path: '/pages/index/index?from=red_bag_carmera',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }

  






})

