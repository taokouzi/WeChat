var app = getApp();
Page({
  data: {

    images: [
      {
        link:'../logs/logs',
        url: 'images/b2.png' 
      },
      { 
        link: '../logs/logs',
        url: 'images/b1.png' 
      },
      {
        link: '../logs/logs',
        url: 'images/b2.png'
      },
      { 
        link: '../logs/logs',
        url: 'images/b3.png' 
      }
    ],
    indicatordots:true,
    autoplay: true, 
    interval:"3500",
    duration:"800",

   // page:0,
    list: [],
    scrollTop: 0,

    is_sx:0,

    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置

    session_id:'',
    currentCity: '',  //城市定位

    region:'',  //城市邮编
    city: '',  //定位城市
    //task_data1:[],
    //task_data2: [],
    taskImgUrl: app.config().pic_url,    //任务图片展示路径
    request_url: app.config().request_url,     //请求地址

    member_id:'',    //分享者id 
    recommend_id:'',    //分享者分享时的活动id

    is_show:'1'
  },

  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });

  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }
  },


  onShareAppMessage:function(){},
  
  onLaunch: function () {
    
  },  



  onLoad:function(opt){

    var that = this;
    wx.showLoading({title:'加载中...'});
  /*
    if( that.data.is_show == '1' ){
      wx.showLoading({
        title: '加载中',
      })
    }
    */

    this.getLocation(); 

    //URL传参
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];    //获取当前页面的对象
    var url = currentPage.route;    //当前页面url
    var ops = currentPage.options;    //如果要获取url中所带的参数可以查看options
    /*console.log(pages);
    console.log(url);
    console.log(ops); 
    console.log(ops.shareing);*/
    that.setData({
      member_id: ops.shareing,   //推荐者/分享者id
      recommend_id: ops.recomedId,    //推荐者分享的活动id
    }); 
    //console.log('分享者id = ' + ops.shareing + ' ; 分享时活动id = ' + ops.recomedId);


  },

  onShow: function () {

    var that = this;

    //高度自适应
    wx.getSystemInfo({
      
      success: function (res) {
        //console.log(res.screenWidth);
        var calc;
        // if (res.screenWidth >= 320 && res.screenWidth < 360 ){  //iphone5
        //   calc = res.windowHeight - 170;
        // }
        // else{
        //   calc = res.windowHeight - 220;
        // }
        if (res.screenWidth >= 320 && res.screenWidth < 360) {  //iphone5
          calc = res.windowHeight - 115;
        }
        else {
          calc = res.windowHeight - 155;
        }

        //console.log(res.windowHeight+' ; '+calc);
        that.setData({
          winHeight: calc
        });

      }
    });
    //高度自适应 E N D


    //获取数据的session_id
    wx.getStorage({
      key: 'session_id',
      success: function (rs) {

        that.setData({
          session_id: rs.data
        })
        //console.log(rs.data + ' . ' + that.data.member_id + ' . ' + that.data.recommend_id);
        //推荐关系建立
        if (that.data.member_id != undefined || that.data.recommend_id != undefined) {

          wx.request({
            url: that.data.request_url + 'my.php?action=member_about',
            data: {
              session_id: rs.data,
              member_id: that.data.member_id,
              recommend_id: that.data.recommend_id
            },
            method: 'GET',
            header: { 'content-type': 'application/json' },
            success: function (res) {

              if (res.data.code == '1') {
                console.log('推荐者和接收者关系建立成功');
              }
              else {
                console.log(res);
              }
            }
          });
        }
        else {
          //console.log('本机 = ' + rs.data + ' ; 推荐者 = ' + that.data.member_id + ' ; 推荐者任务 = ' + that.data.recommend_id);
        }
        //推荐关系建立  E N D

      },
    })
    //获取数据的session_id  E N D

  },
  


  //定位城市
  getLocation: function () {
    var that = this
    wx.getLocation({
      type: 'wgs84',  
      success: function (res) { 
        // console.log(res);
        var longitude = res.longitude
        var latitude = res.latitude
        that.loadCity(longitude, latitude)
      },
      fail:function(){
        console.log('定位失败');
        wx.hideLoading();
        wx.showModal({
          title: '请求授权当前位置',
          content: '需要获取您的地理位置，请确认授权',
          showCancel:false,
          success: function (res) {
            wx.openSetting({
              success: function (dataAu) {
                if (dataAu.authSetting["scope.userLocation"] == true) {
                  wx.showToast({
                    title: '授权成功',
                    icon: 'success',
                    duration: 1000
                  })
                  //再次授权，调用wx.getLocation的API
                  // vm.getLocation();
                } else {
                  wx.showToast({
                    title: '授权失败',
                    icon: 'none',
                    duration: 1000
                  })
                }
              }
            })
          }
        })
      }
    })
  },  

  loadCity: function (longitude, latitude) {
    var that = this;
    var ak ='Y31MKOMTp3nVtymy5erztL9Td7ovBFUU';
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak='+ ak +'&location=' + latitude + ',' + longitude + '&output=json',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        /*console.log(res);
        console.log('当前地理编码：' + res.data.result.addressComponent.adcode);*/
        var region = res.data.result.addressComponent.adcode;
        var city = res.data.result.addressComponent.city + res.data.result.addressComponent.district;
        //console.log(city);
        that.setData({
          region: region,
          city: city,
          is_sx:1
        })
        that.listFunc( region, city );
        
        that.setData({ currentCity: city });
      },
      fail: function () {
        that.setData({ currentCity: "获取定位失败" });
      },

    })
  },  
  //定位城市 E N D
  


  task_over:function(){
    wx.showToast({
      title: '该任务已结束',
      icon: 'none'
    })
  },


  task_ing: function () {
    wx.showToast({
      title: '该任务已经在进行中',
      icon: 'none'
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
      path: '/pages/index/index?from=index_index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },



  //点击刷新
  sxFun: function (e) {
    var that = this;
    var region = that.data.region;
    var city = that.data.city;
    that.listFunc(region, city );
    wx.showToast({
      title: '刷新成功',
      icon: 'success'
    })
  },

  

  //任务列表展示
  listFunc: function (region, city){
    //console.log(city);
    var that = this;
    //普通
    wx.request({
      url: that.data.request_url + 'task.php?action=get_task',
      data: {
        type_id: 1,
        region: region,
        city: city
      },
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res);
        if (res.data.code == '1') {
          that.setData({
            list: res.data.datas,
          })
        }
        else {
          console.log(res);
        }
        wx.hideLoading();
      }
    });

    //loadMore(that);
    //普通  E N D
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  //页面滑动到底部
 /* bindDownLoad: function () {
    var that = this;
    loadMore(that);
    //console.log("lower");
  },
  scroll: function (event) {
    //该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },*/





})




