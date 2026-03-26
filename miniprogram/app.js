App({
  onLaunch() {
    console.log('App launched - 跃出相框');
    
    // 初始化云开发（降级方案）
    if (wx.cloud) {
      wx.cloud.init({
        env: 'your-env-id', // 替换为你的云环境 ID
        traceUser: true
      });
      console.log('Cloud development initialized');
    } else {
      console.warn('Cloud development not available');
    }
  },
  
  globalData: {
    modelLoaded: false,
    aiModel: null
  }
})
