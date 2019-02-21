Page({
  data: {

    imgUrls: [
      'http://www.oneh5.com/thq/FLH/backend_api/api/banner/f3.jpg',
      'http://www.oneh5.com/thq/FLH/backend_api/api/banner/f4.jpg',
      // 'http://www.oneh5.com/thq/FLH/backend_api/api/banner/ff.jpg',
      'http://www.oneh5.com/thq/FLH/backend_api/api/banner/watchMovie720.jpg',
      'http://www.oneh5.com/thq/FLH/backend_api/api/banner/xlk_t.png'
    ],

    frs:[
      'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1370942955,3516846572&fm=27&gp=0.jpg',
      'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2905497932,2662226436&fm=27&gp=0.jpg',
      'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1762382510,3359001242&fm=27&gp=0.jpg',
      'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=4126417867,1781657338&fm=11&gp=0.jpg',
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1536922623853&di=864cd839a3285f0c3cf8c11b22ea0118&imgtype=0&src=http%3A%2F%2Fh.hiphotos.baidu.com%2Fbaike%2Fpic%2Fitem%2Feac4b74543a98226a06a9d078782b9014a90eb63.jpg',
      ''
    ],

    gfs:[
      { 
        'src': 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3906065419,691362102&fm=26&gp=0.jpg',
        'name':'女嘉宾',
        'jf':'99',
        'old':'原价：15元',
        'status':'1'
      },
      {
        'src': 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1370942955,3516846572&fm=27&gp=0.jpg',
        'name': '女嘉宾',
        'jf': '99',
        'old': '原价：15元',
        'status': '1'
      },
      {
        'src': 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2905497932,2662226436&fm=27&gp=0.jpg',
        'name': '女嘉宾',
        'jf': '99',
        'old': '原价：15元',
        'status': '1'
      },
      {
        'src': 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1762382510,3359001242&fm=27&gp=0.jpg',
        'name': '女嘉宾',
        'jf': '99',
        'old': '原价：15元',
        'status': '1'
      },
      {
        'src': 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=4126417867,1781657338&fm=11&gp=0.jpg',
        'name': '女嘉宾',
        'jf': '99',
        'old': '原价：15元',
        'status': '1'
      },
      {
        'src': 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1536922623853&di=864cd839a3285f0c3cf8c11b22ea0118&imgtype=0&src=http%3A%2F%2Fh.hiphotos.baidu.com%2Fbaike%2Fpic%2Fitem%2Feac4b74543a98226a06a9d078782b9014a90eb63.jpg',
        'name': '女嘉宾',
        'jf': '99',
        'old': '原价：15元',
        'status': '1'
      },
      {
        'src': 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3312849660,2614984666&fm=27&gp=0.jpg',
        'name': '女嘉宾',
        'jf': '99',
        'old': '原价：15元',
        'status': '1'
      },
      {
        'src': 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1649072770,1390903968&fm=26&gp=0.jpg',
        'name': '女嘉宾',
        'jf': '99',
        'old': '原价：15元',
        'status': '1'
      },
      {
        'src': 'http://img4.imgtn.bdimg.com/it/u=819303681,2934688801&fm=26&gp=0.jpg',
        'name': '女嘉宾',
        'jf': '99',
        'old': '原价：15元',
        'status': '1'
      },
      {
        'src': 'http://img2.imgtn.bdimg.com/it/u=2370847941,1762187681&fm=11&gp=0.jpg',
        'name': '女嘉宾',
        'jf': '99',
        'old': '原价：15元',
        'status': '1'
      }
    ],


    text: "公告：每天上午11：00投放大额红包",
    marqueePace: 1,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    marquee_margin: 30,
    size: 14,
    interval: 20 // 时间间隔
  },


  onLoad: function () {
    // 缩放红包
    // this.scaleRedBoxFunc();
    wx.showLoading({title:'加载中...'})
    setTimeout(function(){
      wx.hideLoading();
    },2000)

    this.r = 0;
    this.rand_ns = 0;
    this.ing = false;
  
    this.t = [
      { 'name': '讨口子', 'num': '9元', 'time': '5小时前' },
      { 'name': '温江扛把子', 'num': '500绿力币', 'time': '刚刚' },
      { 'name': '乡村非主流', 'num': '猫眼电影票', 'time': '10分钟前' },
      { 'name': '~dg%$nsg', 'num': '0.01元', 'time': '1周前' },
      { 'name': '测试姓名', 'num': '冬瓜茶6罐', 'time': '2分钟前' }
    ]
    var i = Math.floor(Math.random() * 4);

    this.setData({
      tipText: { 'name': this.t[i].name, 'num': this.t[i].num, 'time': this.t[i].time },
      imgUrls: this.data.imgUrls,
      showRedBox:'none'
    })


    setInterval(function () {
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    query.select('.tip').boundingClientRect()
    query.exec(function (res) {
      //res就是 所有标签为mjltest的元素的信息 的数组
      // console.log(res);
      //取高度
      // console.log(res[0].width);

      i = Math.floor(Math.random() * 4);
      
        // console.log('666');
        // 提示渐入
        this.tipFunc( res[0].width + 56 );
        
        this.setData({
          tipText: { 'name': this.t[i].name, 'num': this.t[i].num, 'time': this.t[i].time }
        })

        this.setData({
          W: res[0].width + 50
        })
    }.bind(this))

    }.bind(this), 6000)



   

    // 文字滚动
    // this.textScrollFunc();

  },
  
  onReady: function () {
    /*wx.chooseAddress({
      success: function (res) {
        console.log(res.userName)
        console.log(res.postalCode)
        console.log(res.provinceName)
        console.log(res.cityName)
        console.log(res.countyName)
        console.log(res.detailInfo)
        console.log(res.nationalCode)
        console.log(res.telNumber)
      }
    })*/
  },

  chooseAddress:function()
  {
    wx.chooseAddress({
      success: function (res) {
        wx.showModal({
          title: '收货地址',
          showCancel: false,
          content: '姓名：' + res.userName + ' ；地址：' + res.provinceName + res.cityName + res.countyName + res.detailInfo + ' ；电话：' + res.telNumber
        })
      }
    })
  },
  addrFunc:function()
  {
    var that = this;
    //先获取用户当前的设置
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.address']) {
          wx.authorize({
            scope: 'scope.address',
            success(res) {
              console.log(res.errMsg);//用户授权后执行方法
              that.chooseAddress();
            },
            fail(res) 
            {
              //用户拒绝授权后执行
              wx.openSetting({})
            }
          })
        }
        else
        {
          that.chooseAddress();
        }
      }
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
      showRedBox: 'none'
    })
  },

  // 显示红包
  scaleRedBoxFunc: function (redT )
  {
    this.money = Math.random().toFixed(2);

    this.animation = wx.createAnimation()
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
        redT: this.money+'元',
        isNone: ''
      })
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

    // console.log(W);
    this.animationTip.translateX(W).step().opacity(0).step()
    
    setTimeout(function(){
      this.animationTip2.translateX(0).opacity(1).step()
      this.setData({ animationTip: this.animationTip2.export() })
    }.bind(this),5800)

    this.setData({ animationTip: this.animationTip.export() })
  },



  // 旋转
 rotate: function () 
 { 
   if ( this.ing ) return false;
   this.ing = true;

   this.gf = {
     '1': '冬瓜茶6罐',
     '2': '传奇礼包',
     '3': '谢谢',
     '4': '绿力币',
     '5': '猫眼电影票',
     '6': '手气红包',
     '7': '德州扒鸡',
     '8': '现金红包'
   }

   this.gf_n = Object.keys(this.gf).length;

   this.rand_n = Math.floor(Math.random() * this.gf_n + 1);
   this.rand_ns += this.rand_n;

   this.r += 5 * 360 + 360 / this.gf_n * this.rand_n;
   this.animationR = wx.createAnimation({
      duration: 3000,
      timingFunction: 'ease'
   })
   this.animationR.rotate( this.r ).step()
  
   console.log('ns = ' + this.rand_ns + ' ; n = ' + this.rand_n + ' ; gf_n = ' + this.gf_n );

   this.gf_i = this.rand_ns % this.gf_n == 0 ? this.gf_n : (this.rand_ns > this.gf_n ? this.rand_ns % this.gf_n : this.rand_ns);

   console.log(this.gf_i + '   ' + this.gf[this.gf_i]);
  var that = this;
  setTimeout(function(){

    // 红包
    if (this.gf_i == '3' || this.gf_i == '6' || this.gf_i == '8' )
    {
      this.scaleRedBoxFunc(this.gf[this.gf_i] );
    }
    // 实物
    else if (this.gf_i == '1' || this.gf_i == '7' )
    {
      wx.showModal({
        title: '提示',
        content: '恭喜你抽中：' + this.gf[this.gf_i] + '（实物，需完善收货地址）',
        showCancel: false,
        success: function (res) {
          that.addrFunc();
        }
      })
    }
    else
    {
    wx.showToast({
      title: this.gf[ this.gf_i ],
      icon: 'none'
    })
    }
    this.ing = false;
  }.bind(this),3200)

   this.setData({ 
     animation: this.animationR.export(), 
    })
  },
   
  /*textScrollFunc: function () {
    // 页面显示
    var that = this;
    var length = that.data.text.length * that.data.size;//文字长度
    var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
    //console.log(length,windowWidth);
    that.setData({
      length: length,
      windowWidth: windowWidth
    });
    this.textScroll();
  },

  textScroll: function () {
    var that = this;
    var length = that.data.length;//滚动文字的宽度
    var windowWidth = that.data.windowWidth;//屏幕宽度
    if (length < windowWidth) {
      var interval = setInterval(function () {
        var maxscrollwidth = length + that.data.marquee_margin;//滚动的最大宽度，文字宽度+间距，如果需要一行文字滚完后再显示第二行可以修改marquee_margin值等于windowWidth即可
        var crentleft = that.data.marqueeDistance;
        if (crentleft < maxscrollwidth) {//判断是否滚动到最大宽度
          that.setData({
            marqueeDistance: crentleft + that.data.marqueePace
          })
        }
        else {
          //console.log("替换");
          that.setData({
            marqueeDistance: 0 // 直接重新滚动
          });
          clearInterval(interval);
          that.scrolltxt();
        }
      }, that.data.interval);
    }
    else {
      that.setData({ marquee_margin: "1000" });//只显示一条不滚动右边间距加大，防止重复显示
    }
  },*/


  //分享
  onShareAppMessage: function () {
    let that = this
    return {
      title: '测试标题',
      desc:'测试文本',
      path: '/pages/index/index',
      success: function (res) 
      {
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


  // 兑换 二次确认
  excGfFunc:function(e)
  {
    // console.log(e);
    wx.showModal({
      title: '提示',
      content: '你想拥有 ' + e.currentTarget.dataset.name + '？',
      confirmText:'想',
      cancelText:'不想',
      success: function (res) {
        setTimeout(function(){
          if (res.confirm) {
            wx.showLoading({
              title: '正在预约...',
            })
            setTimeout(function () {
              wx.showToast({
                title: '是你的了',
                icon: 'success'
              })
            }, 1000)

          } else if (res.cancel) {
            wx.showToast({
              title: '高冷的一逼',
              icon: 'none'
            })
          }
        },500)
      }
    })
  }

})