//应用全局变量和函数
App({
	data: {
		host: '',//后端地址
		ditch: 1
	},
	onLaunch:function(options) {
		wx.getShareInfo({
			
		})
	},
	//
	fnGetShare:function(){
		
		return (this.data.shareData[Math.floor(Math.random() * this.data.shareData.length)]); 
	}
})
