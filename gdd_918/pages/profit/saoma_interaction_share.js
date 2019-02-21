var app = getApp();
Page({

  data: {


    taskSrc: 'images/bg.png',
    showModalStatus: false,
    money_num: '',
    redHeight: '',

    submit_share: '',
    share: '',
    red_over: false,

    session_id: '',
    filePath: '',//
    task_id: '',
    active_id: '',

    picImgUrl: app.config().myPic_url,
    request_url: app.config().request_url,     //请求地址
  },

  onShow: function (options) {

    var that = this;

    //URL传参
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];    //获取当前页面的对象
    var url = currentPage.route;    //当前页面url
    var ops = currentPage.options;    //如果要获取url中所带的参数可以查看options

    this.setData({
      qrcode_status: ops.qrcode_status,  //扫二维码进入的状态码  2：按钮显示拍照提交 3：按钮显示分享
      active_id: ops.active_id,
      task_id: ops.task_id,
      session_id: ops.session_id
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


    //回显
    wx.request({
      url: that.data.request_url + 'my.php?action=scan_edit',
      data: {
        session_id: ops.session_id,
        active_id: ops.active_id,
        task_id: ops.task_id,
      },
      success: function (res) {
        //console.log(res.data.data);
        if (res.data.code == '1') {
          that.setData({
            share: res.data.data
          })
        }
        else {
          console.log(res);
        }
      }
    });
    //回显  E N D


  },


  //页面内点击按钮转发 Page.onShareAppMessage()
  onShareAppMessage: function (e) {

    var that = this;

    //分享标题
    var share_title = '';
    wx.request({
      url: that.data.request_url + 'my.php?action=share',
      data: {
        session_id: that.data.session_id,
        active_id: that.data.active_id
      },
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        if (res.data.code == '1') {
          share_title = res.data.share_title;
        }
      }
    })
    //分享标题  E N D



    if (e.from === 'button') {
      console.log(e);
    }
    return {
      title: share_title,
      path: '/pages/index/index?shareing=' + that.data.session_id,
      success: function (res) {

        console.log('转发成功');
        console.log(that.data.session_id + ' ; ' + that.data.active_id + ' ; ' + that.data.task_id);
        //分享次数增加
        wx.request({
          url: that.data.request_url + 'my.php?action=scan_share',
          data: {
            session_id: that.data.session_id,
            active_id: that.data.active_id,
            task_id: that.data.task_id
          },
          method: 'GET',
          header: { 'content-type': 'application/json' },
          success: function (res) {
            console.log(res);
            if (res.data.code == '1') {
              //分享次数完成后 可领红包
              wx.request({
                url: that.data.request_url + 'my.php?action=scan_edit',
                data: {
                  session_id: that.data.session_id,  //用户session_id
                  task_id: that.data.task_id,
                  active_id: that.data.active_id,
                },
                method: 'GET',
                header: { 'content-type': 'application/json' },
                success: function (res) {
                  console.log(res);
                  console.log(res.data.data.share_num + ' ; ' + res.data.data.share_min_num);
                  if (res.data.code == '1') {
                    //如果分享达到分享次数
                    if (parseFloat(res.data.data.share_num) == parseFloat(res.data.data.share_min_num)) {

                      //获得随机红包
                      wx.request({
                        url: that.data.request_url + 'profit.php?action=get_frozen_red',
                        data: {
                          session_id: that.data.session_id,  //用户session_id
                          active_id: that.data.active_id,
                        },
                        method: 'GET',
                        header: { 'content-type': 'application/json' },
                        success: function (res) {
                          console.log(res);
                          if (res.data.code == '1' || res.data.code == '11') {
                            if (res.data.code == '11') {
                              that.setData({
                                money_num: '红包已被领完~',
                                red_over: true
                              })
                            }
                            else {
                              that.setData({
                                money_num:res.data.data.red_num,
                                red_over: false
                              })
                            }

                            if (!that.data.red_over) {
                              //领取红包（现金红包）
                              wx.request({
                                url: that.data.request_url + 'my.php?action=scan_cash_red',
                                data: {
                                  session_id: that.data.session_id,  //用户session_id
                                  active_id: that.data.active_id,    //执行id
                                  //task_id: that.data.task_id,
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
                            
                            var currentStatu = e.target.dataset.statu;
                            that.util(currentStatu);
                          }
                          else {
                            console.log(res);
                            //console.log('马那笔');
                          }
                        }
                      })
                      //获得随机红包 E N D
                    }
                    //分享次数完成后 可领红包 E N D
                  }
                  else {
                    console.log(res);
                    //console.log('日你妈木木木木木');
                  }
                }
              });
            }
            else{
              console.log('操啛啛喳喳错');
            }
          }
        })

        

      },
      fail: function (res) {
        console.log('转发失败');
      }
    }
  },

  //点击‘好’
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    console.log(currentStatu);
    this.util(currentStatu);

    var that = this;
    console.log(that.data.session_id + ',' + that.data.active_id + ',' + that.data.task_id + ',' + that.data.money_num);
    
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
  }



})