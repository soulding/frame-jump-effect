# 人体分割云函数

## 功能说明

调用微信 AI 开放平台的人体分割 API，为小程序提供 AI 抠图能力。

## 部署步骤

### 1. 准备工作

1. 访问 [微信 AI 开放平台](https://ai.weixin.qq.com/)
2. 使用小程序管理员微信扫码登录
3. 创建应用，获取 `AppID` 和 `AppSecret`
4. 开通 **人体分割** 服务

### 2. 配置环境变量

在云函数目录创建 `.env` 文件（不要提交到 Git）：

```bash
AI_APPID=your_appid_here
AI_SECRET=your_secret_here
```

或者在代码中直接配置（不推荐）：

```javascript
// index.js
const AI_CONFIG = {
  appid: 'your_appid_here',
  secret: 'your_secret_here',
  segmentUrl: 'https://api.weixin.qq.com/cv/img/segment'
};
```

### 3. 安装依赖

```bash
cd segment-person
npm install
```

### 4. 上传部署

1. 打开微信开发者工具
2. 右键点击 `segment-person` 目录
3. 选择 **上传并部署：云端安装依赖**
4. 等待部署完成

### 5. 测试云函数

在开发者工具控制台测试：

```javascript
wx.cloud.callFunction({
  name: 'segment-person',
  data: {
    imageBase64: 'your_base64_image_data'
  },
  success: console.log,
  fail: console.error
});
```

## 调用示例

### 小程序端调用

```javascript
// 读取图片为 Base64
const fs = wx.getFileSystemManager();
const res = fs.readFileSync(imagePath, 'base64');

// 调用云函数
wx.cloud.callFunction({
  name: 'segment-person',
  data: {
    imageBase64: res
  },
  success: (res) => {
    if (res.result.success) {
      // 获取分割后的图片
      const imageUrl = res.result.imageUrl;
      
      // 下载图片
      wx.cloud.downloadFile({
        fileID: imageUrl,
        success: (res) => {
          console.log('下载成功:', res.tempFilePath);
        }
      });
    } else {
      console.error('分割失败:', res.result.errMsg);
    }
  }
});
```

## API 参数

### 输入参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| imageBase64 | String | 是 | Base64 编码的图片数据 |
| type | String | 否 | 分割类型，默认 'person' |

### 返回参数

| 参数 | 类型 | 说明 |
|------|------|------|
| success | Boolean | 是否成功 |
| imageUrl | String | 云文件 ID（成功时） |
| width | Number | 图片宽度（成功时） |
| height | Number | 图片高度（成功时） |
| errMsg | String | 错误信息（失败时） |
| errCode | Number | 错误码（失败时） |

## 错误处理

### 常见错误码

| 错误码 | 说明 | 解决方案 |
|--------|------|---------|
| -1 | 系统错误 | 重试或联系技术支持 |
| 40001 | 无效 token | 检查 AppID 和 Secret |
| 40003 | 无效图片 | 检查图片格式和大小 |
| 40004 | 分割失败 | 图片中未检测到人体 |

### 错误处理建议

```javascript
try {
  const result = await wx.cloud.callFunction({
    name: 'segment-person',
    data: { imageBase64: base64Data }
  });
  
  if (!result.result.success) {
    // 降级方案：使用其他 AI 服务或提示用户
    console.warn('AI 分割失败，使用降级方案');
  }
} catch (error) {
  // 网络错误或其他异常
  console.error('调用失败:', error);
}
```

## 性能优化

### 1. 图片压缩

在调用前压缩图片：

```javascript
wx.compressImage({
  src: imagePath,
  quality: 80,
  compressedWidth: 1024,
  compressedHeight: 1024
});
```

### 2. 缓存结果

对相同图片缓存分割结果：

```javascript
const cache = new Map();

async function getCachedSegmentation(imagePath) {
  const cacheKey = imagePath;
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  const result = await segmentPerson(imagePath);
  cache.set(cacheKey, result);
  
  return result;
}
```

### 3. 并发控制

限制同时进行的分割请求：

```javascript
let processingCount = 0;
const MAX_CONCURRENT = 3;

async function segmentWithLimit(imagePath) {
  if (processingCount >= MAX_CONCURRENT) {
    throw new Error('并发数已达上限');
  }
  
  processingCount++;
  try {
    return await segmentPerson(imagePath);
  } finally {
    processingCount--;
  }
}
```

## 费用说明

### 微信 AI 开放平台

- **免费额度**: 每月 100-1000 次（根据服务）
- **超出后**: 约 0.02-0.1 元/次
- **查看用量**: https://ai.weixin.qq.com/console

### 微信云开发

- **免费额度**: 每月 1000 万次调用
- **云存储**: 5GB 免费
- **查看用量**: 微信开发者工具 → 云开发 → 统计

## 监控与日志

### 查看云函数日志

1. 打开微信开发者工具
2. 点击 **云开发** 按钮
3. 进入 **云函数** 页面
4. 点击 `segment-person` 查看日志

### 添加性能监控

```javascript
// index.js
exports.main = async (event, context) => {
  const startTime = Date.now();
  
  try {
    const result = await segmentPerson(event.imageBase64);
    
    const duration = Date.now() - startTime;
    console.log(`处理耗时：${duration}ms`);
    
    // 上报性能数据
    if (duration > 3000) {
      console.warn('慢请求:', { duration, imageSize: event.imageBase64.length });
    }
    
    return result;
  } catch (error) {
    console.error('执行失败:', error);
    throw error;
  }
};
```

## 安全建议

1. **不要硬编码密钥**: 使用环境变量或云函数环境变量
2. **添加调用频率限制**: 防止恶意调用
3. **验证用户身份**: 检查 `event.userInfo`
4. **限制图片大小**: 避免过大图片消耗资源

```javascript
// 添加调用限制
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

if (event.imageBase64.length > MAX_IMAGE_SIZE) {
  return {
    success: false,
    errMsg: '图片过大'
  };
}
```

## 参考资源

- [微信 AI 开放平台文档](https://ai.weixin.qq.com/docs)
- [微信云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
- [人体分割 API 文档](https://ai.weixin.qq.com/docs/vision/segment)

---

**最后更新**: 2026-03-26
