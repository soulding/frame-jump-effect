# 微信 AI 开放平台接入指南

## 📋 接入方式对比

### 方式一：微信 AI 插件 ⭐ 推荐

**优点**:
- 官方支持，兼容性好
- 纯前端调用，无需后端
- 性能优秀，速度快
- 免费额度充足

**缺点**:
- 需要在小程序后台配置
- 插件 ID 可能变化

### 方式二：微信 AI 开放平台 HTTP API

**优点**:
- 灵活，不受插件限制
- 可使用多种 AI 能力

**缺点**:
- 需要后端服务器
- 需要处理鉴权
- 有网络延迟

### 方式三：云函数 + TensorFlow.js

**优点**:
- 完整 TF.js 功能
- 可自定义模型

**缺点**:
- 云函数费用
- 网络延迟
- 配置复杂

---

## 🚀 方式一：AI 插件接入（推荐）

### 步骤 1: 查找 AI 插件

1. 登录 [微信公众平台](https://mp.weixin.qq.com/)
2. 进入你的小程序后台
3. 点击 **设置** → **第三方设置** → **插件**
4. 点击 **添加插件**
5. 搜索关键词："AI"、"人体分割"、"图像分割"

**推荐插件**:
- **腾讯 AI 优图** (插件 ID 可能变化，请搜索确认)
- **图像分割助手**
- **AI 抠图插件**

### 步骤 2: 申请插件

1. 找到合适的 AI 插件后，点击 **申请使用**
2. 填写申请信息：
   - 使用场景描述
   - 预计调用量
   - 联系方式
3. 等待审核通过（通常 1-3 个工作日）

### 步骤 3: 配置插件

审核通过后：

1. 在小程序后台 **插件** 页面找到已添加的插件
2. 记录 **插件 AppID**（provider）
3. 查看插件文档，获取调用方法

### 步骤 4: 修改 app.json

```json
{
  "plugins": {
    "aiPlugin": {
      "version": "1.0.0",
      "provider": "wx7c8d593b2c3a7703"
    }
  }
}
```

**注意**: 
- `provider` 替换为实际的插件 AppID
- `version` 使用插件最新版本

### 步骤 5: 调用插件 API

参考已创建的 `utils/wechat-ai-loader.js`:

```javascript
import { WeChatAILoader } from './wechat-ai-loader';

// 获取 AI 实例
const aiModel = await WeChatAILoader.getInstance();

// 执行分割
const result = await aiModel.segmentPerson(imagePath);

// result 包含:
// - imageUrl: 透明背景图片路径
// - maskPath: 分割掩码路径
// - width, height: 图片尺寸
```

### 步骤 6: 测试验证

1. 在微信开发者工具中编译
2. 选择一张人物照片
3. 检查控制台日志
4. 验证抠图效果

---

## 🌐 方式二：HTTP API 接入

### 步骤 1: 注册微信 AI 开放平台

1. 访问 https://ai.weixin.qq.com/
2. 使用小程序管理员微信扫码登录
3. 创建应用，获取 `AppID` 和 `AppSecret`

### 步骤 2: 开通人体分割能力

1. 在控制台找到 **图像技术** → **人体分割**
2. 点击 **开通服务**
3. 查看接口文档和定价

### 步骤 3: 创建云函数（后端）

```javascript
// cloudfunctions/segment-person/index.js
const cloud = require('wx-server-sdk');
const axios = require('axios');
const querystring = require('querystring');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

// 微信 AI 开放平台配置
const AI_CONFIG = {
  appid: 'YOUR_APPID',
  secret: 'YOUR_SECRET',
  url: 'https://api.weixin.qq.com/cv/img/segment'
};

// 获取访问令牌
async function getAccessToken() {
  const params = {
    grant_type: 'client_credential',
    appid: AI_CONFIG.appid,
    secret: AI_CONFIG.secret
  };
  
  const res = await axios.get(
    'https://api.weixin.qq.com/cgi-bin/token',
    { params }
  );
  
  return res.data.access_token;
}

// 云函数入口
exports.main = async (event) => {
  try {
    const { imageBase64 } = event;
    
    // 获取 access_token
    const accessToken = await getAccessToken();
    
    // 调用人体分割 API
    const params = {
      access_token: accessToken,
      type: 'person' // 人像分割
    };
    
    const response = await axios.post(
      AI_CONFIG.url,
      {
        img: imageBase64,
        type: 'person'
      },
      { params }
    );
    
    const result = response.data;
    
    if (result.errcode === 0) {
      // 上传结果到云存储
      const uploadResult = await cloud.uploadFile({
        cloudPath: `segmented/${Date.now()}.png`,
        fileContent: Buffer.from(result.img_base64, 'base64')
      });
      
      return {
        success: true,
        imageUrl: uploadResult.fileID,
        width: result.width,
        height: result.height
      };
    } else {
      return {
        success: false,
        errMsg: result.errmsg
      };
    }
  } catch (error) {
    console.error('Segmentation error:', error);
    return {
      success: false,
      errMsg: error.message
    };
  }
};
```

### 步骤 4: 部署云函数

```bash
# 安装依赖
cd cloudfunctions/segment-person
npm install

# 在微信开发者工具中右键 → 上传并部署：云端安装依赖
```

### 步骤 5: 小程序端调用

```javascript
// utils/wechat-ai-loader.js 中的 loadCloudFunction 方法会自动调用

const result = await wx.cloud.callFunction({
  name: 'segment-person',
  data: {
    imageBase64: base64Data
  }
});
```

---

## 🔧 方式三：云函数 + TensorFlow.js

### 步骤 1: 创建云函数

```javascript
// cloudfunctions/segment-tfjs/index.js
const cloud = require('wx-server-sdk');
const tf = require('@tensorflow/tfjs-node');
const bodyPix = require('@tensorflow-models/body-pix');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

let model = null;

// 加载模型（单例）
async function loadModel() {
  if (!model) {
    model = await bodyPix.load({
      architecture: 'MobileNetV1',
      outputStride: 16,
      multiplier: 0.75,
      quantBytes: 2
    });
  }
  return model;
}

// 处理分割
async function segmentPerson(imageBase64) {
  const model = await loadModel();
  
  // 解码图片
  const image = tf.node.decodeImage(imageBase64, 3);
  
  // 执行分割
  const segmentation = await model.segmentPerson(image);
  
  // 生成透明图
  const imageData = image.arraySync();
  const mask = segmentation.data;
  
  const transparentData = new Uint8Array(imageData.length);
  for (let i = 0; i < imageData.length; i += 4) {
    const pixelIndex = i / 4;
    if (mask[pixelIndex] === 1) {
      transparentData[i] = imageData[i];
      transparentData[i + 1] = imageData[i + 1];
      transparentData[i + 2] = imageData[i + 2];
      transparentData[i + 3] = 255;
    } else {
      transparentData[i + 3] = 0; // 透明
    }
  }
  
  // 转换为 Buffer
  return Buffer.from(transparentData);
}

exports.main = async (event) => {
  try {
    const { imageBase64 } = event;
    
    const transparentBuffer = await segmentPerson(imageBase64);
    
    // 上传到云存储
    const uploadResult = await cloud.uploadFile({
      cloudPath: `segmented/${Date.now()}.png`,
      fileContent: transparentBuffer
    });
    
    return {
      success: true,
      imageUrl: uploadResult.fileID
    };
  } catch (error) {
    console.error('TF.js segmentation error:', error);
    return {
      success: false,
      errMsg: error.message
    };
  }
};
```

### 步骤 2: 配置 package.json

```json
{
  "name": "segment-tfjs",
  "version": "1.0.0",
  "description": "TensorFlow.js 人体分割",
  "main": "index.js",
  "dependencies": {
    "@tensorflow/tfjs-node": "^4.0.0",
    "@tensorflow-models/body-pix": "^2.2.0",
    "wx-server-sdk": "~2.6.3"
  }
}
```

### 步骤 3: 安装依赖并部署

```bash
cd cloudfunctions/segment-tfjs
npm install

# 在开发者工具中上传并部署
```

---

## 📝 配置检查清单

### AI 插件方式

- [ ] 在小程序后台添加 AI 插件
- [ ] 记录插件 AppID（provider）
- [ ] 修改 `app.json` 配置插件
- [ ] 修改 `app.js` 初始化云开发（可选）
- [ ] 测试插件调用

### HTTP API 方式

- [ ] 注册微信 AI 开放平台
- [ ] 创建应用，获取 AppID 和 Secret
- [ ] 开通人体分割服务
- [ ] 创建云函数 `segment-person`
- [ ] 配置环境变量或硬编码 AppID/Secret
- [ ] 安装依赖并部署
- [ ] 测试云函数调用

### TF.js 方式

- [ ] 创建云函数 `segment-tfjs`
- [ ] 配置 package.json 依赖
- [ ] 安装依赖（@tensorflow/tfjs-node, @tensorflow-models/body-pix）
- [ ] 部署云函数
- [ ] 测试调用

---

## 🧪 测试验证

### 1. 单元测试

```javascript
// 测试 AI 加载
const aiModel = await WeChatAILoader.getInstance();
console.assert(aiModel !== null, 'AI 模型加载失败');

// 测试分割
const result = await aiModel.segmentPerson(testImagePath);
console.assert(result.imageUrl !== null, '分割失败');
console.assert(result.width > 0, '宽度异常');
console.assert(result.height > 0, '高度异常');
```

### 2. 集成测试

1. 打开小程序
2. 选择测试照片
3. 观察加载提示
4. 检查抠图效果
5. 验证透明背景
6. 测试相框合成

### 3. 性能测试

```javascript
const start = Date.now();
const result = await aiModel.segmentPerson(imagePath);
const duration = Date.now() - start;

console.log(`分割耗时：${duration}ms`);
console.assert(duration < 3000, '性能不达标');
```

---

## ⚠️ 常见问题

### Q1: 插件申请被拒绝

**原因**: 使用场景描述不清晰

**解决**: 
- 详细说明功能用途
- 提供界面设计稿
- 说明预计用户量

### Q2: 调用失败，报错 "plugin not found"

**原因**: 插件未正确配置

**解决**:
- 检查 `app.json` 中 plugin 配置
- 确认 provider 正确
- 重新编译小程序

### Q3: 云函数超时

**原因**: 图片过大或网络问题

**解决**:
- 压缩图片至 1024px 以内
- 增加云函数超时时间
- 检查网络状态

### Q4: 抠图边缘有锯齿

**原因**: 分割阈值或图片质量问题

**解决**:
- 调整 segmentationThreshold
- 使用更高分辨率图片
- 尝试边缘平滑处理

---

## 💰 费用说明

### AI 插件

- 通常有免费额度（如每月 1000 次）
- 超出后按次计费（约 0.01-0.05 元/次）
- 具体查看插件详情

### HTTP API

- 免费额度：通常每月 100-1000 次
- 超出后：约 0.02-0.1 元/次
- 量大可谈优惠

### 云函数

- 免费额度：每月 1000 万次调用
- 超出后：约 0.00001152 元/次
- 包含在微信云开发套餐中

---

## 📚 参考资源

- [微信 AI开放平台](https://ai.weixin.qq.com/)
- [微信小程序插件开发](https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/)
- [微信云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
- [腾讯优图 AI 能力](https://open.youtu.qq.com/)

---

**最后更新**: 2026-03-26  
**适用版本**: 微信小程序基础库 2.19.4+
