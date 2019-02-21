var app = getApp();
// pages/forum/forum.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {

		webUrl: ""
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		
		var getway = app.data.host.indexOf("test.") > -1?"test":"www";

		var userid = wx.getStorageSync("myuserid");
		//iframe
		var webUrl = "https://www.laih5.cn/bbs/iframe.php?myuserid=" + encodeURIComponent(userid) + "&nick=" + encodeURIComponent(app.data.nick) + "&getway=" + getway;
		
		this.setData({

			webUrl: webUrl
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
	onShareAppMessage: function () {

		var shareData = app.fnGetShare();

		return {

			title: shareData.title,
			imageUrl: shareData.img,
			path: "pages/index/index?ditch=" + app.data.ditch
		}
	}
})