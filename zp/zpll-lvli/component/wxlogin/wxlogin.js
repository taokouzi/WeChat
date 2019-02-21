var app = getApp();
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {	
		
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		isHasUserid: true
	},
	//组件生命周期函数，在组件实例进入页面节点树时执行，注意此时不能调用 setData
	created () {},
	//组件生命周期函数，在组件布局完成后执行
	ready () {
		this.fnIsHasUserid();
	},
	/**
	 * 组件的方法列表
	 */
	methods: {
		fnIsHasUserid () {
			
			//判断授权登录
			var userid = wx.getStorageSync('myuserid') || '';
			
			if (userid === '') {
				this.setData({
					isHasUserid: false
				})
			}
			else {
				this.setData({
					isHasUserid: true 
				})
				app.d.userId = userid;
				var userInfo = wx.getStorageSync("userInfo");
				if (typeof userInfo === "string") {
					userInfo = JSON.parse(userInfo);
				}
				app.globalData.userInfo;
				console.log(this.properties)
				//this.properties.fnLoginSucceed();
				var myEventDetail = {
					isOk: true
				}
				this.triggerEvent('myevent', myEventDetail) 
			}
		},
		fnLogin(e) {
			
			if (e.detail.errMsg === "getUserInfo:ok") {
				var that = this;
				//调用登录接口
				wx.login({
					success: function (res) {
						var code = res.code;
						app.globalData.userInfo = e.detail.userInfo
						app.globalData.encryptedData = e.detail.encryptedData
						app.globalData.iv = e.detail.iv
						that.getUserSessionKey(code);
						that.setData({
							isHasUserid: true
						})
					}
				});
			}
		},
		getUserSessionKey (code) {
			//用户的订单状态
			var that = this;
			wx.request({
				url: app.d.ceshiUrl + '/Api/Login/getsessionkey',
				method: 'post',
				data: {
					code: code,
					encryptedData: app.globalData.encryptedData,
					iv: app.globalData.iv
				},
				header: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				success: function (res) {
					//--init data        
					var data = res.data;
					if (data.status == 0) {
						wx.showToast({
							title: data.err,
							duration: 2000
						});
						return false;
					}
					app.globalData.userInfo['sessionId'] = data.session_key;
					app.globalData.userInfo['openid'] = data.openId;
					app.globalData.userInfo['unionid'] = data.unionId;
					that.onLoginUser();
				},
				fail: function (e) {
					wx.showToast({
						title: '网络异常！err:getsessionkeys',
						duration: 2000
					});
				},
			});
		},
		onLoginUser () {
			var that = this;
			var user = app.globalData.userInfo;
			wx.request({
				url: app.d.ceshiUrl + '/Api/Login/authlogin',
				method: 'post',
				data: {
					SessionId: user.sessionId,
					gender: user.gender,
					NickName: user.nickName,
					HeadUrl: user.avatarUrl,
					openid: user.openid,
					unionid: user.unionid
				},
				header: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				success: function (res) {
					//--init data        
					var data = res.data.arr;
					var status = res.data.status;
					if (status != 1) {
						wx.showToast({
							title: res.data.err,
							duration: 3000
						});
						return false;
					}
					app.globalData.userInfo['id'] = data.ID;
					app.globalData.userInfo['NickName'] = data.NickName;
					app.globalData.userInfo['HeadUrl'] = data.HeadUrl;
					var userId = data.ID;
					if (!userId) {
						wx.showToast({
							title: '登录失败！',
							duration: 3000
						});
						return false;
					}
					app.d.userId = userId;
					wx.setStorageSync('myuserid', userId);
					wx.setStorageSync('userInfo', app.globalData.userInfo);
					//
					//that.properties.fnLoginSucceed;
					var myEventDetail = {
						isOk: true
					}
					that.triggerEvent('myevent', myEventDetail) 
				},
				fail: function (e) {
					wx.showToast({
						title: '网络异常！err:authlogin',
						duration: 2000
					});
				},
			});
		},
	}
})
