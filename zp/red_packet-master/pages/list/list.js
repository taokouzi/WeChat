var app = getApp();
var ImgDir = app.globalData.imgDir;
var url = '../form/form';//默认移动到领取红包页面

Page({
  data: {
    imgUrl: ImgDir+'img_banner.jpg',
    list: [{id:'1',title:'美团外卖红包',bg:ImgDir+'bg_meituan.jpg',url:url,hint:'说明：该红包仅使用于手机QQ美团'},
        {id:'2',title:'滴滴红包',bg:ImgDir+'bg_didi.jpg',url:url,hint:''},
        {id:'3',title:'百度外卖红包',bg:ImgDir+'bg_baidu.jpg',url:url,hint:''},
        {id:'6',title:'新年大礼包',bg:ImgDir+'bg_xinnian.jpg',url:url,hint:''},
        {id:'4',title:'饿了么红包',bg:ImgDir+'bg_eleme.jpg',url:url,hint:''},
        {id:'5',title:'大众点评红包',bg:ImgDir+'bg_dazhong.jpg',url:url,hint:''}],
    userInfo: {}
  },
    //预览图片
    previewImg: function(e){
        let that = this
        let curUrl = e.target.dataset.url;
        wx.previewImage({
            current: curUrl,
            urls: [that.data.imgUrl]
        })
    },
    //领取红包
    bindBtnTap: function(e) {
        var data = e.target.dataset;
        var dataStr = 'id='+data.id+'&title='+data.title+'&hint='+data.hint;
        wx.navigateTo({
            url: data.url+'?'+dataStr//带入当前红包参数
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