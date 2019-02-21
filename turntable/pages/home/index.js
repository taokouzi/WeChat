var app = getApp();

Page({
  data: {

    imgUrls: [
      'http://www.oneh5.com/thq/FLH/backend_api/api/banner/f3.jpg',
      'http://www.oneh5.com/thq/FLH/backend_api/api/banner/f4.jpg',
      'http://www.oneh5.com/thq/FLH/backend_api/api/banner/watchMovie720.jpg',
      'http://www.oneh5.com/thq/FLH/backend_api/api/banner/xlk_t.png'
    ],


    turntable_img:'./images/tbg.png',

    // 用户是否授权信息，显示赢藏引导弹窗
    isUserInfo: 'none',


    // 奖池剩余奖品份数
    jackpot: '加载中...',
    // 剩余次数
    cs_cnt: '加载中...',

    // 红包
    hb_cnt: '加载中...',
    // 积分
    jf_cnt: '加载中...',

    bus_w: 200,
    bus_h: 200,
    
    frs: ['', '', '', '', ''],

    isAshow: 'none',

    // 屏幕禁止滚动（默认：否/可以滚动）
    viewRoll:''
  },

  onShow:function()
  {
    this.friend_list();

    // 查询本地存储，判断用户授权情况
    var userInfo = wx.getStorageSync('userInfo');
    if ( !userInfo.nickName )
    {
      this.setData({
        isUserInfo:''
      })
    }
  },


  // 好友列表回显
  friend_list:function()
  {
    let that = this;
    app.ajax('users.php', { action: 'friend_list', user_id: app.data.user_id }, res=>{ 
      // console.log(res);
      if (res.data.code == 1 && res.data.head_icon.length > 0)
      {
        var frs = res.data.head_icon;
        if (res.data.head_icon.length < 5 )
        {
          var frn = 5 - res.data.head_icon.length;
          for (var i = 1; i <= frn; i++ )
          {
            frs.push("");
          }
        }
        else
        {
          frs.push("");
        }
        that.setData({
          frs: frs
        })
      }
    }, function () { console.log('friend_list fail');})
  },

  





  touchOnGoods: function ( j ) 
  {
    var that = this, x_i, y_i;
    if (that.isAnim ) return false;
    that.isAnim = true;

    // 再来一次
    if( j == 'again' )
    {
      x_i = (that.W - that.data.bus_w) / 2 + 60;
      y_i = (that.H - that.data.bus_h) / 2;
    }

    // 谢谢参与
    else
    {
      x_i = -20;
      y_i = (that.H - that.data.bus_h) / 2 + 50;
    }

    // 图片放大
    this.animationS = wx.createAnimation({})
    // 恢复
    this.animationE = wx.createAnimation({})

    // 图片父级盒子移动并缩小
    this.animationA = wx.createAnimation({})
    // 恢复
    this.animationB = wx.createAnimation({})

    // console.log(x_i, y_i);

    // 图片放大动画（执行.5s）
    this.animationS.scale(1).step({ duration: 500, timingFunction: 'ease-in'});
    this.setData({ animationS: this.animationS.export() })

    // .5s后图片盒子移动并缩小动画
    this.animationA.translate(-x_i, -y_i).scale(0).step({ duration: 500, delay: 1000,timingFunction: 'ease-in'});
    this.setData({ animationA: this.animationA.export() })
    
    this.cs_cnt = 3;

    setTimeout(function(){
      that.isAnim = false;
      that.animationE.scale(0).step({ duration: 0, delay: 0});
      that.animationB.translate(0, 0).scale(1).step({ duration: 10, delay: 0});
      that.setData({ 
        cs_cnt: ++that.cs_cnt, 
        jf_cnt: 19999,
        animationA: that.animationB.export(), 
        animationS: that.animationE.export(),
        isAshow: 'none',
        viewRoll:''
      })
    },1600)

  },



  // 点击引导弹窗“微信授权”按钮
  onGotUserInfo:function(e)
  {
    console.log(e);
    if (e.detail.userInfo.nickName)
    {
      var objz = {};

      objz.avatarUrl = e.detail.userInfo.avatarUrl;
      objz.nickName = e.detail.userInfo.nickName;

      wx.setStorageSync('userInfo', objz);

      this.setData({
        isUserInfo: 'none'
      })
    }
  },



  // 用户基本信息更新接口
  info:function()
  {
    app.ajax('../../public/index.php/index/Api/getusermsg', {'userid':app.data.user_id},res=>{
      console.log(res);
    }, function () { console.log('getusermsg fail');})
  },




  zp_list: function () {
    var that = this;
    app.ajax('../../public/index.php/index/Api/getturntable', { 'merchantid':'1','userid': app.data.user_id }, res => {
      console.log(res);
      if( res.data.code == 200 )
      {
        that.setData({
          // turntable_img: res.data.data.turntable_img,
          // jackpot: res.data.data.jackpot,
        })

      //   that.gf = res.data.data.turntable;

      // console.log(that.gf);
      }
    }, function () { console.log('getturntable fail'); })
  },






  onLoad: function (options) 
  {
    var that = this;
    this.r = 0;
    this.rand_ns = 0;
    this.ing = false;
    this.isAnim = false;


    // 用户信息
    this.info();

    // 转盘列表
    this.zp_list();

    // 右侧信息列表
    this.tip_list();

    // 商品列表
    this.goods_list();

    


    // 坐标
    wx.getSystemInfo({
      success: function (res) {
        that.W = res.windowWidth;
        that.H = res.windowHeight;

        that.setData({
          bus_x: (res.windowWidth - that.data.bus_w) / 2,
          bus_y: (res.windowHeight - that.data.bus_h) / 2
        })
      }
    });


    // console.log(options);
    // 测试参数
    options.user_id = 'opyVZ5P1EdYLsusHWbpX-crH5e-l';

    // 绑定好友关系
    if ( options.user_id )
    {
      app.ajax('users.php', { 'action': 'friend_bind', 'user_id': app.data.user_id, 'friend_id': options.user_id }, res => { 
        // console.log(res);
        if( res.data.code == 1 )
        {
          console.log('好友关系绑定成功');
        }

      }, function () { console.log( 'friend_bind fail' );})
    }

    

    wx.showLoading({title:'加载中...'})
    setTimeout(function(){
      wx.hideLoading();
    },2000)

    
  
    

  },




  tip_list:function()
  {
    this.t = [
      { 'name': '讨口子', 'num': '皓浩炭烤素牛肉', 'time': '5小时前' },
      { 'name': '温江扛把子', 'num': '咪咪虾条包', 'time': '刚刚' },
      { 'name': '乡村非主流', 'num': '三养火鸡面', 'time': '10分钟前' },
      { 'name': '迷人的路易', 'num': '五香味烤牛肉', 'time': '1周前' },
      { 'name': '测试姓名', 'num': '秘制鸡爪', 'time': '2分钟前' }
    ]
    var i = Math.floor(Math.random() * 4);

    this.setData({
      tipText: { 'name': this.t[i].name, 'num': this.t[i].num, 'time': this.t[i].time },
      imgUrls: this.data.imgUrls,
      showRedBox: 'none'
    })


    setInterval(function () {
      //创建节点选择器
      var query = wx.createSelectorQuery();
      //选择id
      query.select('.tip').boundingClientRect()
      query.exec(function (res) {
        var wid = !res[0] ? 128 : (res[0].width || 128);

        //res就是 所有标签为mjltest的元素的信息 的数组
        //取高度
        i = Math.floor(Math.random() * 4);

        // 提示渐入
        this.tipFunc(wid + 56);

        this.setData({
          tipText: { 'name': this.t[i].name, 'num': this.t[i].num, 'time': this.t[i].time }
        })
        // console.log(wid + 50);
        this.setData({
          W: wid + 50
        })
      }.bind(this))

    }.bind(this), 6000)
  },




  
  // 商品列表回显
  goods_list:function()
  {
    let that = this;
    app.ajax('goods.php', { action: 'list', page: 0, num: 8 }, res=>{
      // console.log(res);
      that.setData({
        goods: res.data.datas
      })
    },function(){
      console, log('list fail');
    })
   
  },



  // 关闭红包
  closeRedBoxFunc:function()
  {
    this.animationClose = wx.createAnimation({
      duration: 0,
      delay: 0
    })
    this.animationClose.scale(.2).step()
    this.setData({
      animation2: this.animationClose.export(),
      showRedBox: 'none',
      viewRoll:''
    })
  },

  // 显示红包
  scaleRedBoxFunc: function (redT )
  {
    this.money = Math.random().toFixed(2);
    this.setData({
      redT: redT || '恭喜中奖',
      isNone: 'none',
      showRedBox:''
    })
    this.animation2 = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease'
    })
    this.animation2.scale(1).step()
    this.setData({ animation2: this.animation2.export() })
  },


  // 点击打开红包动效
  openRedBoxFunc:function()
  {
    var that = this;
    this.openAmt = wx.createAnimation({})
    this.openAmt.rotateY(360).step()
    this.setData({
      openAmt: this.openAmt.export()
    })
    setTimeout(function(){
      this.openAmt2 = wx.createAnimation({
        duration:0
      })
      this.openAmt2.rotateY(0).step()
      this.setData({
        openAmt: this.openAmt2.export()
      })

      this.setData({
        jf_cnt: 10056,
        hb_cnt: 100+this.money,
        redT: this.money+'元',
        isNone: ''
      })


      // 点开红包后1s关闭红包弹窗
      setTimeout(function(){
        that.closeRedBoxFunc();
      },1500)


    }.bind(this),400)
  },



  // 提示进入特效
  tipFunc:function(W)
  {
    this.animationTip = wx.createAnimation({
      duration: 1500,
      delay:800,
      timingFunction: 'linear'
    })

    this.animationTip2 = wx.createAnimation({
      duration: 0,
      delay:0
    })

    this.animationTip.translateX(-W).step().opacity(0).step()
    
    setTimeout(function(){
      this.animationTip2.translateX(0).opacity(1).step()
      this.setData({ animationTip: this.animationTip2.export() })
    }.bind(this),5800)

    this.setData({ animationTip: this.animationTip.export() })
  },













  // 旋转
 rotate: function () 
 { 
   var that = this;
  
  that.setData({
    viewRoll:'on'
  })


   if ( this.ing ) return false;
   this.ing = true;
  
   that.gf = {
     '1':'再来一次',
     '2':'谢谢参与',
     '3':'现金红包',
     '4':'再来一次',
     '5':'谢谢参与',
     '6':'现金红包',
     '7':'谢谢参与',
     '8':'现金红包'
   };


  // 转盘奖品列表数量
   this.gf_n = Object.keys(this.gf).length;

  // 
   this.rand_n =  Math.floor(Math.random() * this.gf_n +1 );

   console.log('随机数' + this.rand_n);

   this.rand_n = 8 - this.rand_n;
  

   this.rand_ns += this.rand_n;

   console.log('点数累计' + this.rand_ns);

   this.r += 5 * 360 + 360 / this.gf_n * this.rand_n;
   this.animationR = wx.createAnimation({
      duration: 3000,
      timingFunction: 'ease'
   })
   this.animationR.rotate( this.r ).step()


  
  //  console.log('ns = ' + this.rand_ns + ' ; n = ' + this.rand_n + ' ; gf_n = ' + this.gf_n );
  

  this.gf_i = this.rand_ns % this.gf_n == 0 ? this.gf_n : (this.rand_ns > this.gf_n ? this.rand_ns % this.gf_n : this.rand_ns);
  
   console.log(this.gf_i + '   ' + this.gf[this.gf_i]);

  setTimeout(function(){
    // 红包
    if (this.gf_i == '3' || this.gf_i == '6' || this.gf_i == '8' )
    {
      this.scaleRedBoxFunc(this.gf[this.gf_i] );
    }
    // 再来一次
    else if (this.gf_i == '1' || this.gf_i == '4' )
    {
      this.setData({
        isAshow:'',
        animImg: './images/zc.png'
      })
      this.touchOnGoods('again');
    }
    // 谢谢参与
    else
    {
      this.setData({
        isAshow: '',
        animImg: './images/jf.png'
      })
      this.touchOnGoods('thank');
    }

    this.ing = false;
  }.bind(this),3200)

   this.setData({ 
     animation: this.animationR.export(), 
    })
  },
   


  // 点击兑换
  excGfFunc:function(e)
  {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '请求投食 “' + e.currentTarget.dataset.name + '”？',
      confirmText:'是的',
      cancelText:'取消',
      success: function (res) 
      {
          if (res.confirm) {
            wx.showLoading({
              title: '投食中...',
            })

            that.order( e.currentTarget.dataset.id );
          }
      }
    })
  },



  // 兑换商品接口
  order: function (goods_id)
  {
    app.ajax('goods.php', { 'action': 'order', 'id': goods_id,'openid': app.data.user_id },res=>{
      // console.log(res);
      wx.hideLoading();
      if( res.data.code == 11 )
      {
        wx.showToast({
          title: '投食成功！',
          icon: 'success'
        })
      }
      else if (res.data.code == 1 )
      {
        wx.showModal({
          title: '提示',
          content: '你未设置收货地址，请设置地址！',
          confirmText: '设置地址',
          cancelText: '取消',
          success: function (res) 
          {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/addr/index'
              })
            }
          }
        })
      }
      else
      {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          confirmText: '确定',
          showCancel:false,
          success: function (res) {
            
          }
        })
      }
    },function(){console.log('order fail')})
  },








  //分享
  onShareAppMessage: function () {
    let that = this
    return {
      title: '测试标题',
      desc: '测试文本',
      path: '/pages/index/index?user_id=' + app.data.user_id,
      success: function (res) {
        console.log(res);
        console.log(res.shareTickets);
        //getSystemInfo是为了获取当前设备信息，判断是android还是ios，如果是android
        //还需要调用wx.getShareInfo()，只有当成功回调才是转发群，ios就只需判断shareTickets
        //获取用户设备信息
        wx.getSystemInfo({
          success: function (d) {
            console.log(d);
            //判断用户手机是IOS还是Android
            if (d.platform == 'android') {
              wx.getShareInfo({//获取群详细信息
                shareTicket: res.shareTickets,
                success: function (res) {
                  //这里写你分享到群之后要做的事情，比如增加次数什么的
                },
                fail: function (res) {//这个方法就是分享到的是好友，给一个提示
                  wx.showModal({
                    title: '提示',
                    content: '分享好友无效，请分享群',
                    success: function (res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  })
                }
              })
            }
            if (d.platform == 'ios') {//如果用户的设备是IOS
              if (res.shareTickets != undefined) {
                console.log("分享的是群");
                wx.getShareInfo({
                  shareTicket: res.shareTickets,
                  success: function (res) {
                    //分享到群之后你要做的事情
                  }
                })

              } else {//分享到个人要做的事情，我给的是一个提示
                console.log("分享的是个人");
                wx.showModal({
                  title: '提示',
                  content: '分享好友无效，请分享群',
                  success: function (res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
              }
            }

          },
          fail: function (res) {

          }
        })
      }

    }
  },

})