Page({
  data: {
    gfs: [
      {
        'src': 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3906065419,691362102&fm=26&gp=0.jpg',
        'name': '女嘉宾',
        'jf': '99',
        'old': '原价：15元',
        'status': '1'
      },
      {
        'src': 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1370942955,3516846572&fm=27&gp=0.jpg',
        'name': '女嘉宾',
        'jf': '99',
        'old': '原价：15元',
        'status': '1'
      },
      {
        'src': 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2905497932,2662226436&fm=27&gp=0.jpg',
        'name': '女嘉宾',
        'jf': '99',
        'old': '原价：15元',
        'status': '1'
      },
      {
        'src': 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1762382510,3359001242&fm=27&gp=0.jpg',
        'name': '女嘉宾',
        'jf': '99',
        'old': '原价：15元',
        'status': '1'
      },
      {
        'src': 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=4126417867,1781657338&fm=11&gp=0.jpg',
        'name': '女嘉宾',
        'jf': '99',
        'old': '原价：15元',
        'status': '1'
      },
      {
        'src': 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1536922623853&di=864cd839a3285f0c3cf8c11b22ea0118&imgtype=0&src=http%3A%2F%2Fh.hiphotos.baidu.com%2Fbaike%2Fpic%2Fitem%2Feac4b74543a98226a06a9d078782b9014a90eb63.jpg',
        'name': '女嘉宾',
        'jf': '99',
        'old': '原价：15元',
        'status': '1'
      },
      {
        'src': 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3312849660,2614984666&fm=27&gp=0.jpg',
        'name': '女嘉宾',
        'jf': '99',
        'old': '原价：15元',
        'status': '1'
      },
      {
        'src': 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1649072770,1390903968&fm=26&gp=0.jpg',
        'name': '女嘉宾',
        'jf': '99',
        'old': '原价：15元',
        'status': '1'
      },
      {
        'src': 'http://img4.imgtn.bdimg.com/it/u=819303681,2934688801&fm=26&gp=0.jpg',
        'name': '女嘉宾',
        'jf': '99',
        'old': '原价：15元',
        'status': '1'
      },
      {
        'src': 'http://img2.imgtn.bdimg.com/it/u=2370847941,1762187681&fm=11&gp=0.jpg',
        'name': '女嘉宾',
        'jf': '99',
        'old': '原价：15元',
        'status': '1'
      }
    ],

  },

  lower: function () {
    var result = this.data.gfs;
    var resArr = [];
    for (let i = 0; i < 20; i++) {
      resArr.push(i);
    };
    var cont = result.concat(resArr);
    console.log(resArr.length);
    if (cont.length >= 100) {
      wx.showToast({
        title: '已无更多女嘉宾',
        icon: 'none'
      });
      return false;
    }
    else {
      wx.showLoading({
        title: '加载中',
        icon: 'loading',
      });
      setTimeout(() => {
        this.setData({
          gfs: cont
        });
        wx.hideLoading();
      }, 1500)
    }
  },
  onLoad: function () {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight
        })
      }
    })
  },

 

  // 兑换 二次确认
  excGfFunc: function (e) {
    // console.log(e);
    wx.showModal({
      title: '提示',
      content: '你想拥有 ' + e.currentTarget.dataset.name + '？',
      confirmText: '想',
      cancelText: '不想',
      success: function (res) {
        setTimeout(function () {
          if (res.confirm) {
            wx.showLoading({
              title: '正在预约...',
            })
            setTimeout(function () {
              wx.showToast({
                title: '是你的了',
                icon: 'success'
              })
            }, 1000)

          } else if (res.cancel) {
            wx.showToast({
              title: '高冷的一逼',
              icon: 'none'
            })
          }
        }, 500)
      }
    })
  }

})