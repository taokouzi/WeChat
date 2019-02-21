const app = getApp();
Page({
  data: {
    code: '', //微信登录code
    times: 3, //抽奖次数
    progress: 0,
    friend_show: 'none',
    win_show: 'none',
    task_show: 'none',
    share_get: '',
    roll_list: [], //跑马灯数据列表		
    roll_list_data: [], //跑马灯数据列表数据
    win_list: [], //中奖数据列表
    win_page: 1, //中奖数据列表_分页
    friend_list: [], //好友数据列表
    hui_height: 130,
    shine_show: 'none',
    wallet: 0, //我的红包金额,单位分
    shine_timer: null, //进度条满闪烁定时器
    winnotice_show: 'none',
    winnotice_desc: '',
    task_list: [], //任务列表
    tasknotice_show: 'none',
    luck_desc: '集满必中',
    roll_timer: null, //跑马灯定时器

    //奖品类型 1红包 2实物 3虚拟物品 4未中奖
    award: [],
    jackpot: 0, //剩余金额
    joinnum: 0, //参与人数
    animation: {}, //转盘动画
    turntable_img: "", //转盘图片
    isOpenGet: false, //打开领取弹窗 
    isOpenHint: false, //金额用完提示
    awardIndex: null, //抽中奖品索引
    animBox: {}, //弹窗动画
    isSpace: false,
    rippleStyle: "",
    animMove: {},
    isShowGift: false,
    isOpenTimes: false, //显示次数用完
    isHasUserid: false, //是否有用户信息
    isOpenNoWinnng: false, //打开未中奖提示框
    isFirstPlay: false, //是否第一次进入
    pot_h_style: "",
    pot_h_state: {},
    pot_loc: {
      x: 0,
      y: 0
    },
	winningAward:{
		awardType: null,
		pid: null,
		fid: null,
		id: null,//奖品id
		title: "",//中奖名称
		desc: "",//中奖描述
		imgUrl: ""//奖品图片
	},
    isOpenVerify: false,
	isOpenNote: false,
	note: [],
	ditch: null,
	isGetRed: false,
	indicatorDots: false,
	autoplay: true,
	interval: 5000,
	duration: 1000,
	vertical: true,
	circular: true,
	soundUrl:{
		"zhuan": "https://cdn.11h5.com/island/vutimes/resource/gui/res_json/audio/wheel_rot_start.mp3?v=7090a92e1d3ee97dc1da5e10100849af",
		"winning": "http://h5.laih5.cn/winning.mp3?v=001",
		"dianji": "https://cdn.11h5.com/island/vutimes/resource/gui/res_json/audio/panel_open.mp3?v=b9e002d740340fbf0011ee18e9d1d5e9"	
	},
	mail: {
		name: "",
		tel: "",
		address: "",
		order: null,
		pid: null,
		fid: null
	},
	isOpenAddress: false,
  },

  //入口
  onLoad: function(option) {
	
	this.isOpenHint = false;
    //参数拼接成get请求
    for (var key in option) {
      if (key == "send" && option[key] != null && option[key] != undefined && option[key] != "") {
        //绑定好友
        //console.log("绑定好友");
        var myuserid = wx.getStorageSync('myuserid');
        this.BindingFriend(decodeURIComponent(option[key]), myuserid);
      }
    }

    //获取用户信息
    this.GetUserMsg();

    //获取滚动动态
    this.GetRolling();
    //抽奖状态
    this.drawState = false;
    //奖品id
    this.lcuk_id = "";
    //蓄满
    this.isMaxblast = true;
    //创建转盘动画
    var animation = wx.createAnimation({

      timingFunction: "ease-out",
    })

    this.animation = animation;
    //创建弹窗动画
    var animation1 = wx.createAnimation({
      duration: 300,
      timingFunction: "ease",
      transformOrigin: "50%"
    })

    this.animBox = animation1;
    //请求奖品数据
    this.fnGetTurnTable();

    this.animMove = null;

    //主逻辑函数
    this.LogicMain();

	this.fnGetNote();

	this.setData({
		ditch: app.data.ditch
	})

	wx.showShareMenu({

		withShareTicket: true //要求小程序返回分享目标信息
	})

  },

  //获取用户信息
  GetUserMsg: function(fun) {
    var THIS = this;
    var myuserid = wx.getStorageSync('myuserid') || "";
	if (myuserid === "") {
		return;
	}
    wx.request({
      url: app.data.host + '/wxprogram/lyhd/zpll/public/index.php/index/api/getusermsg?userid=' + myuserid,
      method: 'GET',
	  data:{
		  merchantid: app.data.ditch
	  },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        var data2 = res.data;
        if (data2.code == 200) {
          //console.log("获取用户信息成功");
          //次数
          THIS.setData({
            times: data2.data.times,
			wallet: data2.data.wallet
          });
          //幸运值进度
          THIS.setData({
            progress: data2.data.progress
          });
          //前面进度走快点
          var pro_tmp = THIS.data.progress;
          if (pro_tmp > 0 && pro_tmp < 20) {
            pro_tmp = pro_tmp + 4;
          } else if (pro_tmp >= 20 && pro_tmp < 30) {
            pro_tmp = pro_tmp + 3;
          } else if (pro_tmp >= 30 && pro_tmp < 40) {
            pro_tmp = pro_tmp + 2;
          } else if (pro_tmp >= 40 && pro_tmp < 50) {
            pro_tmp = pro_tmp + 1;
          }
          THIS.setData({
            hui_height: 96 - pro_tmp * 0.96
          });
          //console.log("进度: " + pro_tmp + " " + THIS.data.hui_height);
          //进度条慢闪烁
          if (THIS.data.progress >= 100) {
            THIS.data.shine_timer = setInterval(function() {
              if (THIS.data.shine_show != "block") {
                THIS.setData({
                  shine_show: 'block'
                });
              } else {
                THIS.setData({
                  shine_show: 'none'
                });
              }
            }, 1000);
            THIS.setData({
				luck_desc: '集满必中'
            });
          } else {
            THIS.setData({
				luck_desc: '集满必中'
            });
          }
          if (typeof fun === "function") {
            wx.hideLoading()
            fun();
          }
        }
      }
    });
  },

  //打开中奖页面
  WinOpen: function() {
    this.setData({
      win_show: 'block'
    });
    //获取个人中奖记录
    this.GetSelfPrizeLog();
  },
  //关闭中奖页面
  WinClose: function() {
    this.setData({
      win_show: 'none'
    });
    //还原数据到初始化
    this.setData({
      win_list: []
    });
    this.setData({
      win_page: 1
    });
  },
  //获取个人中奖记录
  GetSelfPrizeLog: function() {
    var THIS = this;
    var myuserid = wx.getStorageSync('myuserid');
    wx.request({
      url: app.data.host + '/wxprogram/lyhd/zpll/public/index.php/index/api/getselfprizelog',
      method: 'GET',
	  data:{
		  userid: myuserid,
		  page: this.data.win_page,
		  num: 15,
		  merchantid: app.data.ditch
	  },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {

		  var data2 = res.data;

		  /*data2.data.log.push({
			  msg: "抽奖获得猫眼电影票", time: "1小时前", id: 27,pid: 11
		  })*/

        if (data2.code == 200) {

			var tmp = THIS.data.win_list;

			var tmp_length = tmp.length;

			for (var i = 0; i < data2.data.log.length; i++) {

				tmp[tmp_length + i] = data2.data.log[i];

				var btn_text = "领取";

				/*for(var j = 0,k = THIS.data.award.length; j < k; j ++) {

					if (data2.data.log[i].id == THIS.data.award[j].id) {
						//红包类型
						if (THIS.data.award[j].type == 1) {

							tmp[tmp_length + i]['show'] = "none";
						}
						//电影票 实物
						else if (THIS.data.award[j].type == 3 || THIS.data.award[j].type == 2) {
							
							tmp[tmp_length + i]['show'] = "block";

							tmp[tmp_length + i]['awardType'] = 3;

							if (data2.data.log[i].isget==1){
								
								btn_text = "查看"
							}
						}
						//虚拟货币
						else if (THIS.data.award[j].type == 5) {

							if (data2.data.log[i].isget == 1) {

								tmp[tmp_length + i]['show'] = "none";
							}
							else {

								tmp[tmp_length + i]['show'] = "block";
							}
						}
						//裂变红包
						else if (THIS.data.award[j].type == 7) {

							tmp[tmp_length + i]['show'] = "block";

							btn_text = "详情";

							tmp[tmp_length + i]['sid'] = data2.data.log[i].sid;
						}
						//其它
						else {

							tmp[tmp_length + i]['show'] = "block";
						}
						
						tmp[tmp_length + i]["btn_text"] = btn_text;

						tmp[tmp_length + i]['awardType'] = THIS.data.award[j].type

						break;
					}
				}*/
				//红包类型
				if (data2.data.log[i].type == 1) {

					tmp[tmp_length + i]['show'] = "none";
				}
				//电影票 实物
				else if (data2.data.log[i].type == 3 || data2.data.log[i].type == 2) {

					tmp[tmp_length + i]['show'] = "block";

					tmp[tmp_length + i]['awardType'] = 3;

					if (data2.data.log[i].isget == 1) {

						btn_text = "查看"
					}
				}
				//虚拟货币
				else if (data2.data.log[i].type == 5) {

					if (data2.data.log[i].isget == 1) {

						tmp[tmp_length + i]['show'] = "none";
					}
					else {

						tmp[tmp_length + i]['show'] = "block";
					}
				}
				//裂变红包
				else if (data2.data.log[i].type == 7) {

					tmp[tmp_length + i]['show'] = "block";

					btn_text = "详情";

					tmp[tmp_length + i]['sid'] = data2.data.log[i].sid;
				}
				//其它
				else {

					tmp[tmp_length + i]['show'] = "block";
				}

				tmp[tmp_length + i]["btn_text"] = btn_text;

				tmp[tmp_length + i]['awardType'] = data2.data.log[i].type
          	}
			
			THIS.setData({

				win_list: tmp
			});


			THIS.setData({

				win_page: THIS.data.win_page + 1,
				wallet: data2.data.wallet
			});
        }
      }
    });
  },

  //我的奖品提示框
  WinNotice: function(e) {

	var awardid = parseInt(e.currentTarget.dataset.awardid);

	var awardType = parseInt(e.currentTarget.dataset.awardtype);
	//实物 虚拟卡劵
	if (awardType === 3 || awardType == 2) {

		var pid = parseInt(e.currentTarget.dataset.pid);

		var fid = parseInt(e.currentTarget.dataset.fid);

		this.setData({
			isOpenAddress: true,
			['winningAward.fid']: fid,
			win_show: "none"
		})
		
		this.fnGetmsg(pid)

		return;
	}
	//裂变红包
	else if (awardType == 7) {

		var sid = encodeURIComponent(e.currentTarget.dataset.sid);

		wx.navigateTo({
			url: '../grobred/grobred?sid=' + sid,
		})

		return;
	}

    this.setData({

      	winnotice_show: 'block'
    });

    var desc = "";

	var isGetRed = false;

	for (var i = 0, j = this.data.award.length; i < j; i ++) {
		
		if ( awardid === parseInt(this.data.award[i].id) || awardType == parseInt(this.data.award[i].type) ) {
			//如果是红包 且 低于30分
			if (this.data.award[i].type == 1 && this.data.wallet < 30) {

				desc = "现金红包0.3元以上可以提现";

				isGetRed = true;
			}
			
			else {

				desc = this.data.award[i].kefu;

				isGetRed = false;
			}
			
			break;
		}
	}

	/*if (e.currentTarget.dataset.msg.indexOf("提现") != -1) {
      desc = "发送数字1给客服,即可提现";
    } else if (name.currentTarget.dataset.msg.indexOf("传奇礼包") != -1) {
      desc = "发送数字3给客服,即可领取";
    } else if (name.currentTarget.dataset.msg.indexOf("单车月卡") != -1) {
      desc = "发送数字4给客服,即可领取";
	} else if (name.currentTarget.dataset.msg.indexOf("绿力币") != -1) {
		desc = "发送数字5给客服,即可领取";
	}*/

    this.setData({
		
      winnotice_desc: desc,
	  isGetRed: isGetRed
    });
  },

  //获取滚动动态
  GetRolling: function() {
    var THIS = this;
    //console.log("刷新跑马灯");
    wx.request({
      url: app.data.host + '/wxprogram/lyhd/zpll/public/index.php/index/api/getrolling',
      method: 'GET',
	  data:{
		  merchantid: app.data.ditch
	  },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        var data2 = res.data;
        //console.log(data2);
        if (data2.code == 200) {
			THIS.setData({
				roll_list_data: data2.data
			});

			var s = THIS.data.roll_list_data.length;

			var roll_func=function() {

				var tmp = [];

				if (s >= 10) {

					var j = 0;

					for (var i = s - 10; i < s; i++) {

						tmp[j] = THIS.data.roll_list_data[i];

						j++;
					}

					THIS.setData({

						roll_list: tmp
					});

					s--;
				}

				else {

					THIS.setData({

						roll_list: THIS.data.roll_list_data
					});

					clearInterval(THIS.data.roll_timer);
				}
			}

			roll_func();

			THIS.data.roll_timer = setInterval(roll_func, 5000);
        }
      }
    });
  },

  //打开好友动态
  FriendOpen: function() {
    this.setData({
      friend_show: 'block'
    });
    //获取好友中奖记录
    var THIS = this;
    //console.log("刷新跑马灯");
    var myuserid = wx.getStorageSync('myuserid');
    wx.request({
      url: app.data.host + '/wxprogram/lyhd/zpll/public/index.php/index/api/getfriendprizelog?userid=' + myuserid + "&num=10",
      method: 'GET',
	  data:{
		  merchantid: app.data.ditch
	  },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        var data2 = res.data;
        if (data2.code == 200) {
          THIS.setData({
            friend_list: data2.data
          });
        }
      }
    });

  },

  //关闭好友动态
  FriendClose: function() {
    this.setData({
      friend_show: 'none'
    });
  },

  //打开任务
  TaskOpen: function() {
    this.setData({
      task_show: 'block',
    });

    this.fnCloseTimesHint();
    //获取任务列表
    this.GetTask();
  },

  //关闭任务
  TaskClose: function() {
    this.setData({
      task_show: 'none'
    });
  },

  //获取任务列表
  GetTask: function() {
    var THIS = this;
    var myuserid = wx.getStorageSync('myuserid');
    wx.request({
      url: app.data.host + '/wxprogram/lyhd/zpll/public/index.php/index/api/gettask?userid=' + myuserid,
      method: 'GET',
	  data:{
		  merchantid: app.data.ditch
	  },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        var data2 = res.data;
        if (data2.code == 200) {
          var tmp = [];
          for (var i = 0; i < data2.data.length; i++) {
            tmp[i] = data2.data[i];
            //确定任务名称
            if (data2.data[i].id == 1) {
              tmp[i]['name'] = "邀请好友,获得红包0.3元";
            } else if (data2.data[i].id == 2) {
              tmp[i]['name'] = "邀请好友,获得抽奖机会1次";
            } else if (data2.data[i].id == 3) {
              tmp[i]['name'] = "发送数字2给客服,即可获得抽奖机会1次";
			} else if (data2.data[i].id == 4) {
				tmp[i]['name'] = "分享到群,即可获得抽奖机会1次";
			}
            //确定按钮显示
            if (data2.data[i].type == 1) {
              tmp[i]['ninqu_w'] = "140";
              tmp[i]['service_w'] = "0";
              tmp[i]['share_w'] = "0";
            }
            //未完成
            else if (data2.data[i].type == 2) {
              tmp[i]['ninqu_w'] = "0";
              //分享按钮,客服按钮
			  if (data2.data[i].id == 1 || data2.data[i].id == 2 || data2.data[i].id == 4) {
                tmp[i]['service_w'] = "0";
                tmp[i]['share_w'] = "140";
              } else if (data2.data[i].id == 3) {
                tmp[i]['service_w'] = "140";
                tmp[i]['share_w'] = "0";
              }
            }
          }
          THIS.setData({
            task_list: tmp
          });
          //console.log(THIS.data.task_list);
        }
      }
    });
  },

  //领取奖励导航
  GetReward: function(name) {
    //console.log(name);
    if (name.currentTarget.dataset.msg == 1) {
      this.Finvitation();
    } else if (name.currentTarget.dataset.msg == 2) {
      this.Invitation();
    } else if (name.currentTarget.dataset.msg == 3) {
      this.SetGzhtimes();
	} else if (name.currentTarget.dataset.msg == 4) {
		this.fnShareaddtimes();	
	}
  },

  //首次邀请-领取邀请奖励
  Finvitation: function() {
    var THIS = this;
    var myuserid = wx.getStorageSync('myuserid');
    wx.request({
      url: app.data.host + '/wxprogram/lyhd/zpll/public/index.php/index/api/finvitation',
      method: 'GET',
	  data:{
		  merchantid: app.data.ditch,
		  userid: myuserid
	  },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        var data2 = res.data;
        if (data2.code == 200) {
          //获取用户信息-刷新
          THIS.GetUserMsg();
          //获取任务列表
          THIS.GetTask();
          //显示弹窗提示
          THIS.setData({
            tasknotice_show: 'block'
          });
        }
      }
    });
  },

  //领取邀请奖励
  Invitation: function() {
    var THIS = this;
    var myuserid = wx.getStorageSync('myuserid');
    wx.request({
      url: app.data.host + '/wxprogram/lyhd/zpll/public/index.php/index/api/invitation',
      method: 'GET',
	  data:{
		  merchantid: app.data.ditch,
		  userid: myuserid
	  },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        var data2 = res.data;
        if (data2.code == 200) {
          //获取用户信息-刷新
          THIS.GetUserMsg();
          //获取任务列表
          THIS.GetTask();
        }
      }
    });
  },

  //公众号增加次数
  SetGzhtimes: function() {
    var THIS = this;
    var myuserid = wx.getStorageSync('myuserid');
    wx.request({
      url: app.data.host + '/wxprogram/lyhd/zpll/public/index.php/index/api/setgzhtimes?userid=' + myuserid,
      method: 'GET',
	  data:{
		  merchantid: app.data.ditch
	  },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        var data2 = res.data;
        if (data2.code == 200) {
          //获取用户信息-刷新
          THIS.GetUserMsg();
          //获取任务列表
          THIS.GetTask();
        }
      }
    });
  },

  //关闭领取奖励弹框
  TaskNoticeClose: function() {
    this.setData({
      tasknotice_show: 'none'
    });
  },

  //绑定好友
  BindingFriend: function(inviter, invitee) {
    var THIS = this;
    wx.request({
      url: app.data.host + '/wxprogram/lyhd/zpll/public/index.php/index/api/bindingfriend?inviter=' + inviter + "&invitee=" + invitee,
      method: 'GET',
	  data:{
		  merchantid: app.data.ditch
	  },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        var data2 = res.data;
        if (data2.code == 200) {}
      }
    });
  },

  //我的奖品提示框-关闭
  WinNoticeClose: function() {
    this.setData({
      winnotice_show: 'none'
    });
    this.setData({
      winnotice_desc: ''
    });
  },

  //分享
  onShareAppMessage: function(res) {

	var isShareQun = false;

    if (res.from === 'button') {
      // 来自页面内转发按钮
      //console.log(res.target);
		if (res.target.dataset.taskid == 4) {
			isShareQun = true
	  	}
    }

	var shareData = app.fnGetShare();

	var self = this;

    return {
		title: shareData.title,
		imageUrl: shareData.img,
	  path: 'pages/index/index?ditch='+app.data.ditch+'&send=' + encodeURIComponent(wx.getStorageSync('myuserid')), //分享带上用户id参数
	  success:function(res){
		  //分享到群
		  if (res.shareTickets) {
			  //获取群id
			  wx.getShareInfo({
				  shareTicket: res.shareTickets[0],
				  complete(res1) {
					  
					  self.fnShareSuccess(2);
				  }
			  })
		  }
		  else {
			  if (isShareQun) {

				wx.showToast({
					title: '分享到微信群，才能完成该任务',
				})	
			  }
			  self.fnShareSuccess(1);
		  }
	  },
    }
  },
  //分享成功上传记录
  fnShareSuccess:function(shareType){

	  var userid = wx.getStorageSync('myuserid') || "";

	  if (userid === "") {
	      
		  //console.log("没有userid");

		  return;
	  }
	  console.log({
		  userid: userid,
		  merchantid: app.data.ditch
	  })
	  wx.request({
		  url: app.data.host + '/wxprogram/lyhd/zpll/public/index.php/index/api/setsharelog',
		  data:{
			  type: shareType,
			  userid: userid,
			  merchantid: app.data.ditch
		  },
		  method: 'GET',
		  header: {
			  'content-type': 'application/json'
		  },
		  success: function (res) {

			  console.log(res.data);
		  }
	  });
  },
  //点击抽奖
  fnStartWinng: function(e) {
    //正在抽奖 或 次数用完
    if (this.drawState) {

      return;
    }

	this.fnVoice("dianji");

    if (this.data.times === 0) {

      /*wx.showModal({
      	title: '提示',
      	content: '你的抽奖次数已用完',
      })*/

      this.setData({

        isOpenTimes: true
      })

      //刷新奖品数据
      this.fnGetTurnTable();

      return;
    }
    //今日未进行机器人检验
    if (!this.fnIsDefendAi()) {

      this.fnStageInit();

      return;
    }

    this.drawState = true;

    /*var jie = Math.floor(Math.random() * this.data.award.length);

    var awardid = this.data.award[jie].id;
		
    //console.log("奖品id="+awardid);

    //console.log("奖品昵称="+this.data.award[jie].name);*/

    if (this.data.progress >= 100) {
      //关闭进度条慢闪烁定时器
      this.setData({

        shine_show: 'none'
      });

      clearInterval(this.data.shine_timer);

      this.setData({

        isShowGift: true
      })
      var self = this;
      //创建节点选择器
      let query = wx.createSelectorQuery();
      //选择id
      query.select('#turnplate').boundingClientRect();

      query.exec(function(res) {

        var moveX = res[0].left; //+ res[0].width/2 - x;

        var moveY = res[0].top - (160 * 0.55) / 3; //+ res[0].height / 3;
        //创建弹窗动画
        var animation = wx.createAnimation({
          duration: 600,
          timingFunction: "ease"
        })
        //scale(0.2,0.2)
        animation.translate(moveX, moveY).step();

        animation.scale(0.4, 0.4).opacity(0).step();

        self.setData({

          animMove: animation
        })

        setTimeout(function() {

          self.setData({

            isSpace: true,
            isShowGift: false
          })

          self.fnRunAction();

          self.fnLuckDraw();

		  self.fnVoice("zhuan");

          self.isMaxblast = false;

          //创建弹窗动画
          var animMove = wx.createAnimation({
            duration: 0,
            timingFunction: "ease"
          })
          //scale(0.2,0.2)
          animMove.translate(0, 0).scale(1, 1).step();

          self.setData({

            animMove: animMove
          })

        }, 1500)
      })
    } else {

		setTimeout(function () { this.fnLuckDraw(); this.fnRunAction(); this.fnVoice("zhuan");  }.bind(this),300);
    }
    //
  },
  //转动动画
  fnRunAction: function() {
	    
    //当前角度
    var curRotate = 0;

    if (this.animation) {

      if (this.animation.currentTransform) {

        if (this.animation.currentTransform["rotate"]) {

          curRotate = this.animation.currentTransform["rotate"].args[0];
        }
      }
    }
    //初始指针角度
    var startRotate = 0;
    //最少旋转圈数
    var nCount = 8;
    //旋转基础角度
    var nRotate = 360 * (nCount + Math.floor(curRotate / 360));
    //时间
    var nDuration = 4000;//nCount * 1000;

    this.animation.rotate(nRotate).step({

      	duration: nDuration
    })

    this.setData({

      animation: this.animation.export()
    })

    setTimeout(function() {

        this.fnAnimationCallback();

    }.bind(this), nDuration)
  },
  //转盘回调函数
  fnAnimationCallback: function() {

    this.drawState = false;

	//console.log(this.data.awardIndex)
    //已抽奖
    if (this.data.awardIndex !== null) {
      //已中奖
      if (this.data.award[this.data.awardIndex].type !== 4) {

        this.animBox.scale(1, 1).opacity(1).step({
          timingFunction: 'ease'
        });

        this.setData({

          isOpenGet: true,
          animBox: this.animBox.export()
        })

		this.fnVoice("winning")
      } else {

        this.setData({

          isOpenNoWinnng: true
        })
      }
      //
      if (this.data.isSpace) {

        this.setData({

          isSpace: false
        })
      }

      //请求奖品数据
      this.fnGetTurnTable();
    }
  },
  //关闭未中奖提示框
  fnCloseNoWing: function() {

    this.setData({

      isOpenNoWinnng: false
    })
  },
  //请求奖品数据
  fnGetTurnTable: function() {

    var self = this;

    wx.request({
      url: app.data.host + '/wxprogram/lyhd/zpll/public/index.php/index/api/getturntable',
      method: 'get',
      data: {
		  merchantid: app.data.ditch
	  },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {

        console.log(res);

        if (res.data.code === 200) {

          self.setData({

            jackpot: res.data.data.jackpot,
            joinnum: res.data.data.joinnum,
            award: res.data.data.turntable,
            turntable_img: res.data.data.turntable_img
          })

		  if(!self.isOpenHint) {
			  self.fnOpenEveryDay();
		  }	
        }
      },
      fail: function() {

      }
    })
  },
  //请求抽奖接口
  fnLuckDraw: function() {

    var self = this;

    wx.request({
      url: app.data.host + '/wxprogram/lyhd/zpll/public/index.php/index/api/luckdraw',
      method: 'get',
      data: {
        userid: wx.getStorageSync("myuserid"),
		merchantid: app.data.ditch
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {

        //res = { data: { code: 200, data: 14,m:29}}

        if (res.data.code === 200) {
          //奖品id
          self.lcuk_id = res.data.data;
          //每一扇形角度
          var awardRotate = 360 / self.data.award.length;

          var nRotate = self.animation.currentTransform["rotate"].args[0];

          var awardIndex = null;

		  var title = null;

		  var desc = null;

		  var awardType = null;

          for (var i = 0; i < self.data.award.length; i++) {

            if (self.lcuk_id === self.data.award[i].id) {

              nRotate += (360 - (i * awardRotate));

              awardIndex = i;

			  desc = self.data.award[i].kefu;

			  awardType = self.data.award[i].type;
			  //中红包
			  if (self.data.award[i].type == 1) {

				  title = res.data.m / 100 + "元红包"; 
				  //低于30分
				  if (res.data.m + self.data.wallet < 30) {
					  
					  desc = "现金红包0.3元以上可以提现";
				  }
			  }
			  //中绿力币
			  else if (self.data.award[i].type == 5) {

				  title = res.data.g + "绿力币"
			  }
			  //中分享红包
			  else if (self.data.award[i].type == 7) {
				  
				  title = res.data.p/100 + "元拼手气红包";

				  desc = "第" + res.data.max_index +"个领取的人得大红包";
			  }
			  //其它奖品
			  else {
				  
				  title = self.data.award[i].name;
			  }

              //console.log("奖品id=" + self.lcuk_id);

              //console.log("奖品昵称=" + self.data.award[i].name);

              //console.log("旋转角度=" + nRotate);

              break;
            }
          }

          self.animation.rotate(nRotate).step({

            duration: 3000
          });
		  
		  var winningAward = {
			  awardType: awardType,
			  wallet: res.data.m + self.data.wallet,
			  id: self.lcuk_id,
			  title: title,
			  desc: desc,
			  pid: res.data.pid,
			  fid: res.data.fid,
			  sid: res.data.sid,
			  imgUrl: self.data.award[awardIndex].img,
		  }

          self.setData({
            awardIndex: awardIndex,
			winningAward: winningAward,
            animation: self.animation.export()
          })

          //获取用户信息-刷新
          self.GetUserMsg();
          //请求奖品数据
          self.fnGetTurnTable();
        } else {
		  
		  self.setData({

			  awardIndex: null
		  })

          wx.showModal({
            title: '提示',
            content: '服务器错误，请稍后重试',
          })
        }
      },
      fail: function() {

      }
    })
  },
  //点击领取或确认
  fnClickGet: function(e) {

	var awardType = parseInt(this.data.award[this.data.awardIndex].type);

	if (awardType === 3 || awardType === 2) {
	
		this.setData({
			isOpenAddress:true
		})

		this.fnGetmsg(this.data.winningAward.pid)
	}
	//分享红包
	else if (awardType == 7) {

		var sid = this.data.winningAward.sid;
		//跳转到拆红包页面
		wx.navigateTo({
			url: '../grobred/grobred?sid=' + sid,
		})
	}
    this.fnCloseGet();
  },
  //关闭中奖弹窗
  fnCloseGet: function() {

    this.animBox.scale(0.5, 0.5).opacity(0.3).step({
      timingFunction: 'ease-in'
    });

    this.setData({

      isOpenGet: false,
      animBox: this.animBox.export()
    })

    //清除跑马灯定时器,重新拿取跑马灯
    clearInterval(this.data.roll_timer);
    //获取滚动动态
    this.GetRolling();
  },
  //关闭金额用完提示
  fnCloseHint: function() {

    this.setData({

      isOpenHint: false
    })
  },
  //关闭次数用完提示
  fnCloseTimesHint: function() {

    this.setData({

      isOpenTimes: false
    })
  },
  //推送获取formid
  FormBack: function(e) {

    if (e.type == "submit") {

      var formid = e.detail.formId;

      if (formid == "the formId is a mock one") {
        //return;
      }
      if (this.drawState) {
        return;
      }

      this.fnStartWinng();

      if (this.data.times < 2) {
        return;
      }
      //console.log(formid);
      //1.更新formid
      var THIS = this;
      var myuserid = wx.getStorageSync('myuserid');
      wx.request({
        url: app.data.host + '/wxprogram/lyhd/zpll/public/index.php/index/checkapi/setformid?userid=' + myuserid + '&formid=' + formid,
        method: 'GET',
		data:{
			merchantid: app.data.ditch
		},
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          var data = res.data;
          //更新formid
          if (data.code == 200) {
            //console.log("更新formid成功");
          }
        }
      });
    }
  },


  //主逻辑函数
  LogicMain: function() {
    var THIS = this;
    //1.如果有存储myuserid,并且校验通过,直接跳转游戏网页带myuserid参数
    var myuserid = wx.getStorageSync('myuserid');
    if (myuserid != null && myuserid != undefined && myuserid != "") {
      //1.校验myuserid
      wx.request({
        url: app.data.host + '/wxprogram/lyhd/zpll/public/index.php/index/checkapi/useridcheck?userid=' + myuserid,
        method: 'GET',
		data:{
			merchantid: app.data.ditch
		},
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          var data = res.data;
          //校验通过
          if (data.code == 200) {
            //console.log("校验myuserid成功");

            THIS.setData({

              isFirstPlay: false
            })

            if (data.data.has_unionid == 1) {

              THIS.setData({

                isHasUserid: true,
              })
            } else {

              THIS.setData({

                isHasUserid: false,
              })
            }
          }
          //校验失败
          else {
            //微信登录
            THIS.WxLogin();
          }
        }
      });
    }
    //2.没有自动跳转走,走常规流程,用户点击按钮拿取数据,后端存储账号-登录
    else {
      //微信登录 
      this.WxLogin();

      this.setData({

        isFirstPlay: true
      })
    }
  },

  //微信登录
  WxLogin: function() {
    //做按钮操作
    wx.login({
      success: res => {
        this.setData({
          code: res.code
        }); //保存登录code
        //console.log("登录 " + res.errMsg + " ---- " + this.data.code);
      }
    })
  },
  //测试用解密方式获取用户信息
  fnDecodeUserMsg: function(e) {
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

    wx.request({
      url: app.data.host + '/wxprogram/lyhd/zpll/public/index.php/index/checkapi/wxlogin',
      data: {
        code: this.data.code,
        encryptedData: encryptedData,
        iv: iv,
		merchantid: app.data.ditch
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {

        wx.hideLoading();

        var data = res.data;

        if (data.code == 200) {

          var myuserid = data.data;

          wx.setStorageSync('myuserid', myuserid);

          self.GetUserMsg(function() {

            if (e.currentTarget.dataset.isgree !== "1") {

              if (data.has_unionid == 1) {
                //继续抽奖
                self.fnStartWinng();
              }
            }
            //再次校验
            self.fnCheckUser();
          });
        }
      }
    })
  },
  //获取用户信息回调函数
  /*fnDecodeUserMsg: function (e) {
  	//console.log("授权用户操作 " + e.detail.errMsg);
  	//授权成功
  	if (e.detail.errMsg == "getUserInfo:ok") {
  		wx.showLoading({
  			title: '加载中...',
  		})
  		var THIS = this;
  		//1.获取参数
  		var nick = encodeURIComponent(e.detail.userInfo.nickName);
  		var head = e.detail.userInfo.avatarUrl;
  		//console.log("获取用户信息回调函数 " + nick + " ---- " + head + " ---- " + this.data.code);
  		//2.获取myuserid
  		wx.request({
  			url: app.data.host + '/wxprogram/lyhd/zpll/public/index.php/index/checkapi/wxlogin?nick=' + nick + "&head=" + head + "&code=" + this.data.code,
  			method: 'GET',
  			header: {
  				'content-type': 'application/json'
  			},
  			success: function (res) {
  				var data = res.data;
  				wx.hideLoading();
  				if (data.code == 200) {
  					var myuserid = data.data;
  					wx.setStorageSync('myuserid', myuserid);
  					//console.log("获取myuserid  " + wx.getStorageSync('myuserid'));
  					
  					THIS.GetUserMsg(function(){

  						if (e.currentTarget.dataset.isgree !== "1") {
  							
  							if (data.has_unionid == 1) {
  								//继续抽奖
  								THIS.fnStartWinng();
  							}
  						}
  						//再次校验
  						THIS.fnCheckUser();
  					});
  				}
  			}
  		});
  	}
  },*/
  //校验用户
  fnCheckUser: function() {

    var THIS = this;

    var myuserid = wx.getStorageSync('myuserid');
    //1.校验myuserid
    wx.request({
      url: app.data.host + '/wxprogram/lyhd/zpll/public/index.php/index/checkapi/useridcheck?userid=' + myuserid,
      method: 'GET',
	  data:{
		  merchantid: app.data.ditch
	  },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        var data = res.data;
        //校验通过
        if (data.code == 200) {
          //console.log("校验myuserid成功");

          THIS.setData({

            isFirstPlay: false
          })
          //has_unionid
          if (data.data.has_unionid == 1) {

            THIS.setData({

              isHasUserid: true,
            })
          } else {

            THIS.setData({

              isHasUserid: false
            })
            //更新code
            THIS.WxLogin();
          }
        }
      }
    });
  },
  //初始化舞台
  fnStageInit: function() {
		
    var self = this;

		this.setData({

			isOpenVerify: true
		})
		
    var query = wx.createSelectorQuery()

    query.select('#stage').boundingClientRect()

    query.select('#pot-l').boundingClientRect()

    query.select('#pot-h').boundingClientRect()

    query.selectViewport().scrollOffset()
    //获取舞台信息
    query.exec(function(res) {
      var stageW = res[0].width,
        stageH = res[0].height,
        pot_l_w = res[1].width,
        pot_h_w = res[2].width,
        pot_h_h = res[2].height;
      //计算随机位置区域
      var locArea = {

        top: 0,
        left: 0,
        width: 0,
        height: 0
      };
      //区间差值
      locArea.width = stageW - pot_l_w - pot_h_w - 30;

      locArea.height = stageH - pot_h_h;
      //位置
      locArea.left = pot_l_w + 30 + self.fnGetRandom(locArea.width);

      locArea.top = self.fnGetRandom(locArea.height);
      //
      self.setData({

        pot_h_style: "left:" + locArea.left + "px",
        pot_h_state: locArea
      })

    })
  },
  //返回随机数
  fnGetRandom: function(num) {

    return Math.ceil(Math.random() * num);
  },
  //拖动离开函数
  fnOverMove: function(e) {

    var self = this;

    var query = wx.createSelectorQuery()

    query.select('#pot-l').boundingClientRect()

    query.select('#pot-h').boundingClientRect()

    query.selectViewport().scrollOffset()

    query.exec(function(res) {

      var chaX = Math.abs(res[0].left - res[1].left);

      var chaY = Math.abs(res[0].top - res[1].top);

      if (chaX < 5 && chaY < 5) {

        self.setData({

          isOpenVerify: false
        })

        wx.showToast({

          title: '验证成功',
        })

        var timestamp = Date.parse(new Date());

        timestamp = timestamp / 1000;

        wx.setStorageSync("verifyTime", timestamp)

      } else {

        var pot_loc = {
          x: 0,
          y: 0
        }

        self.setData({

          pot_loc: pot_loc
        })
      }
    })
  },
  //验证防机器人
  fnIsDefendAi: function() {

    var verifyTime = wx.getStorageSync("verifyTime") || "";

    if (verifyTime !== "") {

      verifyTime = parseInt(verifyTime);

      var timestamp = Date.parse(new Date());

      timestamp = timestamp / 1000;

      var cha = timestamp - verifyTime;

      if (cha > (24 * 60 * 60)) {
        //
        return false;
      } else {

        return true;
      }
    } else {

      return false;
    }
  },
  //
  fnGoComment:function(e){
	  
	  //
	  if (e.detail.errMsg !== "getUserInfo:ok") {

		  return;
	  }

	  app.data.nick = e.detail.userInfo.nickName

	  app.data.head = e.detail.userInfo.avatarUrl

	  wx.navigateTo({
		  url: '../forum/forum',
	  })
  },
  //打开说明页
  fnOpenNote:function(){

	  this.setData({

		  isOpenNote: true
	  })
  },
  //关闭说明页
  fnCloseNote:function(){

	  this.setData({

		  isOpenNote: false
	  })
  },
  //获取说明文字
  fnGetNote:function(){

	  wx.request({
		  url: app.data.host + '/wxprogram/lyhd/zpll/public/index.php/index/api/getnote',
		  method: 'GET',
		  data:{
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
  //音频控制
  fnVoice:function(name) {
	  const innerAudioContext = wx.createInnerAudioContext()
	  innerAudioContext.autoplay = false
	  innerAudioContext.loop = false
	  innerAudioContext.volume = 5
	  innerAudioContext.src = this.data.soundUrl[name];

	  innerAudioContext.play();
  },
  //弹出每天提示框
  fnOpenEveryDay:function() {
	 
	  var isOpenEveryDay = false;
	  //金额抢完
	  if (true) {
		  
		  var everyDayHint = wx.getStorageSync("everyDayHint") || "";

		  var timestamp = Date.parse(new Date()); 

		  timestamp = parseInt(timestamp) / 1000;

		  if (everyDayHint != "") {

			  everyDayHint = parseInt(everyDayHint);

			  var cha = timestamp - everyDayHint;

			  if (cha > (24 * 60 * 60)) {
				  
				  isOpenEveryDay = true;
			  } else {

				  isOpenEveryDay = false;
			  }

		  } else {

			  isOpenEveryDay = true;
		  }
	　　　
		  wx.setStorageSync("everyDayHint", timestamp);

		  this.setData({

			  isOpenHint: isOpenEveryDay
		  })	
	  }

	  this.isOpenHint = true;
  },
  //群id
  fnGeFlocktId: function (data) {

	  wx.request({
		  //后台接口地址
		  url: app.data.host + '/wxprogram/lyhd/zpll/public/index.php/index/api/getsharetickt',
		  data: {
			  code: data.code,
			  iv: encodeURIComponent(data.iv),
			  encryptedData: encodeURIComponent(data.encryptedData)
		  },
		  method: 'GET',
		  header: {
			  'content-type': 'application/json'
		  },
		  success: function (res) {
			  //console.log(res)
		  }
	  })
  },
  fnShareaddtimes:function(){

	  var myuserid = wx.getStorageSync('myuserid');
	  wx.request({
		  url: app.data.host + '/wxprogram/lyhd/zpll/public/index.php/index/api/shareaddtimes',
		  method: 'GET',
		  data: {
			  merchantid: app.data.ditch,
			  userid: myuserid
		  },
		  header: {
			  'content-type': 'application/json'
		  },
		  success: function (res) {
			  var data2 = res.data;
			  if (data2.code == 200) {
				  //获取用户信息-刷新
				  this.GetUserMsg();
				  //获取任务列表
				  this.GetTask();
				  //显示弹窗提示
				  this.setData({
					  //tasknotice_show: 'block'
				  });
			  }
		  }.bind(this)
	  });
  },
  //领取信息
  fnGetmsg: function (pid) {

	  this.setData({
		  ['mail.pid']: pid
	  })

	  var userid = wx.getStorageSync("myuserid");

	  wx.request({
		  url: app.data.host + "/wxprogram/lyhd/zpll/public/index.php/index/api/getprizelog",
		  method: 'GET',
		  data: {
			  merchantid: app.data.ditch,
			  userid: userid,
			  pid: pid
		  },
		  header: {
			  'content-type': 'application/json'
		  },
		  success: function (res) {

			  if (res.data.code == 200) {

				  if (res.data.data.address) {

					  var mailArr = res.data.data.address.split("_")

					  this.setData({
						  ["mail.name"]: mailArr[0],
						  ["mail.tel"]: mailArr[1],
						  ["mail.address"]: mailArr[2]
					  })
				  }

				  if (res.data.data.order) {

					  this.setData({
						  ["mail.order"]: res.data.data.order
					  })
				  }

				  else {
					  this.setData({
						  ["mail.order"]: null
					  })
				  }
			  }
		  }.bind(this)
	  });
  },
  //提交领取信息
  fnSubmit: function () {

	  if (!this.fnFromTest()) {

		  return;
	  }

	  var userid = wx.getStorageSync("myuserid");

	  var address = this.data.mail.name + "_" + this.data.mail.tel + "_" + this.data.mail.address;

	  wx.request({
		  url: app.data.host + "/wxprogram/lyhd/zpll/public/index.php/index/api/setaddress",
		  method: 'GET',
		  data: {
			  merchantid: app.data.ditch,
			  userid: userid,
			  pid: this.data.mail.pid,
			  address: address,
			  fid: this.data.winningAward.fid
		  },
		  header: {
			  'content-type': 'application/json'
		  },
		  success: function (res) {
			  if (res.data.code == 200) {
				  wx.showToast({
					  title: '提交成功',
					  icon: 'success'
				  })
			  }
			  else {
				  wx.showToast({
					  title: '信息未变动',
					  icon: 'success'
				  })
			  }
			  this.setData({
				  isOpenAddress: false
			  })
		  }.bind(this)
	  });
  },
  //输入框onchang事件
  fnNameInputChang: function (e) {
	  this.setData({
		  ["mail.name"]: e.detail.value
	  })
  },
  fnTelInputChang: function (e) {
	  this.setData({
		  ["mail.tel"]: e.detail.value
	  })
  },
  fnAddrInputChang: function (e) {
	  this.setData({
		  ["mail.address"]: e.detail.value
	  })
  },
  //表单验证
  fnFromTest: function () {

	  if (!(/^1(3|4|5|7|8)\d{9}$/.test(this.data.mail.tel))) {

		  wx.showToast({
			  title: '号码格式错误',
		  })

		  return false;
	  }

	  if (this.data.mail.name.length == 0) {

		  wx.showToast({
			  title: '请输入姓名',
		  })

		  return false;
	  }

	  if (this.data.mail.address.length == 0) {

		  wx.showToast({
			  title: '请输入地址',
		  })

		  return false;
	  }

	  return true;
  },
  //
  fnCloseAddress:function(){
	  this.setData({
		  isOpenAddress: false
	  })
  }
});