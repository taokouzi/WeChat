var inputContent = {}; //用户输入内容
var app = getApp();
var imgDir = app.globalData.imgDir;
Page({
    data: {
        redPaper: {
            id: '',
            title: '',
            hint: ''
        },
        hint: {
            message: '',
            hidden: true
        },
        //当前默认提示红包已领完
        cover: {
            success: imgDir+'img_success.png',
            fail: imgDir+'img_fail.png',
            hidden: false
        }
    },
    onLoad: function(options){
        this.setData({
            redPaper:{
                id: options.id,
                title: options.title,
                hint: options.hint
            }
        });
    },
    bindChange: function(e){
        inputContent[e.currentTarget.id] = e.detail.value;
    },
    bindCodeTap: function(e){
        var that = this;
        //校验手机号
        var phone = inputContent['phone'];
        if(!phone || phone == '' || phone.length!=11){
            that.setData({
                hint: {
                    message: '请先输入正确的手机号',
                    hidden: false
                }
            });
            setTimeout(function(){
                that.setData({hint:{hidden:true}});
            },1000);
            return false;
        }
        console.log('获取手机号 '+phone+' 获取验证码');
        //获取验证码
        // that.request({
        //   url: 'https://URL',
        //   data: {},
        //   method: 'GET',
        //   success: function(res){
        //     // success
        //   },
        //   fail: function() {
        //     // fail
        //   },
        //   complete: function() {
        //     // complete
        //   }
        // })
    },
    updateUser: function(phone){
        var data = {
            'jscode': '',
            'type': this.data.redPaper.id,
            'action': 2,
            'nickName': app.globalData.userInfo.nickName,
            'mobile': phone,
            'portrait': app.globalData.userInfo.avatarUrl
        }
        wx.login({
            success: function (res) {
                if (res.code) {
                    data.jscode = res.code;
                    wx.request({
                        url: 'https://hongbao.h5h5h5.cn/CrmServiceWeb/service/actiSoService/updateWxUserInfo',
                        data: data,
                        method: 'POST'
                    })
                } else {
                    console.log('获取用户登录态失败！' + res.errMsg);
                }
            }
        })
    },
    formSubmit: function(e){
        var data = e.detail.value;
        var that = this;
        //输入校验
        if(data.phone == '' || data.phone.length!=11 || !(/^1\d{10}$/.test(data.phone))){
            that.setData({
                hint: {
                    message: '请输入正确的手机号',
                    hidden: false
                }
            });
            setTimeout(function(){
                that.setData({hint:{hidden:true}});
            },1000);
            return false;
        }else if(data.code == ''){
            that.setData({
                hint: {
                    message: '请输入验证码',
                    hidden: false
                }
            });
            setTimeout(function(){
                that.setData({hint:{hidden:true}});
            },1000);
            return false;
        }
        that.showToast({
            icon: 'loading',
            duration: 10000
        })
        //更新用户记录
        that.updateUser(data.phone);
        //请求红包
        // that.request({
        //   url: 'https://URL',
        //   data: {
        //       'phone': data.phone,
        //       'code': data.code
        //   },
        //   method: 'POST',
        //   // header: {}, // 设置请求的 header
        //   success: function(res){
        //     // success
        //   },
        //   fail: function() {
        //     // fail
        //   },
        //   complete: function() {
        //     // complete
        //     that.hideToast();
        //   }
        // })
    },
    bindConfirmTap: function(e){
        // this.setData({
        //     cover: {
        //         hidden: true
        //     }
        // });
        //返回红包列表页
        wx.navigateBack({
            delta: 1
        })
    },
    //分享
    onShareAppMessage: function() {
        app.updateUserInfo({'type':0});
        return {
            title: '优惠猎手PRO',
            desc: '优惠猎手PRO',
            path: 'pages/index/index'
        }
    }
})