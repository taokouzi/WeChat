// pages/cooperation/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fwhz:'此处指的是您注册成功的账号及密码。请了解账号在注册之后不可变更，而密码可以通过我们提供的服务进行修改。您对于您的账号及密码的保管以及使用该账号和密码所进行的一切行动负有完全的责任。请不要将账号、密码转让或出借给他人使用。因为您的保管疏忽或其他任何个人行为导致您的账号或密码遭他人非法使用及因此所衍生的任何后果，我们不承担任何责任。',
    clql:'我们将使用通常可以获得的安全技术和程序来保护您的个人资料不被未经授权的访问、使用或泄漏。对于非因我们的疏忽而造成您账号的丢失或您个人资料的泄密，我们不承担任何责任',
    hzqx1:'您允许我们披露这些个人资料；',
    hzqx2:'有关法律法规或行政规章要求我们披露您的个人资料；',
    hztk:'您有权在使用我们提供的产品和服务期间监督我们及我们的工作人员是否按照我们所公布的标准向您提供产品和服务，也可以随时向我们提出与我们的产品和服务有关的意见和建议。'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },


  onShareAppMessage: function (e) {
    var that = this;
    if (e.from === 'menu') {
      // 来自页面内转发按钮
      console.log(e.target)
    }
    return {
      title: '广点点（广告接单平台）',
      path: '/pages/index/index?from=about',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  

})