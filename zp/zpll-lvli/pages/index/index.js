//引入应用全局变量和函数
const app = getApp();
Page({
	data: {
		end_time: '11:00',
		count_down: '00:00:00',		
		gateway: 'https://h5.laih5.cn/site/?name=zpll&v=1.1.0',//网关+游戏id+版本号(升级时需更新版本号)
		parm: '',//小程序入口带参数,全部拼接成get请求转发
		isShowPage: false,//显示页面
	},

	//入口函数+有可能带参数(游戏id,商户号,红包id)
	onLoad: function (option) {

		var ditch = option.ditch || "";

		if (ditch == "") {

			ditch = wx.getStorageSync("ditch") || "";

			if (ditch == "") {

				app.data.ditch = 1;

				wx.setStorageSync("ditch", app.data.ditch);
			}

			else {

				app.data.ditch = ditch;
			}
		}

		else {

			app.data.ditch = ditch;

			wx.setStorageSync("ditch", app.data.ditch);
		}
		//参数拼接成get请求
		for (var key in option) {

			this.setData({ parm: this.data.parm + "&" + key + "=" + option[key]});	
		}

		wx.showLoading({

			title: '正在加载数据...'
		})			
		//2.网关获取后端地址
		var THIS = this;
		wx.request({
			url: this.data.gateway,
			method: 'GET',
			header: {
				'content-type': 'application/json'
			},
			success: function (res) {

				var data = res.data;

				if (data.code == 200) {

					var host_tmp = data.data;

					app.data.host = host_tmp;

					//console.log("网关获取后端地址成功 " +app.data.host);

					if (option.goto == "red") {

						wx.navigateTo({
							url: '../grobred/grobred?sid=' + option.sid
						})
					}
					else {

						THIS.fnOrderJudeg();
					}
				}
			},
			fail:function(){

				wx.hideLoading();

				wx.showModal({
					title: '提示',
					content: '服务器繁忙，请稍后再试！',
				})
			}
		});
	},
	//预约判断
	fnOrderJudeg:function() {

		var myuserid = wx.getStorageSync('myuserid') || "";

		var oUpData = {

			code: '',
			userid: ''
		};
		
		var self = this;

		if (myuserid === "") {

			wx.login({
				success: res => {

					oUpData.code = res.code;

					self.fnOrderRequest(oUpData);
				}
			})
		}

		else {

			oUpData.userid = myuserid;

			self.fnOrderRequest(oUpData);
		}

		this.fnGetShareCopy();
	},
	//预约请求
	fnOrderRequest:function(data) {

		data.merchantid = app.data.ditch;

		var self = this;

		wx.request({
			url: app.data.host + "/wxprogram/lyhd/zpll/public/index.php/index/Lineupapi/Lineup",
			method: 'GET',
			data: data,
			header: {
				'content-type': 'application/json'
			},
			success: function (res) {

				wx.hideLoading();

				//res = { data: { code: 200, data: { ispass: 0, end_time: '2018-09-10 12:00',count_down: 1000}}}

				var data = res.data;
				//console.log(data);
				if (data.code == 200) {
					//排队
					if (data.data.ispass == 0) {

						if (data.data.count_down <= 0) {
							//进入转盘页 
							self.EnterWebview();

							return;
						}

						var end_time = data.data.end_time.split(" ")[1].split(":");
						
						end_time = end_time[0] + ":" + end_time[1];
						
						self.setData({

							endTime: end_time,
							isShowPage: true,
						})

						self.fnOpenCountDown(data.data.count_down)
					}
					//不排队
					else {
						//进入转盘页 
						self.EnterWebview();
					}
				}
			},
			fail:function(){

				wx.hideLoading();

				wx.showModal({
					title: '提示',
					content: '服务器繁忙，请稍后再试！',
				})
			}
		});
	},
	//开启倒计时
	fnOpenCountDown: function (second) {
		
		var nSecond = parseInt(second);

		var count_down = setInterval(function(){

			if (nSecond <= 0) {
				//进入转盘页 
				this.EnterWebview();

				clearInterval(count_down);

				return;
			}

			else {
				//将0-9的数字前面加上0，例1变为01 
				function checkTime(i) {

					if (i < 10) { i = "0" + i; } return i;
				}
				//计算天数
				let nDay = parseInt(nSecond / 60 / 60 / 24);
				//计算剩余的小时
				let nHours = checkTime(parseInt(nSecond / 60 / 60 % 24));
				//计算剩余的分钟
				let nMinutes = checkTime(parseInt(nSecond / 60 % 60));
				//计算剩余的秒数
				let nDSeconds = checkTime(parseInt(nSecond % 60));
				//剩余时间 精确到分
				var dateText = nHours + ":" + nMinutes + ":" + nDSeconds;

				nSecond -= 1;

				this.setData({

					count_down: dateText
				})
			}
		}.bind(this),1000)	
	},
	//进入转盘页 
	EnterWebview: function () {
		//console.log("进入转盘页" + '../wheel/wheel?' + this.data.parm);
		wx.redirectTo({
			url: '../wheel/wheel?' + this.data.parm
		});	
	},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

		var shareData = app.fnGetShare();

		return {

			title: shareData.title,
			imageUrl: shareData.img,
			path: "pages/index/index?ditch="+app.data.ditch
		}
	},
	//获取分享文案
	fnGetShareCopy:function(){
		wx.request({
			url: app.data.host + "/wxprogram/lyhd/zpll/public/index.php/index/api/getsharemsg",
			data:{
				merchantid: app.data.ditch
			},
			method: 'GET',
			header: {
				'content-type': 'application/json'
			},
			success: function (res) {

				app.data.shareData = res.data.data;
			}
		})	
	}
})
