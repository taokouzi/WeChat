var app = getApp();
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		isOpenRedMsgView: false,
		isOpenGrabRedView: false,
		grabList:[],
		options: null,
		redmoney: 0,
		eq_money: 0,
		max_index: 0,//第几个必得大红包
		shareUser:{
			nick: "绿力小子",
			head: "../wheel/image/lvli_icon.jpg"
		},
		isHasUserid: true,
		isOpenMoneyNum: false,
		activEndDesc: null
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

		wx.showLoading({
			title: '加载中...',
		})
		this.setData({
			options: options
		})
		var userid = wx.getStorageSync("myuserid") || "";
		if (userid === "") {
			this.fnGetNote();
			this.setData({
				isHasUserid: false
			})
		}else {
			this.fnIsGrabRed();
		}

		this.isGrabRed = false;
	},
	//用户相对红包状态及红包信息
	fnIsGrabRed: function () {

		var userid = wx.getStorageSync("myuserid");
		var self = this;
		wx.request({
			url: app.data.host + '/wxprogram/lyhd/zpll/public/index.php/index/api/getredmsg',
			method: 'get',
			data: {
				userid: userid,
				merchantid: app.data.ditch,
				sid: this.data.options.sid,
			},
			header: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			success: function (res) {
				
				wx.hideLoading()
				if (res.data.code == 200) {
					//res.data.data.redmsg.state = 2;
					var state = res.data.data.redmsg.state;
					//state 1可抢 2已抢 3数量不足
					if (state == 1) {
						self.setData({
							isOpenRedMsgView: false,
							isOpenGrabRedView: true
						})
					} else if (state == 2) {
						self.setData({
							isOpenRedMsgView: true,
							isOpenGrabRedView: false
						})
					} else if (state == 3) {
						self.setData({
							isOpenRedMsgView: true,
							isOpenGrabRedView: false,
							//isOpenMoneyNum: true,
							activEndDesc: "红包派完了！"
						})
					}
					self.setData({
						["shareUser.nick"]: res.data.data.redmsg.nick,
						["shareUser.head"]: res.data.data.redmsg.head,
						grabList: res.data.data.redlog,
						eq_money: res.data.data.redmsg.sur_m,
						max_index: res.data.data.redmsg.max_index
					})
				}
			}
		})
	},
	//拆红包
	fnGrabRed: function () {

		wx.showLoading({
			title: '请稍等...',
		})
		var userid = wx.getStorageSync("myuserid");
		var self = this;
		wx.request({
			url: app.data.host + '/wxprogram/lyhd/zpll/public/index.php/index/api/getsmallred',
			method: 'get',
			data: {
				userid: userid,
				merchantid: app.data.ditch,
				sid: this.data.options.sid
			},
			header: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			success: function (res) {
				
				wx.hideLoading();
				//res.data = {code: 200,data: 10,}
				if (res.data.code == 200) {
					self.fnIsGrabRed();
					self.setData({
						redmoney: res.data.data,
						isOpenRedMsgView: true,
						/*isOpenMoneyNum: true*/
					})
					self.isGrabRed = true;
				}else {
					self.fnIsGrabRed();
					self.setData({
						isOpenRedMsgView: true,
						isOpenGrabRedView: false,
						//isOpenMoneyNum: true,
						activEndDesc: "红包派完了！"
					})
				}
			}
		})
	},
	//拆红包
	fnOpenRed:function() {

		this.fnGrabRed()
	},
	//登录成功回调
	fnLoginSucceed:function(){
		
		this.fnIsGrabRed();
	},
	//查看红包详细
	fnCheckRedMsg:function() {

		this.fnIsGrabRed();
		this.setData({
			isOpenRedMsgView: true,
			isOpenGrabRedView: false,
			isOpenMoneyNum: false
		})
	},
	//获取说明文字
	fnGetNote: function () {
		console.log(app.data.host)
		wx.request({
			url: app.data.host + '/wxprogram/lyhd/zpll/public/index.php/index/api/getnote',
			method: 'GET',
			data: {
				merchantid: app.data.ditch
			},
			header: {
				'content-type': 'application/json'
			},
			success: function (res) {
				var data = res.data;
				var aNote = data.data.split("|");
				this.setData({
					note: aNote
				})
			}.bind(this)
		})
	},
	//去首页
	fnGoIndex:function(){

		wx.navigateTo({
			url: '../wheel/wheel',
		})
	},
	//
	fnDecodeUserMsg: function (e) {
		//
		if (e.detail.errMsg !== "getUserInfo:ok") {
			return;
		}
		wx.showLoading({
			title: '加载中...',
		})
		var encryptedData = e.detail.encryptedData;
		var iv = e.detail.iv;
		var self = this;
		wx.login({
			success: res1 => {

				var code = res1.code;
				wx.request({
					url: app.data.host + '/wxprogram/lyhd/zpll/public/index.php/index/checkapi/wxlogin',
					data: {
						code: code,
						encryptedData: encryptedData,
						iv: iv,
						merchantid: app.data.ditch
					},
					method: 'GET',
					header: {
						'content-type': 'application/json'
					},
					success: function (res) {

						wx.hideLoading();
						var data = res.data;
						if (data.code == 200) {
							var myuserid = data.data;
							wx.setStorageSync('myuserid', myuserid);
							self.setData({
								isHasUserid: true
							})
							self.fnLoginSucceed();
						}
					},
				})
			}
		})
	},				
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

		wx.hideLoading()
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

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function (res) {

		var userid = wx.getStorageSync("myuserid");
		var sid = encodeURIComponent(this.data.options.sid);
		var fuid = encodeURIComponent(userid);
		var path = "pages/index/index?goto=red&sid=" + sid + "&fuid=" + fuid + "&merchantid=" + app.data.ditch;
		var title = "【拼手气】第" + this.data.max_index + "个开的人红包最大！"
		return {
			title: title,
			path: path,
			imageUrl: "../wheel/image/grabshare.jpg"
		}
	}
})