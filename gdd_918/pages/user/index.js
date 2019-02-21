 import NumberAnimate from "NumberAnimate";
var app = getApp();
Page({
  
  data: {
    avatarUrl:'',
    nickName:'',

    is9011:false,
    
    is_invite:'',
    msg_num: '',
    
    total_red: '', //收益总计
    frozen_red: '',  //冻结资金
    amount: '', //可提现
    apply_amount:'',  //提现中的金额

    id: '',  //0：游客  1：完善资料

    session_id:'',

    request_url: app.config().request_url,     //请求地址
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

  

  onShow: function () {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    
    this.showInfo();
    

    //高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 180;
        that.setData({
          winHeight: calc
        });
      }
    });
    //高度自适应 E N D

  },


  showInfo:function()
  {
    var that = this;
    //获取数据的session_id
    wx.getStorage({
      key: 'session_id',
      success: function (res) {
        that.setData({
          session_id: res.data
        })

        //我的
        wx.request({
          url: that.data.request_url + 'my.php?action=get_my',
          data: {
            session_id: res.data
          },
          method: 'GET',
          header: { 'content-type': 'application/json' },
          success: function (res) {
            //console.log(res);
            if (res.data.code == '1') {
              that.setData({
                nickName: res.data.data.nickname,
                avatarUrl: res.data.data.wc_pic,
                is_invite: res.data.data.is_invite,
                msg_num: res.data.data.msg_num,
                amount: res.data.data.amount,
                apply_amount: res.data.data.apply_amount,
                tel: res.data.data.tel,
                id: res.data.data.status    //0:未认证资料 1:已认证资料 2:在审核中...
              })


              //数字动效
              let total_red = parseFloat(res.data.data.frozen_red) + parseFloat(res.data.data.amount) + parseFloat(res.data.data.cash) + parseFloat(res.data.data.apply_amount);
              let frozen_red = res.data.data.frozen_red;

              let n1 = new NumberAnimate({
                from: total_red,//开始时的数字
                speed: 1000,// 总时间
                refreshTime: 100,//  刷新一次的时间
                decimals: 2,//小数点后的位数
                onUpdate: () => {//更新回调函数
                  that.setData({
                    total_red: parseFloat(n1.tempValue).toFixed(2)
                  });
                },
                onComplete: () => {//完成回调函数
                  that.setData({

                  });
                }
              });
              let n2 = new NumberAnimate({
                from: frozen_red,//开始时的数字
                speed: 1000,// 总时间
                refreshTime: 100,//  刷新一次的时间
                decimals: 2,//小数点后的位数
                onUpdate: () => {//更新回调函数
                  that.setData({
                    frozen_red: parseFloat(n2.tempValue).toFixed(2)
                  });
                },
                onComplete: () => {//完成回调函数
                  that.setData({

                  });
                }
              });
              //数字动效 E N D
            }
            else 
            {
              if (res.data.code == '9011') 
              {
                app.againChangeSessionId('changeSessionId');
  
                // that.setData({
                //   is9011:true
                // })
              }
              console.log(res);
            }

            wx.hideLoading()
          }
        })
    //我的 E N D

      }
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
          //console.log(res);
          if( res.data.code == '1' ){
              that.setData({
                tel:res.data.tel
              })
          }
        }
      })
    }
  },
  //授权获取手机号 E N D



  //广告合作联系
  call_me:function(){
    wx.makePhoneCall({
      phoneNumber: '023-46737885' 
    })
  },
  //广告合作联系 E N D


  //用户审核时 点击弹出
  shenhe_data:function(){
    wx.showModal({
      title: '提示',
      showCancel: false,
      confirmColor:'#008be6',
      content: '资料审核中，暂不能进行操作',

      success: function (res) { }
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
      path: '/pages/index/index?from=user_index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
  



})


