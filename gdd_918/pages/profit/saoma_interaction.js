// pages/saoma_interaction/index.js
var app =getApp();
Page({
  data: {
    taskSrc: 'images/zp45.png',
    showModalStatus: false,
    money_num:'1元',
    redHeight:'',

    submit_share:'',
    share:'',

    session_id: '',
    filePath:'',
    task_id:'',
    active_id:'',

    picImgUrl: app.config().pic_url,
    request_url: app.config().request_url,     //请求地址

  },

  onLoad:function(){

    var that = this;

    //获取数据的session_id
    wx.getStorage({
      key: 'session_id',
      success: function (rs) {
        console.log('sssss = '+rs.data);
        that.setData({
          session_id: rs.data
        })
      }
    })

  },
  
  onShow:function(){

    var that = this;

    //URL传参
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];    //获取当前页面的对象
    var url = currentPage.route;    //当前页面url
    var ops = currentPage.options;    //如果要获取url中所带的参数可以查看options
    
    this.setData({
      active_id: ops.active_id,
      task_id: ops.task_id,
      session_id: ops.session_id
    });

    
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var advWidth = res.windowWidth;
        that.setData({
          redHeight: 300*1.3264
        });
      }
    });

  },

  //点击上传图片
  taskChange: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['camera'],
      success: function (res) {
        //console.log(res);
        var tempFilePath = res.tempFilePaths;
        that.setData({
          taskSrc: res.tempFilePaths,
          filePath: tempFilePath[0]
        })
      }
    })
  },

  //点击提交
  formSubmit: function (e) {
    var that = this;
    console.log(that.data.session_id + ' ; ' + that.data.task_id + ' ; ' + that.data.active_id+' ; '+that.data.filePath);
    if (that.data.filePath != '') {
      wx.uploadFile({
        url: that.data.request_url+'my.php?action=scan',
        filePath: that.data.filePath,
        name: "car_pic",
        formData: {
          session_id: that.data.session_id,
          task_id: that.data.task_id,
          active_id: that.data.active_id
        },
        success: function (res) {
          console.log(res);
          if (JSON.parse(res.data).code == 1) {
            //如果提交成功，跳转页面
            wx.redirectTo({
              url: './saoma_interaction_share?task_id=' + that.data.task_id + '&qrcode_status=3&active_id=' + that.data.active_id + '&session_id=' + that.data.session_id,
            })
          }
          else {
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
    else {
      wx.showToast({
        icon: 'loading',
        title: '请上传停车照'
      });
      return false;
    }
  },
  //点击提交 E N D


  onShareAppMessage: function (e) {
    var that = this;
    if (e.from === 'menu') {
      // 来自页面内转发按钮
      console.log(e.target)
    }
    return {
      title: '广点点（广告接单平台）',
      path: '/pages/index/index?from=saoma_interaction',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }



})