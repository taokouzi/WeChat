var util = require('../../utils/util.js')
var wxCharts = require('../../utils/wxcharts-min.js');
//获取应用实例
const app = getApp()
Page({
  data: {
    
    is_guest:'',    //是否是游客 1正式 0游客
    is_task:'',   //是否选择任务 1已选择 0未选择
    is_test:'',     //是否扫码上刊  1已扫 0未扫
    is_msg:'',    //为空就表示游客 否则表示审核未通过
    is_addTime:'',

     /************************************* 当前收益 ****************************************/
    task: '',
    back_day: '',
    xia_day:'',
    red_bag: [{
      red: 'images/red_bag.png',
      close2: 'images/close2.png',
    }],
    red_bag_link: '../red_bag/index',
    showView: false,
    winWidth: '',
    winHeight: '',
    profit: '',
    store: '',

    wd_tel:'',
    is9011:false,

    is_down:'',
    isRed: '',
    session_id:'',
    too_scan:'',
    endDate:'',
     /************************************* 当前收益 E N D ****************************************/

    request_url: app.config().request_url,     //请求地址
    myPic_url: app.config().myPic_url,
    pic_url: app.config().pic_url,
    task_id:'',
    qrcode:'',

    scan_task:'',
    tel01:'',
    tel02: '',
    ord_date:'',
  },

  onLoad: function (options){
    
  },

  onShow: function (options){
    
    var that = this;

    wx.showLoading({
      title: '加载中...',
    })
   
    //showView: (options.showView == "true" ? true : false);

    //URL传参
    var pages = getCurrentPages();    //获取加载的页面
    var currentPage = pages[pages.length - 1];    //获取当前页面的对象
    var url = currentPage.route;    //当前页面url
    var ops = currentPage.options;    //如果要获取url中所带的参数可以查看options
    //URL传参 E N D

    //获取数据的session_id
    wx.getStorage({
      key: 'session_id',
      success: function (rs) {
        console.log(rs);
         that.setData({
           session_id:rs.data
         }) 

        //收益页面状态判断
        wx.request({
          url: that.data.request_url +'profit.php?action=is_guest_scan',
          data: {
            session_id: rs.data,
          },
          method: 'GET',
          header: { 'content-type': 'application/json' },
          success: function (res) 
          {
            console.log('收益');
            console.log(res);
            if( res.data.code == '9011' )
            {
              app.againChangeSessionId('changeSessionId');

              /*that.setData({
                is9011: true
              })
              return false;*/
            }

            //时间戳转正常日期格式
            function getLocalTime(nS) {
              return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
            }
            var add_time = getLocalTime(res.data.add_time).split(' ')[0].split('/')[1] + '月' + getLocalTime(res.data.add_time).split(' ')[0].split('/')[2] +'日';

            var mag_arr = '0';
           
            if ( res.data.msg ){
              var is_msg = res.data.msg;
              mag_arr = is_msg.split('，')[1].split('；');
              mag_arr = mag_arr.slice(0, mag_arr.length - 1);
              
            }

            that.setData({
              is_guest: res.data.is_guest,
              is_task: res.data.is_task,
              is_test: res.data.is_test,
              is_msg: mag_arr,
              is_addTime:add_time,
            })

            //console.log('is_guest = ' + res.data.is_guest + ' ; is_task = ' + res.data.is_task + ' ; is_test = ' + res.data.is_test);

            //扫码收益回显
            if (res.data.is_guest == 1 && res.data.is_task == 1 && res.data.is_test == 0) {
              
              wx.request({
                url: that.data.request_url + 'my.php?action=scan_task',
                data: {
                  session_id: rs.data  //用户session_id
                },
                method: 'GET',
                header: { 'content-type': 'application/json' },
                success: function (res1) {
                  console.log(res1.data.data.tel);
                  if (res1.data.code == '1') {
                    that.setData({
                      scan_task: res1.data.data,
                      tel01: res1.data.data.tel.split('  ')[0],
                      tel02: res1.data.data.tel.split('  ')[1],
                      ord_date: res1.data.data.ord_dates.slice(0, 4) + '年' + res1.data.data.ord_dates.slice(4, 6) + '月' + res1.data.data.ord_dates.slice(6, 8)+'日'
                    })
                  }
                  else {
                    console.log(res1);
                  }
                }
              })
            }
        //扫码收益回显 E N D

            wx.hideLoading()
          }
        })
        //收益页面状态判断 E N D


        



        /************************************* 当前收益 ****************************************/
        //当前收益页面
        wx.request({
          url: that.data.request_url +'profit.php?action=now_profit',  //下刊服务网点
          data: {
            session_id: rs.data  //用户session_id
          },
          method: 'GET',
          header: { 'content-type': 'application/json' },
          success: function (res1) {
            // console.log(res1);
            if( res1.data.code == '1' ){
              
              //赢藏悬浮红包
              if (res1.data.data.is_red == '0') {
                that.setData({
                  showView: false
                })
              }
              //显示悬浮红包

              else {
                that.setData({
                  showView: true
                })
              }

              var init = res1.data.data.init_money;
              var km = res1.data.data.km_total_money;
              var ord = res1.data.data.ord_total_money;
              var red = res1.data.data.red_total_money;
              //console.log(res1.data.data.task);

              var tel_obj = res1.data.data.store;

              var tel_arr = Array();
              var tels = Array();
              for (var i in tel_obj) {
                tel_arr.push(tel_obj[i]);
              }
              for (var k in tel_arr) {
                tels.push(tel_arr[k]['tel']);
              }

              var arr22 = [];
              var tel11 = tels[0].split('  ')[0];
              arr22.push(tel11);
              var tel12 = tels[0].split('  ')[1];
              if ( tel12 ){
                arr22.push(tel12);
              }
              
              //console.log(arr22);
              that.setData({
                profit: (parseFloat(init) + parseFloat(km) + parseFloat(ord) + parseFloat(red)).toFixed(2),
                task: res1.data.data.task,
                endDate: res1.data.data.end_date,
                back_day: res1.data.data.back_day,
                store: res1.data.data.store,
                wd_tel: arr22,
                xia_day: res1.data.data.xia_day,
                is_down: res1.data.data.is_down,
                too_scan: res1.data.data.too_scan,   //1：发过（点击弹出系统提示） 0：未发过（点击弹出二次上刊）
              })
             /* console.log(res1);
              console.log(that.data.back_day);
              console.log(that.data.xia_day);*/
              // console.log(res1.data.data.store);
              //获取系统信息
              wx.getSystemInfo({
                success: function (res2) {
                  //动态设置canvas及父元素高度
                  that.setData({
                    winHeight: res2.windowWidth
                  });
                  //console.log(init + '  ' + km + '  ' + ord + '  ' + red + '  ');
                  //柱状图
                  new wxCharts({
                    canvasId: 'columnCanvas',
                    type: 'column',
                    animation: true,
                    categories: ['基础收益', '里程收益', '订单收益', '红包收益'],
                    series: [{
                      name: '当前收益',
                      data: [parseFloat(init).toFixed(2), parseFloat(km).toFixed(2), parseFloat(ord).toFixed(2), parseFloat(red).toFixed(2)],
                      color: '#FF8E73',
                    }],
                    xAxis: {
                      disableGrid: true,
                      type: 'calibration',
                      fontColor: '#ffffff',     //设置柱状图底部字体颜色
                    },
                    yAxis: {
                      disabled: true,
                      min: 0,
                      gridColor: 'rgba(0,0,0,0)',     //设置柱状图横线
                    },
                    extra: {
                      column: {
                        width: 50,
                      }
                    },
                    width: res2.windowWidth,       //宽度为屏幕宽度
                    height: res2.windowWidth * .485,    //高度*.5（默认px *.5转为rpx）
                    legend: false,    //是否显示图表下方各类别的标识
                    dataLabel: true,   //每柱图标上部数据显示
                  });
                }
              });
            }
            else{
              //console.log(res1);
              // console.log('当期页面');
            }
          }
        })
        //当前收益页面 E N D
        /************************************* 当前收益 E N D ****************************************/
      }
    })
 },


  call_me: function (e) {
    console.log(e);
    wx.makePhoneCall({
      phoneNumber: e.target.id
    })
  },


  //扫码上刊
  saoma: function (){

    var that = this;

    wx.scanCode({
      needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      onlyFromCamera: true,
      success: function (res) {
        //console.log(res);

        var task_id2 = res.result.split('?')[1].split('&')[0].split('=')[1];    //获取二维码task_id参数
        var qrcode2 = res.result.split('?')[1].split('&')[1].split('=')[1];   //获取二维码qrcode参数
        //console.log('saoma_url6666 = ' + res.result + ' ; task_id = ' + task_id2 + ' ; qrcode = ' + qrcode2 + ' ; session_id = ' + that.data.session_id);
        //return false;
        wx.redirectTo({
          url: './saoma?from=profit_up&q=profit&task_id2=' + task_id2 + '&qrcode2=' + qrcode2 +'&session_id2='+that.data.session_id,
          success: function (e) {
            console.log('status=1; go to saoma_top_list.wxml');
          }
        });
      }
    })

  },

  //用户去选择任务
  go_task: function () {
    wx.switchTab({
      url: '../index/index',
    })
  },

  //游客去认证资料
  go_user_data: function () {
    wx.navigateTo({
      url: '../user/user_data?from=profit',
    })
  },

  //资料审核中
  go_shenhe: function() {
    wx.switchTab({
      url: '../index/index',
    })
  },
  


  /************************************* 当前收益 ****************************************/
  //当前收益-关闭红包
  closeClick: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },
  //当前收益-关闭红包  E N D


  //当前收益-二次上刊
  top_kan2: function (e) {

    var that = this;

    wx.request({
      url: that.data.request_url + 'profit.php?action=now_profit',  //下刊服务网点
      data: {
        session_id: that.data.session_id  //用户session_id
      },
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res1) {
        //console.log(res1);
        if (res1.data.code == '1') {

          //1：发过（点击弹出系统提示） 0：未发过（点击弹出二次上刊）
          if (res1.data.data.too_scan == '1') {    //已发过
            wx.showModal({
              title: '系统提示',
              content: '您的申请已经提交，请等候工作人员通知您重新安装',
              showCancel: false,
              confirmColor: '#008be6',
              success: function (res) {
                console.log('好的');
              }
            })
          }
          else {
            wx.showModal({
              title: '补贴广告',
              content: '广告图/二维码破损，申请重新贴图安装',
              cancelText: '返回',
              confirmColor: '#008be6',
              success: function (res) {
                if (res.confirm) {  //确定
                  wx.request({
                    url: that.data.request_url + 'task.php?action=too_scan',
                    data: {
                      session_id: that.data.session_id  //用户session_id
                    },
                    method: 'GET',
                    header: { 'content-type': 'application/json' },
                    success: function (res) {

                      if (res.data.code == '1') {
                        console.log('发送成功');
                      }
                      else {
                        console.log(res);
                      }
                    }
                  })
                }
                else if (res.cancel) {
                  console.log('用户点击取消');
                }
              }
            })
          }
        }
      }

    })

  },
  //当前收益-二次上刊 E N D


  top_kan3:function(){
    wx.showModal({
      title: '提示',
      content: '该任务已结束，不能进行此操作哟~',
      showCancel: false,
      confirmColor: '#008be6',
      confirmText:'好的',
      success: function (res) {
        console.log('好的');
      }
    })
  },


  
  go_jied:function(){
    wx.switchTab({
      url: '../index/index',
      success: function (e) {   //成功后跳转链接 并刷新链接
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    });
  },


  //当前收益-扫一扫下刊
  saoma_down: function () {

    var that = this;

    wx.scanCode({
      needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      onlyFromCamera: true,
      success: function (res) {
        //console.log(res);

        var task_id2 = res.result.split('?')[1].split('&')[0].split('=')[1];    //获取二维码task_id参数
        var qrcode2 = res.result.split('?')[1].split('&')[1].split('=')[1];   //获取二维码qrcode参数
        //console.log('saoma_url6666 = ' + res.result + ' ; task_id = ' + task_id2 + ' ; qrcode = ' + qrcode2);
        //return false;
        wx.redirectTo({
          url: './saoma?from=profit_down&q=profit&task_id2=' + task_id2 + '&qrcode2=' + qrcode2 + '&session_id2=' + that.data.session_id,
          success: function (e) {
            console.log('status=5; go to saoma_down_list.wxml');
          }
        });
      }
    })
  },
  //当前收益-扫一扫下刊 E N D
  /************************************* 当前收益 E N D ****************************************/



  onShareAppMessage: function (e) {
    var that = this;
    if (e.from === 'menu') {
      // 来自页面内转发按钮
      console.log(e.target)
    }
    return {
      title: '广点点（广告接单平台）',
      path: '/pages/index/index?from=profit_index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }



})