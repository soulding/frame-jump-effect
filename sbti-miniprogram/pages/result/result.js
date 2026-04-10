Page({
  data: {
    result: null,
    dimList: []
  },

  onLoad() {
    const result = wx.getStorageSync('sbti_result')
    if (result) {
      this.setData({ result })
      this.processDimensions(result.dimensions)
    } else {
      wx.redirectTo({
        url: '/pages/index/index'
      })
    }
  },

  processDimensions(dimensions) {
    const dimNames = {
      'S1': '自我认知',
      'S2': '自我清晰',
      'S3': '成就动机',
      'E1': '依恋焦虑',
      'E2': '投入程度',
      'E3': '独立需求',
      'A1': '人性看法',
      'A2': '规则态度',
      'A3': '意义追求',
      'Ac1': '趋避倾向',
      'Ac2': '决策风格',
      'Ac3': '执行风格',
      'So1': '社交倾向',
      'So2': '亲密需求',
      'So3': '社交面具'
    }

    const dimList = Object.keys(dimensions).map(key => ({
      key,
      name: dimNames[key] || key,
      score: dimensions[key].toFixed(1)
    }))

    this.setData({ dimList })
  },

  saveImage() {
    wx.showToast({
      title: '截图保存即可',
      icon: 'none',
      duration: 2000
    })
    
    // 提示用户使用手机截图功能
    wx.showModal({
      title: '保存图片',
      content: '请使用手机截图功能保存测试结果',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  retest() {
    wx.clearStorageSync()
    wx.redirectTo({
      url: '/pages/index/index'
    })
  }
})
