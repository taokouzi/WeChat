// pages/profit_now/index.js
var wxCharts = require('../../utils/wxcharts-min.js');

//获取应用实例
const app = getApp();
Page({

  data: {
    task:'',  
    sy_center:'', 
    red_bag:[{
      red: 'images/red_bag.png',
      close2: 'images/close2.png',
    }],
    red_bag_link:'../red_bag/index',
    showView:true,
    winWidth:'',
    winHeight:'',
    profit:'', 
    store:''  ,
    isRed:'',

    session_id:'',
    request_url: app.config().request_url,     //请求地址
  },


  onShow: function (options) {

    var that = this;

    showView: (options.showView == "true" ? true : false);

    //URL传参
    var pages = getCurrentPages();    //获取加载的页面
    var currentPage = pages[pages.length - 1];    //获取当前页面的对象
    var url = currentPage.route;    //当前页面url
    var ops = currentPage.options;    //如果要获取url中所带的参数可以查看options
    //URL传参 E N D


    //获取数据的session_id
    wx.getStorage({
      key: 'session_id',
      success: function (res) {
       
        that.setData({
          session_id: res.data
        })
        //console.log(res.data);

        //当前收益页面
        wx.request({
          url: that.data.request_url + 'profit.php?action=now_profit',  //下刊服务网点
          data: {
            session_id: res.data  //用户session_id
          },
          method: 'GET',
          header: { 'content-type': 'application/json' },
          success: function (res1) {
            console.log(res1);
            //赢藏悬浮红包
            if (res1.data.data.is_red == '0' ){
              that.setData({
                showView: false
              })
            }
            //显示悬浮红包
            else{
              that.setData({
                showView: true
              })
            }

            var init = res1.data.data.init_money;
            var km = res1.data.data.km_total_money;
            var ord = res1.data.data.ord_total_money;
            var red = res1.data.data.red_total_money;

            that.setData({
              profit: (parseFloat(init) + parseFloat(km) + parseFloat(ord) + parseFloat(red)).toFixed(2),
              task: res1.data.data.task,
              sy_center: res1.data.data.back_day,
              store: res1.data.data.store
            })

            //获取系统信息
            wx.getSystemInfo({
              success: function (res2) {
                //动态设置canvas及父元素高度
                that.setData({
                  winHeight: res2.windowWidth
                });
                console.log(init+'  '+km+'  '+ord+'  '+red+'  ');
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
        })
    //当前收益页面 E N D


      }
    })
    //获取session_id  E N D



    
    
    
  },

  //当前收益-关闭红包
  closeClick:function(){
    var that = this;
    that.setData({
       showView: (!that.data.showView)
    }) 
  },
  //当前收益-关闭红包  E N D


  //当前收益-二次上刊
  top_kan2:function(e){
    wx.showModal({
      title: '二次上刊',
      content: '广告图/二维码破损，申请重新贴图上刊',
      cancelText:'返回',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
        } 
        else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    })
  },
  //当前收益-二次上刊 E N D



  //当前收益-扫一扫下刊
  saoma_down: function () {
    wx.scanCode({
      needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      onlyFromCamera: true,
      success: function (res) {
        //扫码跳转到指定页面（同目录结构下）
        wx.redirectTo({
          url: 'saoma_down_list'
        });
      }
    })
  },
  //当前收益-扫一扫下刊 E N D




  onShareAppMessage: function (e) {
    var that = this;
    if (e.from === 'menu') {
      // 来自页面内转发按钮
      console.log(e.target)
    }
    return {
      title: '广点点（广告接单平台）',
      path: '/pages/index/index?from=profit_now',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }


})