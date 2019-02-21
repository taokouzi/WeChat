// pages/red_bag_adv/index.js
var app = getApp();
Page({

  data: {
    advSrc:'',
    advHeight:'',
    taskSrc: 'images/bg.png',
    showModalStatus: false,
    money_num: '',
    redHeight: '',
    red_over:false,

    session_id:'',
    taskId:'',
    activeId:'',
    share_n:'',
    share_min_n:'',
    share_title:'',
    
    advRedImgUrl: app.config().pic_url,
    request_url: app.config().request_url,     //请求地址
  },

  onLoad: function (opt) {
    wx.showShareMenu({
      withShareTicket: true
    })
    if (opt.scene == 1044) {
      wx.getShareInfo({
        shareTicket: opt.shareTicket,
        success: function (res) {
          console.log(res);
          var encryptedData = res.encryptedData;
          var iv = res.iv;
        }
      })
    }
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
      activeId: ops.activeId
    });


    //获取数据的session_id
    wx.getStorage({
      key: 'session_id',
      success: function (res) {

        that.setData({
          session_id: res.data
        })

        //广告红包
        wx.request({
          url: that.data.request_url + 'profit.php?action=get_adver_share',
          data: {
            session_id: res.data,
            task_id: ops.taskId,
            active_id: ops.activeId,     //红包活动id
          },
          method: 'GET',
          header: { 'content-type': 'application/json' },
          success: function (res) {
            //console.log(res.data.data);
            if (res.data.code == '1') {
              that.setData({
                advSrc: res.data.data.share_pic,
                share_n: res.data.data.share_num,
                share_min_n: res.data.data.share_min_num,
                share_title: res.data.data.share_title
              })
            }
            else {
              console.log(res);
            }
          }
        });
    //广告红包 E N D
      }
    })
    //获取数据的session_id  E N D


    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var advWidth = res.windowWidth;
        that.setData({
          advHeight: advWidth*1.47467,
          redHeight: 300 * 1.3264
        });
      }
    });

    
    
  },


  //分享 转发
  onShareAppMessage: function (e) {

    var that = this;

    if (e.from === 'button') {
      // 来自页面内转发按钮
      //console.log('按钮转发');
    }
    return {
      title: that.data.share_title,
      path: '/pages/index/index?shareing=' + that.data.session_id,
      //imageUrl: 'images/adv.png',
      success: function (res) {

        var shareTickets = res.shareTickets;
        if (shareTickets.length == 0) {   //分享到个人
          return false;
        }
        wx.getShareInfo({   //分享到群
          shareTicket: shareTickets[0],
          success: function (res) {
            console.log(res);
            var encryptedData = res.encryptedData;
            var iv = res.iv;

            wx.request({
              url: that.data.request_url + 'profit.php?action=get_adver_share',
              data: {
                session_id: that.data.session_id,
                task_id: that.data.taskId,
                active_id: that.data.activeId,
              },
              method: 'GET',
              header: { 'content-type': 'application/json' },
              success: function (res) {
                if (res.data.code == '1') {
                  that.setData({
                    share_n: res.data.data.share_num,
                    share_min_n: res.data.data.share_min_num
                  })
                }
                else {
                  console.log(res);
                }
              }
            });


            //分享次数完成后 可领红包
            wx.request({
              url: that.data.request_url +'profit.php?action=share_num',
              data: {
                session_id: that.data.session_id,  //用户session_id
                task_id: that.data.taskId,
                active_id: that.data.activeId,
              },
              method: 'GET',
              header: { 'content-type': 'application/json' },
              success: function (res) {
                if( res.data.code == '1' ){
                  if (res.data.data.share_num == res.data.data.share_min_num) {
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

                          var currentStatu = e.target.dataset.statu;
                          that.util(currentStatu);

                        }
                        
                      }
                    })
                    //获得随机红包 E N D
                  }
                }
                else{
                  console.log(res);
                }
              }
            })
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
    console.log(that.data.session_id + ',' + that.data.activeId + ',' + that.data.taskId + ',' + that.data.money_num);

    
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