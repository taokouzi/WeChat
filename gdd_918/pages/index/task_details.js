// pages/task_details/index.js
var app = getApp();
Page({

  data: {
    picArr:'',
    indicatordots: true,
    autoplay: true,
    interval: "3500",
    duration: "800",

    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置

    task_id: '',
    session_id:'',
    is_accepted:'0',

    car_left:'',

    task_detail:'',
    
    icon_wz:'images/wz.png',

    task_details_title : '',
    tf_date : '',
    tf_time: '',
    say_text:'',
    tel:'',

    service_addr:'',
    wd_tel:'',
    taskImgUrl: app.config().pic_url,   //任务图片展示路径
    request_url: app.config().request_url,     //请求地址
  },

 
  onLoad: function (options) {

    var that = this;

    //URL传参
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];    //获取当前页面的对象
    var url = currentPage.route;    //当前页面url
    var ops = currentPage.options;    //如果要获取url中所带的参数可以查看options

    this.setData({
      task_id: ops.id,  //任务id
    });

    //获取数据的session_id
    wx.getStorage({
      key: 'session_id',
      success: function (res) {
        that.setData({
          session_id: res.data
        })

        //console.log(parseFloat(ops.id));
        
        //任务详情
        wx.request({
          url: that.data.request_url+'task.php?action=get_task_mx',
          data: {
            session_id: res.data,
            task_id: parseFloat(ops.id)
          },
          method: 'GET',
          header: { 'content-type': 'application/json' },
          success: function (res) {
            //console.log(res);
            if( res.data.code == '1' ){
              if (res.data.datas[0].stores != null) {
                var stores = res.data.datas[0].stores.split(',');
                var str = Array();
                var tels = Array();
                for (var i = 0; i < stores.length; i++) {
                  str[i] = stores[i].split('|');
                  tels[i] = stores[i].split('|')[3].split('  ');
                }
              }
              //console.log(str);
              console.log(tels);
              that.setData({
                tel: res.data.datas[0].tel,
                is_accepted:res.data.accepted,    //是否接过任务  1：接过  0：未接过
                task_detail: res.data.datas,
                car_left: res.data.datas[0].car_left,
                picArr: res.data.datas[0].pic,
                say_text: res.data.datas[0].explain,
                wd_tel: tels,
                service_addr: str,
                tf_date: res.data.datas[0].start_date.slice(4, 6) + '/' + res.data.datas[0].start_date.slice(6) + '-' + res.data.datas[0].end_date.slice(4, 6) + '/' + res.data.datas[0].end_date.slice(6),
                //tf_time: parseFloat(res.data.datas[0].end_date) - parseFloat(res.data.datas[0].start_date),
              })
            }
            else{
              console.log(res);
            }

          }
        });
       //任务详情 E N D



      },

    })
    //获取数据的session_id  E N D



    



    

    // //拼接url的参数
    // var urlWithArgs = url + '?'
    // for (var key in options) {
    //   var value = options[key]
    //   urlWithArgs += key + '=' + value + '&'
    // }
    // urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
    // //URL传参 E N D


  },


  //用户审核时 点击弹出
  shenhe_data: function () {
    wx.showModal({
      title: '提示',
      showCancel: false,
      confirmColor: '#008be6',
      content: '资料审核中，暂不能进行操作',

      success: function (res) { }
    })
  },


  //可预约剩余小于0
  jie_sy: function () {
    wx.showModal({
      title: '提示',
      showCancel: false,
      confirmColor: '#008be6',
      content: '没有可预约的车辆啦~',

      success: function (res) {
        wx.navigateBack({
          url: './index',
        })
      }
    })
  },


  //已接任务 点击弹出
  jie_rw: function () {
    wx.showModal({
      title: '提示',
      //showCancel: false,
      confirmColor: '#008be6',
      content: '您已接过任务了哦~',
      cancelText:'知道了',
      confirmText:'我的任务',
      success: function (res) { 
        if (res.confirm) {
          wx.switchTab({
            url: '../profit/index',
            success: function (e) {   //成功后跳转链接 并刷新链接
              var page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
              page.onLoad();
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },


  onShareAppMessage: function (e) {
    var that = this;
    if (e.from === 'menu') {
      // 来自页面内转发按钮
      console.log(e.target)
    }
    return {
      title: '广点点（广告接单平台）',
      path: '/pages/index/index?from=task_details',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },


  call_me: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.target.id
    })
  },


  //授权获取手机号
  getPhoneNumber: function (e) {
    var that = this;
    console.log(that.data.session_id);
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      console.log('拒绝授权');
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
          console.log(res);
          if( res.data.code == '1' ){
            wx.navigateTo({
              url: './top_reserve?id=' + that.data.task_id + '&session_id=' + that.data.session_id,
            })
          }
          
        }
      })
    }
  },
  //授权获取手机号 E N D





})