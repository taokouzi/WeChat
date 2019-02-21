// pages/top_reserve/index.js
var app = getApp();
Page({

  data: {
    pic_arr:'',
    indicatordots: true,
    autoplay: true,
    interval: "3500",
    duration: "800",

    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置

    store_n :'',

    session_id: '',
    task_id :'',
    store_id:'',

    icon_wz: 'images/wz.png',
    icon_wza: 'images/wza.png',
    wzBox:'',  //预约上刊网点
    
    arrayTime:'',    //预约上刊时间（时间段）
    timeIndex:0,

    //ss_date: (new Date).getFullYear() + '-' + ((new Date).getMonth() + 1) + '-' + (new Date).getDate(),    //当前系统日期
    top_date:'',
    front_date:'',
    start_date: '',

    can_use: '',//某个时间段可预约车辆数
    request_url: app.config().request_url,     //请求地址
    pic_url: app.config().pic_url,     //请求地址
  },

  
  onLoad: function (options) {

      var that = this;

      //URL传参
      var pages = getCurrentPages();    //获取加载的页面
      var currentPage = pages[pages.length - 1];    //获取当前页面的对象
      var url = currentPage.route;    //当前页面url
      var ops = currentPage.options;    //如果要获取url中所带的参数可以查看options
      //URL传参 E N D


      that.setData({
        task_id:ops.id
      })



      //获取数据的session_id
      wx.getStorage({
        key: 'session_id',
        success: function (res1) {
          //console.log(res1.data);
          //console.log(ops.id);

          that.setData({
            session_id: res1.data
          })
          
          //预约上刊网点
          wx.request({
            url: that.data.request_url +'task.php?action=store_list', 
            data: {
              task_id: ops.id,
              session_id: res1.data  //用户session_id
            },
            method: 'GET',
            header: { 'content-type': 'application/json' },
            success: function (res2) {
              //console.log(res2);
              if( res2.data.code == '1' ){

                var val = res2.data.data.store;
                var arr = [];
                for (var i in val) {
                  arr.push(val[i].store_id);
                }

                that.setData({
                  wzBox: res2.data.data.store,
                  pic_arr: res2.data.data.pic,
                  store_n: res2.data.data.store.length,
                })

                that.setData({
                  store_id : arr[arr.length - 1]
                })
               
                //根据store_id展示 预约上刊时间
                wx.request({
                  url: that.data.request_url +'task.php?action=get_times',
                  data: {
                    task_id: ops.id,
                    session_id: res1.data,
                    store_id: arr[arr.length - 1],   //网点号(默认为最后)
                  },
                  method: 'GET',
                  header: { 'content-type': 'application/json' },
                  success: function (res3) {
                    //console.log(res3);
                    if( res3.data.code == '1' ){

                      that.setData({
                        arrayTime: res3.data.data,
                        timeIndex: 0,
                        front_date:res3.data.front,
                        start_date: res3.data.start,
                        top_date: res3.data.front,
                      })
                      
                      //某网点+某时段可预约数量
                      wx.request({
                        url: that.data.request_url +'task.php?action=adver_left',
                        data: {
                          task_id: ops.id,
                          session_id: res1.data,
                          store_id: arr[arr.length - 1],   //网点号(默认为最后)
                          ord_dates: that.data.top_date.replace('-', '').replace('-', ''),  //预约日期(默认)
                          ord_times: res3.data.data[0]  //预约时间段（默认）
                        },
                        method: 'GET',
                        header: { 'content-type': 'application/json' },
                        success: function (res4) {
                          if( res4.data.code == '1' ){
                            that.setData({
                              can_use: res4.data.total_left
                            })
                          }
                          else{
                            console.log(res4);
                          }
                        }
                      })
                    //某网点+某时段可预约数量 E N D
                    }
                    else{
                      console.log(res3);
                    }
                  }
                })
             //根据store_id展示 预约上刊时间 E N D
              }
              else{
                console.log(res2);
              }
            }
          })
          //预约上刊网点 E N D

          //console.log(that.data.top_date);
        },
      })
      //获取数据的session_id  E N D
      
  },



  //选择上刊网点
  radioCheckedChange: function (e) {

    var that = this;
    //console.log('网2 = ' +e.detail.value);
    that.setData({
      store_id: e.detail.value
    })

    //根据store_id展示 预约上刊时间
    wx.request({
      url: that.data.request_url +'task.php?action=get_times',
      data: {
        task_id: that.data.task_id,
        session_id: that.data.session_id,
        store_id: e.detail.value
      },
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
      //console.log(res);
        if( res.data.code == '1' ){

          that.setData({
            arrayTime: res.data.data,
            timeIndex: 0
          })

          that.getCarLeft(res.data.data[0]);
        }
        else{
          console.log(res);
        }
        
      }
    })
    //根据store_id展示 预约上刊时间 E N D

  },
  //选择上刊网点  E N D




  //预约上刊日期
  topDateChange: function (e) {
    //console.log(e.detail.value)
    this.setData({
      top_date: e.detail.value
    })
  },



  //预约上刊时间（时间段）
  topTimeChange: function (e) {
    var that = this;

    this.setData({
      timeIndex: e.detail.value
    })
    
    that.getCarLeft(that.data.arrayTime[e.detail.value] );
  },


  getCarLeft:function( order_times ){
    var that = this;
    //某网点+某时段可预约数量
    wx.request({
      url: that.data.request_url + 'task.php?action=adver_left',
      data: {
        task_id: that.data.task_id,
        session_id: that.data.session_id,  //用户session_id
        store_id: that.data.store_id, //网点号(默认为最后)
        ord_dates: that.data.top_date.replace('-', '').replace('-', ''), //预约日期
        ord_times: order_times  //预约时间段
      },
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        //console.log(res);
        if (res.data.code == '1') {
          that.setData({
            can_use: res.data.total_left
          })
        }
        else {
          console.log(res);
        }
      }
    })
          //某网点+某时段可预约数量 E N D
  },
  

//上刊预约-提交
  sk_submit: function (e) {

    var that = this;

    wx.showToast({
      icon: 'loading',
      title: '提交申请中....'
    });


    if (that.data.can_use <= 0) {
      wx.showToast({
        icon: 'loading',
        title: '已经预约完啦'
      });
      return false;
    }

    //console.log('网4 = ' +that.data.store_id);
    //console.log(that.data.arrayTime[that.data.timeIndex]);
    wx.request({
      url: that.data.request_url +'task.php?action=adver_accept',
      data: {
        task_id: that.data.task_id,
        session_id: that.data.session_id,  //用户session_id
        store_id: that.data.store_id, //网点号
        ord_dates: that.data.top_date.replace('-', '').replace('-', ''), //预约日期
        ord_times: that.data.arrayTime[that.data.timeIndex] //预约时间段
      },
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        //console.log('点击上刊预约提交');
        if( res.data.code == '1' ){
          wx.showModal({
            title: '提示',
            content: '恭喜您 成功接单！接下来就去扫码安装吧~',
            showCancel: false,
            confirmColor: '#008be6',
            confirmText: '好的',
            success: function (res) {
              wx.switchTab({
                url: '../profit/index',
                success: function (e) {   //成功后跳转链接 并刷新链接
                  var page = getCurrentPages().pop();
                  if (page == undefined || page == null) return;
                  page.onLoad();
                }
              });
            }
          })

          /*
          wx.showToast({
            icon: 'success',
            title: '提交成功'
          });
          wx.switchTab({
            url: './index',
            success: function (e) {   //成功后跳转链接 并刷新链接
              var page = getCurrentPages().pop();
              console.log(page);
              if (page == undefined || page == null) return;
              page.onLoad();
            }
          });*/
        }
        else if (res.data.code == '9002' ){
          wx.showToast({
            icon: 'loading',
            title: '重复提交失败！'
          });
        }
        else{
          wx.showToast({
            icon: 'loading',
            title: '系统异常'
          });
          console.log(res);
        }
      }
    })
  },
  //上刊预约-提交 E N D

  


  onShareAppMessage: function (e) {
    var that = this;
    if (e.from === 'menu') {
      // 来自页面内转发按钮
      console.log(e.target)
    }
    return {
      title: '广点点（广告接单平台）',
      path: '/pages/index/index?from=top_reserve',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }


})


