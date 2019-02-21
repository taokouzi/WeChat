// pages/fault/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: '',
    request_url: app.config().request_url,     //请求地址
    
    // comps: ['单位1', '单位2', '单位3'],

    comp_i: 0,
    comps:[
     // '单位1', '单位2', '单位3'
    ],

    comps_all:[],



    dptms_all:[],
    dptms: [
      // '部门1', '部门2', '部门3'
    ],
    dptm_i: 0,



    tel:'',
    car_img:'./images/bg.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    // that.showComAndDepartFunc(0);

    wx.showLoading({
      title: '加载中...',
    })

    var token = wx.getStorageSync('token');
    var tel = wx.getStorageSync('tel');

    if (!token || token == null || token == undefined || token == '') {
      wx.redirectTo({
        url: '../login/index?from=app'
      })
      return false;
    }

    that.setData({
      token: token,
      tel: tel
    })

 
    that.showUserInfoFunc(that);

    // console.log(that.data.comps);
    // console.log(that.data.dptms);

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () 
  {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


  

  // 单位名称
  companyNameChangeFunc: function (e) {
    // console.log(e);

    var that = this;
    var comp_i = e.detail.value;
    
    this.setData({
      comp_i: comp_i
    })
    // console.log(that.data.comps);
    var company_name = that.data.comps[comp_i];

    that.showComAndDepartFunc(company_name,'test_data' );

  },


  // 部门名称
  departmentNameChangeFunc: function (e) {
    this.setData({
      dptm_i: e.detail.value
    })
  },



  // 上传照片
  carImgChangeFunc:function(){
    var that = this;
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认1
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
    //  sourceType: ['camera','album'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        wx.showLoading({
          title: '照片上传中...',
        })
       var tempFilePath = res.tempFilePaths;
       console.log('上传照片token = ' + that.data.token);
       wx.uploadFile({
         url: that.data.request_url + 'userinfo.php?action=car_img',
          filePath: tempFilePath[0],
          name: "car_img",
          formData: {
            token: that.data.token
          },
          success: function (res) {
            console.log(res);

            if (JSON.parse(res.data).code == 1) 
            {
              that.setData({
                car_img: JSON.parse(res.data).car_img,
              })

              wx.showToast({
                title: '照片上传成功',
                icon: 'success',
                duration: 1000
              })

            }
            else {
              wx.showToast({
                title: '照片上传失败',
                icon: 'none',
                duration: 1000
              })
            }
          }
        })

      }
    })
  },




  // 默认显示用户信息
  showUserInfoFunc: function (that) {
    wx.request({
      url: that.data.request_url + 'userinfo.php?action=get_userinfo',
      data: {
        token: that.data.token
      },
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
      console.log(res);
        if( res.data.code == 1 )
        {
          that.setData({
            user_datas: res.data.datas,
            car_img: res.data.datas.car_img
          })

          that.showComAndDepartFunc(res.data.datas.company_name, res.data.datas.department_name, 'show' );
          // console.log(that.data.comps_all );
        }
        else if (res.data.code == 9003 )
        {
          that.showComAndDepartFunc();
          that.setData({
            car_img: that.data.car_img
          })
        }

        // setTimeout(function () {
          wx.hideLoading();
        // }, 1000)

      }
    })
  },




  //获取单位部门名称列表
  showComAndDepartFunc: function (comp_name,dptm_name,s_type ) {

    var that = this;

    wx.request({
      url: that.data.request_url + 'list.php?action=get_company',
      data: {
        client: 'mp'
      },
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
       console.log(res);
        if( res.data.code == 1 )
        { 

          var comps = [], comps_all = [], dptms_all = [], dptms=[]

          for (var i in res.data.datas )
          {
            //单位数组
            comps.push( res.data.datas[i].company_name );
            comps_all.push({ 'company_id': res.data.datas[i].company_id, 'comp': res.data.datas[i].company_name });
            

            //部门数组
            dptms_all.push({ 'company_id': res.data.datas[i].company_id, 'dptm': res.data.datas[i].department });

          }


          // console.log(comps);
          // console.log(dptms_all);
          // console.log(comp_name);
          // console.log(dptm_name);

          //默认取单位数组第一个
          var comp_i = 0;

          for (var i in comps )
          {
            if (comps[i] == comp_name )
            {
              comp_i = i;
            }
            
          }

          // console.log('comp_i = ' + comp_i)

          //单位id
          var company_id = comps_all[comp_i].company_id;

          for (var i in dptms_all )
          {
            if (dptms_all[i].company_id == company_id )
            {
              for (var j in dptms_all[i].dptm )
              {
                dptms.push(dptms_all[i].dptm[j][1] );
              }
            }
          }

          // console.log(dptms);
          //默认取部门数组第一个
          var dptm_i = 0;

          for (var i in dptms )
          {
            if (dptms[i] == dptm_name )
            {
              dptm_i = i;
            }
          }
          
          that.setData({
            comps: comps,
            comps_all: comps_all,
            dptms_all: dptms_all,
            dptms: dptms,
            comp_i: comp_i,
            dptm_i: dptm_i
          })
          
        }
      }
    })
  },



  // 提交表单
  formSubmit:function(e){
    var that = this;
    console.log(e);
    var list = e.detail.value;
    //console.log(list);

    var ename = list.ename,  //姓名
        idTel = list.idTel, //手机号码
   my_comp_id = list.comp,  //选择的部门下标
   my_dptm_id = list.dptm,  //选择的单位下标
        carId = list.carId; //车牌号

    //选择的单位id
    var company_id = that.data.comps_all[my_comp_id].company_id;

    //选择的单位名称
    var company_name = that.data.comps_all[my_comp_id].comp;

    // console.log(that.data.dptms_all);

    //选择的部门id
    var dptm_id = that.data.dptms_all[my_comp_id].dptm[my_dptm_id][0];

    //选择的部门名称
    var dptm_name = that.data.dptms_all[my_comp_id].dptm[my_dptm_id][1];

    console.log(company_id + '   ' + company_name);
    console.log(dptm_id + '   ' + dptm_name);

    // 姓名
    // var ename_reg = /^([\u4E00-\u9FFF]|\w){2,12}$/;
    var ename_reg = /^(\S+){2,12}$/;
    if (!ename_reg.test(ename )) {
      wx.showToast({
        icon: 'none',
        title: '姓名2-12位字符'
      });
      return false;
    }

    
    // 车牌
    var carId_reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
    if (!carId_reg.test(carId)) {
      wx.showToast({
        icon: 'none',
        title: '车牌格式错误'
      });
      return false;
    }



    if( that.data.car_img == '' )
    {
      wx.showToast({
        icon: 'none',
        title: '请上传车辆照片'
      });
      return false;
    }

    console.log(that.data.token + ' ; ' + ename + ' ; ' + idTel + ' ; ' + company_id + ' ; ' + dptm_id + ' ; ' + carId);

    //提交资料
    wx.request({
      url: that.data.request_url + 'userinfo.php?action=edit_userinfo',
      data: {
        token: that.data.token,
        user_name: ename,
        mobilphone: idTel,
        company: company_id,
        department: dptm_id,
        plate_no: carId,
        client:'mp'
      },
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res);
        if( res.data.code == 1 )
        {
          wx.showToast({
            icon: 'success',
            title: '修改成功'
          });

          setTimeout(function(){
            wx.redirectTo({
              url: '../user_info/index'
            })
          },500)
          

        }
        else
        {
          wx.showToast({
            icon: 'none',
            title: '修改异常'
          });
        }
      }
    })






  },




  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})