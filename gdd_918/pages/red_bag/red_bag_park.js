// pages/red_bag_park/index.js
var app = getApp();
Page({

  data: {
    parkSrc: "images/zp45.png",
    parkPic:0,

    showModalStatus: false,
    money_num: '',    //红包金额
    redHeight: '',

    session_id:'',
    taskId:'',
    activeId:'',
    memberId:'',
    red_over: false,

    filePath:'',

    request_url: app.config().request_url,     //请求地址
 
  },


  onShow: function (options) {

    var that = this;

    //URL传参
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];    //获取当前页面的对象
    var url = currentPage.route;    //当前页面url
    var ops = currentPage.options;    //如果要获取url中所带的参数可以查看options
   // console.log(ops);
    that.setData({
      taskId: ops.taskId,  //任务id
      activeId: ops.activeId,
      memberId: ops.memberId
    }); 


    //获取数据的session_id
    wx.getStorage({
      key: 'session_id',
      success: function (res) {

        that.setData({
          session_id: res.data
        })
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

  //路边停车照(点击图片)
  parkChange: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['camera'], 
      success: function (res) {
        var tempFilePath = res.tempFilePaths;

        that.setData({
          parkSrc: res.tempFilePaths,
          filePath: tempFilePath[0]
        })
      }
    })
  },
  //路边停车照(点击图片) E N D


  
  //点击提交
  formSubmit: function (e) {

    var that = this;

    if (that.data.filePath != '' ){
      wx.uploadFile({
        url: that.data.request_url+'profit.php?action=stop',
        filePath: that.data.filePath,
        name: "car_pic",
        formData: {
          task_id: that.data.taskId,
          active_id: that.data.activeId,
          member_id: that.data.memberId,
        },
        success: function (res) {
          
          if (JSON.parse(res.data).code == 1 ){
            //获得随机红包（展示）
            console.log(that.data.session_id + ';' + that.data.activeId);
            wx.request({
              url: that.data.request_url +'profit.php?action=get_frozen_red',
              data: {
                session_id: that.data.session_id,  //用户session_id
                active_id: that.data.activeId,    //红包活动id
              },
              method: 'GET',
              header: { 'content-type': 'application/json' },
              success: function (res) {
                //console.log(res);
                if (res.data.code == '1' || res.data.code == '11') {
                  if (res.data.code == '11') {
                    that.setData({
                      money_num: '红包已被领完~',
                      red_over: true
                    })
                  }
                  else {
                    that.setData({
                      money_num: res.data.data.red_num,
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
              }
            })
            //获得随机红包（展示） E N D
          }
          else{
            console.log(JSON.parse(res.data));
            wx.showToast({
              icon: 'loading',
              title: '系统异常'
            });
            return false;
          }
          
        }
      })
    }
    else{
      wx.showToast({
        icon: 'loading',
        title: '请上传停车照'
      });
      return false;
    }
    

  },
  //点击提交 E N D



  //点击‘好’
  powerDrawer: function (e) {

    var that = this;
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu);
    
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
      path: '/pages/index/index?from=red_bag_park',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }




})