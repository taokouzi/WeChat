//scale.js
// var adUI = requiI/adUI')
//获取应用实例
var app = getApp()
Page({
  data: {
    token: '',
    request_url: app.config().request_url,     //请求地址
    stv: {
      offsetX: 0,
      offsetY: 0,
      zoom: false, //是否缩放状态
      distance: 0,  //两指距离
      scale: 1,  //缩放倍数
      w:1,

      windowWidth:'',

      is_login:0,
    },


    // 停车场集合
    radioParks: [
      // {
      // 'area_id':14,  //停车场id
      // 'name':'停车场1',  //停车场名称
      // // 'foors':[1,2,3],  //停车场楼层
      // 'checked':true    //停车场选中状态
      // },  
      // {
      // 'area_id':15,  //停车场id
      // 'name':'停车场2',  //停车场名称
      // // 'foors':[2],  //停车场楼层
      // 'checked':false    //停车场选中状态
      // },
    ],



    //所有楼层的集合 和 radioFoors 不同
    foors_all:[],

    // 停车场对应的楼层集合
    radioFoors: [
      // {
      // 'area_id':14,  //停车场id
      // 'name':'1',  //楼层
      // 'map':'http://oneh5.com/thq/LOCK/backend_api/./images/upload/20180112/41643458546.jpg?w=1400&h=1302',   //地图
      // 'w':1400,   //地图宽
      // 'h':1302,   //地图高
      // 'checked':true
      // },
      // {
      // 'area_id':14,  //停车场id
      // 'name':'2',  //楼层
      // 'map':'http://oneh5.com/thq/LOCK/backend_api/./images/upload/20180112/41643458546.jpg?w=1400&h=1302',   //地图
      // 'w':1400,   //地图宽
      // 'h':1302,   //地图高
      // 'checked':false
      // },
      // {
      // 'area_id':15,  //停车场id
      // 'name':'2',  //楼层
      // 'map':'http://oneh5.com/thq/LOCK/backend_api/./images/upload/20180112/41643458546.jpg?w=1400&h=1302',   //地图
      // 'w':1400,   //地图宽
      // 'h':1302,   //地图高
      // 'checked':false
      // }
    ],

    // 地图集合
    maps:{},


    // status状态
    car_made_status: {
      '1': '可用',
      '2': '故障',
      '3': '占用',
      '4': '休眠中',
      '5': '占用',
      '6': '异常',
      '7': '占用',
      '8': '被其他人预约中...',
      '16': '被我停车',   //自己停车
      '17': '被我开锁',   //自己停车
      '19': '可用',   //自己预约
      '99':'无权限'
    },

    //停车场选择
    park_isHide:true,


    //楼层选择
    foor_isHide: true,
    foor_toggle: false,


    // 用户选择的停车场
    user_park:1,

    // 用户选择的楼层
    user_foor: 1,

    //地锁编号
    lock_no:'',
    
    // 预约时间
    y_time_i: 0,
    // y_times:['5分钟','10分钟','20分钟','30分钟','60分钟'],
    y_times: [],

    // 我预约的车位
    my_cars:[],

    // 剩余车位
    sy_cars:[],

    // 拖动放大  当前值的上一次值
    pre_num:0,


  },


  //图片加载完成后 可获取该图片的实际尺寸
  mapOnLoadFunc(ev) 
  {
    var w = ev.detail.width;
    var h = ev.detail.height;
    // console.log( '图片的原始尺寸（测试数据，此项目无效） w = '+w+'  ; h = '+h );
  },


  onLoad: function (options) {
    // console.log(options);
    var that = this;

    wx.showLoading({
      title: '加载中...',
    }) 

    
    // var area_id = wx.getStorageSync('area_id');
    // var foor_id = wx.getStorageSync('foor_id');

    // console.log('默认area_id = '+area_id+'  ; foor_id = '+foor_id);

    // that.showInfoFunc(that,area_id,foor_id,'load');

  },



  onShow: function () {
    
    var that = this;
    var token = wx.getStorageSync('token');

    console.log(' ========  ' + token);
    if (!token || token == '' || token == null || token == undefined) {
      // 去登录
      that.goLoginFunc();
    }
    else {
      that.setData({
        token: token,
        is_login: 1
      })

      that.showParkAndFoorFunc(that,token);
    }


    that.setData({
      user_park: wx.getStorageSync('user_park'),
      user_foor: wx.getStorageSync('user_foor'),
      sx_img: './images/sx.png'
    })
    
    console.log('刷新1');
    // that.sxFunc('jt_sx');

  },

  // 去登录
  goLoginFunc:function()
  {
    var that = this;
    that.setData({
      is_login: 0
    })

    wx.redirectTo({
      url: '../login/index?from=app'
    })
    return false;
  },
  
  
  //默认停车场、楼层展示
  showParkAndFoorFunc:function( that,token )
  {
    wx.request({
      url: that.data.request_url + 'list.php?action=get_area',
      data: {
        token: token,
        client:'mp'
      },
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) 
      {
        console.log(res);	
        console.log('默认停车场、楼层展示');
        if (res.data.code == 1) 
        {  
          var parks = [],   //停车场集合
              foors_all = [],   //所有楼层集合
              foors = [],   //停车场对应楼层集合
              foor_id,
              checked_p,  
              checked_f,
              map_wh, 
              maps = {},
              area_id_loc,
              foor_id_loc
              ;

          var area_id_o = wx.getStorageSync('area_id');
          var foor_id_o = wx.getStorageSync('foor_id');

          for (var i in res.data.datas )
          {
            // console.log(res.data.datas);

            //查看本地存储中有无停车场id 即area_id_o
            //如果有
            if( area_id_o )
            {
              //遍历停车场集合 当area_id = 存储中的id时
              if( res.data.datas[i].area_id == area_id_o )
              {
                checked_p = true;
              }
              else
              {
                checked_p = false;
              }
            }
            //否则默认显示数组第一
            else
            {
              checked_p = i == 0 ? true : false;
            }




            //停车场数组
            parks.push(
              {
                'area_id':res.data.datas[i].area_id,
                'name':res.data.datas[i].area_name,
                'checked':checked_p
              }
            );


            //遍历解析楼层
            for( var j in res.data.datas[i].floors )
            {


              //解析地图尺寸w、h
              if (res.data.datas[i].floors[j].map.indexOf('w=') != -1 && res.data.datas[i].floors[j].map.indexOf('&h=') != -1) 
              {
                map_wh = res.data.datas[i].floors[j].map.split('w=')[1].split('&h=');
              }
              //否则
              else 
              {
                map_wh = ['1400', '1300'];
              }



              //默认第一个楼层为选中状态
              if( res.data.datas[i].area_id == area_id_o && foor_id_o ){

                if( res.data.datas[i].floors[j].floor == foor_id_o )
                {
                  checked_f = true;
                }
                else
                {
                  checked_f = false;
                }
              }
              else
              {
                checked_f = j == 0 ? true : false;
              }
              

              var foor_new;
              var foorRes = parseFloat(res.data.datas[i].floors[j].floor);
              if (foorRes > 10 )
              {
                foor_new = foorRes -10;
              }
              else
              {
                foor_new = -foorRes;
              }
              
              //楼层数组
              foors_all.push( 
                {
                  'area_id':res.data.datas[i].area_id,
                  'name':res.data.datas[i].floors[j].floor + 'F', //楼层
                  'foor_new': foor_new + 'F',//楼层  新增
                  'foor_id':res.data.datas[i].floors[j].floor, //楼层id
                  'map':res.data.datas[i].floors[j].map, 
                  'w':map_wh[0],
                  'h':map_wh[1], 
                  'checked':checked_f
                } 
              );

            }

          }
            
        }

        // console.log(parks);
        // console.log(foors_all);


        //解析楼层及地图
        for( var i in parks )
        {
          if( parks[i].checked )
          {

            for( var j in foors_all )
            {

              if( foors_all[j].area_id == parks[i].area_id )
              {
                //根据停车场解析对应楼层
                foors.push(
                  {
                    'area_id':foors_all[j].area_id,
                    'name':foors_all[j].name,
                    'foor_new': foors_all[j].foor_new,
                    'map':foors_all[j].map,
                    'foor_id':foors_all[j].foor_id,
                    'w':foors_all[j].w,
                    'h':foors_all[j].h,
                    'checked':foors_all[j].checked
                  }
                )

                
                // 默认存储停车场第一个数组楼层
                area_id_loc = foors_all[0].area_id;
                foor_id_loc = foors_all[0].foor_id;


                //根据停车场和楼层 解析显示对应地图
                if( foors_all[j].checked )
                {
                  maps = {
                    'map':foors_all[j].map,
                     'w': foors_all[j].w ,
                     'h': foors_all[j].h 
                  };
                }
                

              }
            }
          }
          
        }

        // console.log(maps);

        
        console.log(maps);
        that.setData({
          radioParks: parks,
          foors_all:foors_all,
          radioFoors: foors,
          maps: maps
        })

        // console.log('kkk02  a_id = '+area_id_loc+'  ;  f_id = '+foor_id_loc);


        //取本地存储
        var area_id_k = area_id_o;
        var foor_id_k = foor_id_o;

         // 如果没有，就默认为第一个===================================================================================
        if( !area_id_o || area_id_o == undefined || area_id_o == null )
        {
          wx.setStorageSync('area_id',area_id_loc);
          area_id_k = area_id_loc;
        }

        if( !foor_id_o || foor_id_o == undefined || foor_id_o == null )
        {
          wx.setStorageSync('foor_id',foor_id_loc);
          foor_id_k = foor_id_loc;
        }
        // ===================================================================================


        that.setMapSizeFunc( that,maps );

        // console.log('测试11');
        that.showInfoFunc(that, area_id_k, foor_id_k,'load');

      }
    })
  },

  //点击蒙层啊啊啊   草拟吗
  cnmFunc: function (e) 
  {
    var cnm = e.target.id;
    var content, confirmText, url;

    if (cnm == 2 )
    {
      wx.showModal({
        title: '系统提示',
        content: '审核失败，请修改后重新提交',
        showCancel: false,
        confirmText: '检查资料',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../user_edit/index'
            })
          }
        }
      })
    }
    else if( cnm == 3 )
    {
      wx.showModal({
        title: '系统提示',
        content: '状态异常，请联系管理员处理',
        confirmText: '联系客服',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../about/index'
            })
          }
        }
      })
    }
   /* else if (cnm == 9 )
    {
      wx.showModal({
        title: '系统提示',
        content: '您当前暂未填写资料',
        showCancel: false,
        cancel: false,
        confirmText: '填写资料',
        success: function (res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '../user_edit/index'
            })
          }
        }
      })
    }*/

  },

  //默认展示地图 车位分布
  showInfoFunc: function (that, area_id, floor_id,r_type ){
    
    // console.log('调用地图 area_id = '+area_id+' ; floor_id = '+floor_id);
    
    if( r_type == 'sx' )
    {
      wx.showLoading({
        title: '刷新中...',
      })

      // that.setData({
      //   sx_img:'./images/sx.gif'
      // })

    }

    var token = wx.getStorageSync('token');
    // console.log(area_id + '   ;  ' + floor_id + '  ;  ' + token);
    wx.request({
      url: that.data.request_url + 'list.php?action=get_parking',
      data: {
        area_id: area_id,
        floor: floor_id,
        token:token,
        client:'mp'
      },
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) 
      {
        // console.log(res);
        // console.log('啊啊啊');
        if( res.data.code == 1 )
        {
        	// console.log(res.data.user_status+'  ------');
          var is_pass = true;

          // 预约时间数组
          for (var i = res.data.order_min; i <= res.data.order_max; i++) {
            that.data.y_times.unshift(i + '分钟');
          }
          that.setData({
            y_times: that.data.y_times
          })


        	if( res.data.user_status != '0' )
        	{
        		setTimeout(function(){
		            wx.hideLoading();
		        },1000)
        	}

          //提示用户未填写资料，并跳转到资料填写页
          /*if( res.data.user_status == '9' )
          {
            wx.showModal({
                title: '系统提示',
                content: '您当前暂未填写资料',
                showCancel: false,
                cancel:false,
                confirmText:'填写资料',
                success: function (res) {
                  if(res.confirm)
                  {
                    wx.redirectTo({
                      url: '../user_edit/index'
                    })
                  }
                }
              })

            // return false;
          }*/
          
          //审核失败
          if( res.data.user_status == '2' )
          {
            wx.showModal({
              title: '系统提示',
              content: '审核失败，请修改后重新提交',
              confirmText:'修改资料',
              success: function (res) 
              {
                // 去修改资料
                if(res.confirm)
                {
                  wx.navigateTo({
                    url: '../user_edit/index'
                  })
                }
                // 取消 请求接口改变用户审核状态为9
                else
                {
                  wx.request({
                    url: that.data.request_url + 'userinfo.php?action=cancel_bind',
                    data: {
                      token: that.data.token,
                    },
                    method: 'GET',
                    header: { 'content-type': 'application/json' },
                    success: function (res) 
                    {
                      // console.log(res);
                    }
                  });
                }
              }
            })
            // return false;
          }
          
          //其余情况，被注销，显示遮罩：请联系管理员处理
          else if( res.data.user_status == '3' )
          {	
            wx.showModal({
              title: '系统提示',
              content: '状态异常，请联系管理员处理',
              confirmText:'联系客服',
              showCancel: false,
              success: function (res) {
                if(res.confirm)
                {
                  wx.navigateTo({
                    url: '../about/index'
                  })
                }
              }
            })

            // return false;
          }

          //审核中。。。
          else if( res.data.user_status == '0' )
          {
            wx.showLoading({ 
              title: '资料审核中',
              mask:true
            })

            return false;
          }
          else
          {
            is_pass = false;
            
            var floor_id_new;
            if (parseFloat(floor_id)>10 )
            {
              floor_id_new = parseFloat(floor_id)-10;
            }
            else
            {
              floor_id_new = -parseFloat(floor_id);
            }

            that.setData({
              car_datas: res.data.datas,
              // company_id: res.data.company_id,
              foor_id: floor_id_new,//floor_id,
           //   useful: res.data.useful,      //剩余车位数
            })

          }
          

          // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxx is_pass = '+is_pass);
          that.setData({
            is_pass:is_pass,
            alert_id: res.data.user_status
          })
          

          if( r_type == 'sx' )
          {
            wx.showToast({
              title: '刷新成功',
              icon: 'success'
            })

            // that.setData({
            //   sx_img:'./images/sx.png'
            // })
          }
          


          var my_cars = [], sy_cars = [];

          // 遍历出我预约的车位  剩余车位
          for( var i in res.data.datas )
          { 

            // 我的预约
            if ( res.data.datas[i].status == '19' )
            {
              my_cars.push({ 'parking_no': res.data.datas[i].parking_no, 
                             'parking_type': res.data.datas[i].parking_type,
                             'parking_size': res.data.datas[i].parking_size,
                             'lock_no': res.data.datas[i].lock_no,
                             'status': res.data.datas[i].status
                            })
            }

            // 剩余车位
            if (res.data.datas[i].status == '1' /*&& res.data.datas[i].company_id == res.data.company_id*/ )
            {
              sy_cars.push({
                'parking_no': res.data.datas[i].parking_no,
                'parking_type': res.data.datas[i].parking_type,
                'parking_size': res.data.datas[i].parking_size,
                'lock_no': res.data.datas[i].lock_no,
                'status': res.data.datas[i].status
              })
            }
          }



          

          // console.log(sy_cars);

          that.setData({
            my_cars: my_cars,
            sy_cars:sy_cars,
            my_title:'我的预约',
            sy_title:'剩余车位',
            useful: sy_cars.length,
            my_car_none:'还没有预约车位哦~',
            sy_car_none: '没有剩余车位了哦~'
          })

        }
        else if( res.data.code == '9003' )
        {
          wx.showToast({
            title: '无车位数据',
            icon: 'none'
          })
        }
        else if (res.data.code == '9012' )
        {
          wx.setStorageSync('token','');
          that.goLoginFunc();
        }
        else
        {
          // console.log('默认车位显示错误,详情如下');
          // console.log(res);

          if( r_type == 'sx' )
          {
            wx.showToast({
              title: '刷新失败',
              icon: 'loading'
            })
          }
        }
      },
      error:function()
      {
        console.log('error');
      }
    })
  },



  //选择停车场
  radioParkFunc: function (e) {
    // console.log(e);

    wx.showLoading({title: '地图加载中...'})

    var checked = e.detail.value.split('||')[0];
    var area_id = e.detail.value.split('||')[1];
    var that = this;

    var changed = {};
    
    for (var i = 0; i < this.data.radioParks.length; i++) 
    {
      if (checked.indexOf(this.data.radioParks[i].name) !== -1) 
      {
        changed['radioParks[' + i + '].checked'] = true
      } 
      else {
        changed['radioParks[' + i + '].checked'] = false
      }
    }

    this.setData(changed);


    //选择停车场时 改变为相应楼层
    var foors = [],foor_id,foor_id_arr=[];

    for( var i in that.data.foors_all )
    {
      if( that.data.foors_all[i].area_id == area_id )
      {

        //同停车场下，楼层id集合
        foor_id_arr.push(that.data.foors_all[i].foor_id);
      
        foors.push({
          'area_id':that.data.foors_all[i].area_id,
          'foor_id':that.data.foors_all[i].foor_id,
          'name':that.data.foors_all[i].name,
          'map':that.data.foors_all[i].map, 
          'w':that.data.foors_all[i].w,
          'h':that.data.foors_all[i].h,
          'checked':that.data.foors_all[i].checked
        })
        
      }
    } 

    that.setData({
      radioFoors:foors
    })

    // var foor_id_loc = wx.getStorageSync('foor_id');
    // console.log(foor_id_loc);
    //切换停车场时 默认展示该停车场第一个楼层信息
    // if( foor_id_loc )
    // {
    //   foor_id = foor_id_loc;
    // }
    // else
    // {
    //   foor_id = foor_id_arr[0];
    // }
    
    foor_id = foor_id_arr[0];     //可继续完善

    // console.log('kk01 = '+area_id);
    wx.setStorageSync('area_id',area_id);
    wx.setStorageSync('foor_id',foor_id);

    // console.log('测试44');
    // console.log('选择停车场 默认第一个楼层area_id = '+area_id+'  ; foor_id = '+foor_id);
    that.showInfoFunc(that,area_id,foor_id,'s_park');

    that.showParkAndFoorFunc(that, that.data.token);
  },



  //选择楼层
  radioFoorFunc: function (e) {
    // console.log(e);
    wx.showLoading({ title: '地图加载中...' })
    var that = this;
    let sel_foor = e.currentTarget.id;

    var changeFoor = {};

    for (var i = 0; i < this.data.radioFoors.length; i++) 
    {
      if (sel_foor.indexOf(this.data.radioFoors[i].name) !== -1) 
      {
        changeFoor['radioFoors[' + i + '].checked'] = true
      } 
      else {
        changeFoor['radioFoors[' + i + '].checked'] = false
      }
    }

    this.setData(changeFoor);



    //选择楼层时 改变为相应地图信息
    var area_id,foor_id;
    for( var i in that.data.radioFoors )
    {
      if( that.data.radioFoors[i].name == sel_foor )
      {
        area_id = that.data.radioFoors[i].area_id;
        foor_id = that.data.radioFoors[i].foor_id;
      }

    }

    // console.log( that.data.radioFoors );

    // console.log( area_id +' ; ' + foor_id );


    // wx.setStorageSync('area_id',area_id);
    wx.setStorageSync('foor_id',foor_id);

    // console.log('测试33');
    that.showInfoFunc(that,area_id,foor_id,'s_foor');

    that.showParkAndFoorFunc(that, that.data.token);
  },





  //显示停车场
  showParkFunc: function () {
    var that = this;
    that.menuAnimationShowFunc(that,'x',0);
  },

  //隐藏停车场
  hideParkFunc: function () {
    var that = this;
    that.menuAnimationHideFunc(that, 'x', 0);
  },



  // 显示楼层（隐藏楼层）
  foorFunc: function () {
    // console.log(this);
    var v = !this.data.foor_toggle;

    this.setData({
      foor_isHide: false,
      foor_toggle:v
    })
  },




  // 刷新
  sxFunc: function ( is_sx ) {

    var that = this;
    var sx;

    if( is_sx == 'jt_sx' )
    {
		sx = ' ';
    }
    else
    {
		sx = 'sx';
    }

    // that.showParkAndFoorFunc(that);
    
    var area_id = wx.getStorageSync('area_id');
    var foor_id = wx.getStorageSync('foor_id');

    // console.log('刷新area_id = '+area_id+'  ; foor_id = '+foor_id);
    // console.log('测试22');
    that.showInfoFunc(that,area_id,foor_id,sx);

  },










  //点击车位 弹出可操作详情
  showCarFunc: function (e) 
  {
    // console.log(e);
    var that = this;

    // 点击车位（我的预约），隐藏我的预约 显示车位详情   05-25
    that.myReserveHideFunc();

    
    var car_id = e.target.id;
    var lock_name = '开锁',
        lock_id = '1',      //0关锁  1开锁
        disabled_type,
        is_yu = '';
    
    // console.log('状态 = ' + e.target.dataset.status);

    //预约 开锁 故障 取消  -- 正常可用状态+‘绿色’
    if (e.target.dataset.status == '1' ) 
    {
      disabled_type = '';
    }

    //关锁 故障 取消 -- 被自己占用+‘红色/停’
    else if ( e.target.dataset.status == '16' || e.target.dataset.status == '17' )
    {
      lock_name = '关锁';
      lock_id = '0';
      disabled_type = '';
    }

    //取消 别人预约  -- 他人预约+‘红色/预’
    else if (e.target.dataset.status == '8') {
      disabled_type = 'disabled';
      is_yu = '预';
    }
    //取消预约 开锁 故障 取消  -- 自己预约中+‘绿色/预’
    else if (e.target.dataset.status == '19') 
    {
      disabled_type = '';
      is_yu = '预';
    }
    //取消  禁用开/关锁，预约，故障申报（2故障 3被他人占用 4休眠 5被他人占用 6异常 7被他人占用 99无权限）
    else
    {
      disabled_type = 'disabled';
    }

    


    if (car_id )
    {
      // console.log(car_id);
      that.menuAnimationShowFunc(that, 'y', e.target.dataset.status);

      that.setData({
        car_title: car_id,
        car_status: e.target.dataset.status,
        car_size: e.target.dataset.size,
        car_type: e.target.dataset.type,
        lock_no: e.target.dataset.ln,
        lock_tatus: e.target.dataset.status,
        lock_name: lock_name,
        lock_id: lock_id,
        disabled_type: disabled_type,
        is_yu:is_yu
      })
    }
    else
    {
      console.log('点飘了！');
    }

  },





  // 点击预约车位（用户开始选择时间）
  resvCarTimeFunc:function(e){

    var that = this;
    var lock_no = e.target.dataset.id;
    var status = e.target.dataset.status;
    
    that.menuAnimationHideFunc(that, 'y',status);

    that.menuAnimationShowFunc(that,'y_t','y_t');

  },



  //点击取消预约车位
  unResvCarTimeFunc:function(e)
  {
    var that = this;
    var lock_no = e.target.dataset.id;
    var status = e.target.dataset.status;

    wx.showLoading({title: '取消中...'})
    // console.log(lock_no + '   ' + that.data.token);
    wx.request({
      url: that.data.request_url + 'reserve.php?action=unreserve',
      data: {
        lock_no: lock_no,
        token: that.data.token,
      },
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res);
        if( res.data.code == 1 )
        {
          wx.showToast({
            title: '取消预约',
            icon: 'success'
          })
          console.log('刷新5');
          that.sxFunc('jt_sx');

        }
        else
        {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }

        that.menuAnimationHideFunc(that, 'y',status);

      }
    })


  },


  //隐藏车位（时间选择）
  hideCarTimeFunc: function (e) 
  {
    var that = this;

    that.menuAnimationHideFunc(that, 'y_t', 'y_t');
  },


  //选择预约车位时间
  companyNameChangeFunc2: function (e) {
    this.setData({
      y_time_i: e.detail.value
    })
  },




  // 点击预约车位（已选择时间）
  resvCarFunc:function(e){

    var that = this;
    var lock_no = e.target.dataset.id;

    // 提交用户预约的时间给后端 7/17
    var reserve_long = e.target.dataset.time.split('分钟')[0];

    wx.showLoading({title: '预约中...'})

    wx.request({
      url: that.data.request_url + 'reserve.php?action=reserve',
      data: {
        reserve_long: reserve_long,
        lock_no: lock_no,
        token: that.data.token,
      },
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        // console.log(res);
        
        if (res.data.code == 1) {

          wx.showToast({
            title: '预约成功！',
            icon: 'success'
          })
          console.log('刷新4');
          that.sxFunc('jt_sx');

        }
        else
        {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }

        that.menuAnimationHideFunc(that, 'y_t', 'y_t');

      }
    })
  },



  //隐藏车位
  hideCarFunc: function (e) {
    var that = this;

    that.menuAnimationHideFunc(that, 'y', e.target.dataset.status);
  },

  

  //开锁
  openLockFunc:function(e){
    var that = this;
    // console.log(e);
    // console.log(e.currentTarget.dataset.id);
    
    var made_lock = e.currentTarget.dataset.id;     //0关锁  1开锁

    wx.request({
      url: that.data.request_url + 'net_lock.php?action=push',
      data: {
        status: made_lock, 
        lock_no: that.data.lock_no,
        token: that.data.token,
      },
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res);

        if( res.data.code == 1 )
        {
          if ( made_lock == '1' )
          {
            wx.showLoading({
              title: '开锁中...',
            })
          }
          else
          {
            wx.showLoading({
              title: '关锁中...',
            })
          }
          
          that.openLockLoopFunc( made_lock );

        }
        else
        {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            confirmText: '知道了',
            success: function (res) {
              
            }
          })

        }
        
        that.menuAnimationHideFunc(that, 'y', '1');

      }
    })
  },


  

  //开锁轮询
  openLockLoopFunc: function (made_lock )
  {

    var that = this;

    //订单超时30s
    var poll_times = 30;

    var timer_l = setInterval(function () {

      poll_times--;

      //如果订单超时
      if (poll_times <= 0) 
      {
        wx.showToast({
          title: '超时！',
          icon: 'loading'
        })

        clearInterval(timer_l);
        console.log('刷新3');
        that.sxFunc('jt_sx');

        return false;

      }

      // console.log(poll_times);

      wx.request({
        url: that.data.request_url + 'net_polling.php',
        data: {
          action:'polling',
          lock_no: that.data.lock_no,
          token: that.data.token,
        },
        method: 'GET',
        header: { 'content-type': 'application/json' },
        success: function (res) {
          // console.log(res);
          if (res.data.code == 1) 
          {   
              if (made_lock == '1' )
              {
                wx.showToast({
                  title: '开锁成功',
                  icon: 'success'
                })
              }
              else
              {
                wx.showToast({
                  title: '关锁成功',
                  icon: 'success'
                })
              }

              clearInterval(timer_l);


              console.log('刷新2');
              // 开锁/关锁成功后 刷新车位
              var sx_n = 0;
              var shuax = setInterval(function(){
                sx_n++;
                that.sxFunc('jt_sx');
                if (sx_n > 5 )
                {
                  clearInterval(shuax);
                }
              },1200)
              
          }
        }
      })

    }, 1000)
  },
  


  //设置地图尺寸
  setMapSizeFunc:function( that,maps ){

    // 地图宽
    var map_w = parseFloat(maps.w);

    // 地图高
    var map_h = parseFloat(maps.h);
    
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          coef: res.windowWidth / map_w,
          min_w: res.windowWidth,
          min_h: res.windowWidth * map_h / map_w
        })
      }
    });



  },





  




  // 故障申报
  faultDeclareFunc:function(e){
    // console.log(e);
    var car_id = e.currentTarget.dataset.carid;
    var lock_id = e.currentTarget.dataset.lockid;

    wx.navigateTo({
      url: '../fault/index?car_id=' + car_id + '&lock_id=' + lock_id
    })

  },



  //点击放大
  enlargeFunc: function (e){
   
    var newScale = e.currentTarget.dataset.id;

    newScale += 0.25;

    if (newScale > 4) {
      newScale = 4;
      wx.showToast({
        title: '地图已是最大了',
        icon: 'none'
      })

    }


    this.setData({
      'stv.scale': newScale,
    })
  },


  //点击缩小 
  narrowFunc: function (e){
    var newScale = e.currentTarget.dataset.id;

    newScale -= 0.25;

    if (newScale < 1 )
    {
      newScale = 1;
      wx.showToast({
        title: '地图已是最小了',
        icon: 'none'
      })
    }

    this.setData({
      'stv.scale': newScale,
    })
  },

















  // 显示我的预约
  myReserveShowFunc:function(){
    var that = this;

    that.menuAnimationShowFunc(that, 'y_my', 'sy');

    that.setData({
      cars: that.data.my_cars,
      my_title: '我的预约',
      my_car_none: '还没有预约车位哦~'
    })

  },

  // 隐藏我的预约
  myReserveHideFunc: function () {
    var that = this;

    that.menuAnimationHideFunc(that, 'y_my', 'sy');
  },






  // 显示剩余车位
  syCarShowFunc: function () {
    var that = this;
    that.menuAnimationShowFunc(that, 'y_my', 'sy');

    that.setData({
      cars: that.data.sy_cars,
      my_title: '剩余可用车位',
      my_car_none: '没有剩余可用车位了哦~'
    })

  },



















   /**地图操作（缩放/拖动）***/
  touchstartCallback: function (e) {
    // console.log('开始');
    // console.log(e);
    //触摸开始
    //（单指）
    if (e.touches.length === 1)
    {
      let { clientX, clientY } = e.touches[0];
      this.startX = clientX;
      this.startY = clientY;
      this.touchStartEvent = e.touches;
    }
    //（双指）
    else 
    {
      // let xMove = e.touches[1].clientX - e.touches[0].clientX;
      // let yMove = e.touches[1].clientY - e.touches[0].clientY;
      // let distance = Math.sqrt(xMove * xMove + yMove * yMove);
      // this.setData({
      //   'stv.distance': distance,
      //   'stv.zoom': true, //缩放状态
      // })
    }

  },
  touchmoveCallback: function (e) {
    //触摸移动中
    // console.log('移动中');
    // console.log(e);

    if (e.touches.length === 1) 
    {
      //单指移动
      if (this.data.stv.zoom) 
      {
        //缩放状态，不处理单指
        return;
      }
      let { clientX, clientY } = e.touches[0];
      let offsetX = clientX - this.startX;
      let offsetY = clientY - this.startY;
      this.startX = clientX;
      this.startY = clientY;
      let { stv } = this.data;
      stv.offsetX += offsetX;
      stv.offsetY += offsetY;
      stv.offsetLeftX = -stv.offsetX;
      stv.offsetLeftY = -stv.offsetLeftY;
      this.setData({
        stv: stv
      });

    } 
    else 
    {
      //双指缩放
      // let xMove = e.touches[1].clientX - e.touches[0].clientX;
      // let yMove = e.touches[1].clientY - e.touches[0].clientY;
      // let distance = Math.sqrt(xMove * xMove + yMove * yMove);

      // let distanceDiff = distance - this.data.stv.distance;
      // let newScale = this.data.stv.scale + 0.005 * distanceDiff;

      // if (newScale < 1 )
      // {
      //   newScale = 1;
      //   wx.showToast({
      //     title: '已经是最小了o',
      //     icon: 'success'
      //   })
      // }

      // this.setData({
      //   'stv.scale': newScale,
      // })
      wx.showToast({
        title: '不支持手势缩放，请点击右下方"+"、"-"操作地图',
        icon: 'none'
      })
    }

  },
  touchendCallback: function (e) {
    //触摸结束
    // console.log('结束');
    // console.log(e);

    if (e.touches.length === 0) {
      this.setData({
        'stv.zoom': false, //重置缩放状态
      })
    }
  },
  /**地图操作（缩放/拖动）end***/



  //显示菜单
  menuAnimationShowFunc: function (that,fx,car_status)
  {
    var datas = that.myAnimataFunc(that, car_status, 'ease');
    var animation = datas.animation;
    var car_m_height = datas.car_m_height;

    //停车场（右侧进入）
    if ( fx == 'x' )
    {
      animation.translateX(220).step();
      that.setData({
        animationPark: animation.export(),
        showParkStatus: true
      });

    }
    // 底部进入
    else
    {
      animation.translateY( car_m_height ).step();

      //车位详情
      if (fx == 'y' )
      {
        that.setData({
          animationCar: animation.export(),
          showCarStatus: true
        });
      }
      //预约时间
      else if (fx == 'y_t')
      {
        that.setData({
          animationCarTime: animation.export(),
          showCarTimeStatus: true
        });
      }
      // 我的预约
      else if (fx == 'y_my') 
      {
        that.setData({
          animationMyCarTime: animation.export(),
          showMyCarStatus: true
        });
      }
    }


    setTimeout(function () {
      //停车场（右侧进入）
      if (fx == 'x') 
      {
        animation.translateX(0).step();
        that.setData({
          animationPark: animation.export()
        })
      }
      //车位详情
      else
      {
        animation.translateY(0).step();
        //车位详情
        if (fx == 'y') 
        {
          that.setData({
            animationCar: animation.export()
          });
        }
        //预约时间
        else if (fx == 'y_t') 
        {
          that.setData({
            animationCarTime: animation.export()
          });
        }
        // 我的预约
        else if (fx == 'y_my') 
        {
          that.setData({
            animationMyCarTime: animation.export()
          });
        }
      }

    }.bind(that), 200)

  },


  //隐藏菜单
  menuAnimationHideFunc: function (that, fx, car_status) 
  {
    var datas = that.myAnimataFunc(that, car_status, 'linear');
    var animation = datas.animation;
    var car_m_height = datas.car_m_height;

    //停车场（右侧进入）
    if (fx == 'x') 
    {
      animation.translateX(220).step();
      that.setData({
        animationPark: animation.export(),
      })
    }
    // 底部进入
    else
    {
      animation.translateY(car_m_height).step();
      //车位详情
      if (fx == 'y') 
      {
        that.setData({
          animationCar: animation.export()
        });
      }
      //预约时间
      else if (fx == 'y_t') 
      {
        that.setData({
          animationCarTime: animation.export()
        });
      }
      // 我的预约
      else if (fx == 'y_my') 
      {
        that.setData({
          animationMyCarTime: animation.export()
        });
      }
    }


    setTimeout(function () {

      //停车场
      if (fx == 'x') 
      {
        animation.translateX(0).step();

        that.setData({
          animationPark: animation.export(),
          showParkStatus: false
        })
      }
      //车位详情
      else  if (fx == 'y') 
      {
        animation.translateY(0).step();

        that.setData({
          animationCar: animation.export(),
          showCarStatus: false
        })
      }
      //预约时间
      else  if (fx == 'y_t') 
      {
        animation.translateY(0).step();

        that.setData({
          animationCarTime: animation.export(),
          showCarTimeStatus: false
        })
      }
      //我的预约
      else if (fx == 'y_my') 
      {
        animation.translateY(0).step();

        that.setData({
          animationMyCarTime: animation.export(),
          showMyCarStatus: false
        })
      }

    }.bind(that), 200)
  },



  // 0524
  myAnimataFunc: function (that, car_status, timingFunction)
  {
    var car_m_height;

    if (car_status == '1' || car_status == '19') 
    {
      car_m_height = 520
    }
    else if (car_status == 'y_t' || car_status == 'sy') 
    {
      car_m_height = 260;
    }
    else 
    {
      car_m_height = 460;
    }

    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: timingFunction,
      delay: 0
    })

    that.animation = animation;

    var datas = {
      'animation': animation,
      'car_m_height': car_m_height
    }
    return datas;
  },



  zoomFunc:function(e){
    // console.log(e);
    var that = this;

    var newScale = e.target.dataset.id;
    // console.log('newScale = ' + newScale);

    var pre_num = that.data.pre_num;
    var now_num = e.detail.value;

    // console.log('pre_num = ' + pre_num);
    // console.log('now_num = ' + now_num);

    that.setData({
      pre_num: now_num
    })
    


    if ( pre_num > now_num )
    {
      // console.log('减');
      

      now_num -= 0.01;

      if (now_num <= 1) {
        now_num = 1;
        wx.showToast({
          title: '地图不能再缩小了哦',
          icon: 'none'
        })

      }


      this.setData({
        'stv.scale': now_num,
      })








    }
    else if (pre_num < now_num)
    {
      // console.log('加');
    
      now_num += 0.01;

      if (now_num > 4) {
        now_num = 4;
        wx.showToast({
          title: '地图不能再放大了哦',
          icon: 'none'
        })

      }


      this.setData({
        'stv.scale': now_num,
      })



    }
  },




  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) 
  {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '容易停',
      // imageUrl:'./images/share_img.jpg',
      path: '/pages/index/index?id=share'
    }
  },



  

  

})
