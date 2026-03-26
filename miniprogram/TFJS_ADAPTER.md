# TensorFlow.js 微信小程序适配指南

## ⚠️ 重要说明

微信小程序**不直接支持**在小程序环境中运行 TensorFlow.js，原因：

1. **环境限制**: 小程序没有完整的 DOM/BOM API
2. **WebGL 限制**: 小程序 Canvas 不支持 WebGL
3. **包体积限制**: TF.js 模型文件较大
4. **性能问题**: 移动端 JS 引擎性能有限

## 推荐解决方案

### 方案一：使用微信 AI 开放平台 ⭐ 推荐

微信官方提供人体分割能力，无需引入第三方库。

```javascript
// 调用微信 AI 人体分割
wx.ai.segmentPerson({
  imagePath: tempFilePath,
  success: (res) => {
    // res.mask: 分割掩码
    // res.image: 处理后的图片
    console.log('分割成功', res);
  },
  fail: (err) => {
    console.error('分割失败', err);
  }
});
```

**优点**:
- 官方支持，兼容性好
- 性能优化，速度快
- 无需加载外部模型
- 持续更新维护

**接入步骤**:
1. 登录 [微信 AI 开放平台](https://ai.weixin.qq.com/)
2. 创建应用，获取权限
3. 在小程序后台开通 AI 能力
4. 按文档调用 API

### 方案二：云函数 + TensorFlow.js

在后端云函数中运行 TF.js，前端只负责展示。

```javascript
// 云函数入口 (cloudfunctions/segment/index.js)
const tf = require('@tensorflow/tfjs-node');
const bodyPix = require('@tensorflow-models/body-pix');

exports.main = async (event) => {
  const { imageBase64 } = event;
  
  // 加载模型
  const model = await bodyPix.load();
  
  // 解码图片
  const image = tf.node.decodeImage(imageBase64, 3);
  
  // 执行分割
  const segmentation = await model.segmentPerson(image);
  
  // 生成透明图片
  const transparentImage = await processSegmentation(image, segmentation);
  
  return {
    imageBase64: transparentImage
  };
};
```

```javascript
// 小程序端调用
wx.cloud.callFunction({
  name: 'segment',
  data: {
    imageBase64: base64Data
  },
  success: (res) => {
    // 获取处理后的图片
    const imagePath = res.result.imageBase64;
  }
});
```

**优点**:
- 完整 TF.js 功能
- 不受小程序环境限制
- 可使用最新模型

**缺点**:
- 需要云开发环境
- 有网络延迟
- 产生云函数调用费用

### 方案三：第三方 AI 插件

使用微信小程序插件市场的 AI 能力插件。

```javascript
// 在 app.json 中配置插件
"plugins": {
  "aiPlugin": {
    "version": "1.0.0",
    "provider": "wx1234567890abcdef"
  }
}

// 使用插件
const plugin = requirePlugin('aiPlugin');
plugin.segmentPerson({
  imagePath: tempFilePath,
  success: (res) => {
    // 处理结果
  }
});
```

**查找插件**:
1. 打开微信开发者工具
2. 点击"插件" → "添加插件"
3. 搜索"人体分割"、"AI 抠图"等关键词
4. 选择合适的插件接入

### 方案四：后端 API 服务

自建或使用第三方后端 API 服务。

```javascript
// 调用后端 API
wx.request({
  url: 'https://your-api.com/segment',
  method: 'POST',
  data: {
    image: base64Data
  },
  success: (res) => {
    const { maskUrl, imageUrl } = res.data;
    // 下载处理后的图片
  }
});
```

**可选服务**:
- 阿里云视觉智能
- 腾讯云图像分析
- 百度 AI 开放平台
- 商汤科技
- 旷视科技

## 修改建议

### 修改 `utils/bodypix-loader.js`

替换为微信 AI 或云函数方案：

```javascript
// utils/bodypix-loader.js (修改版)

export class ModelLoader {
  static async getInstance() {
    // 方案一：微信 AI
    return {
      type: 'wechat-ai',
      segmentPerson: async (imagePath) => {
        return new Promise((resolve, reject) => {
          wx.ai.segmentPerson({
            imagePath: imagePath,
            success: resolve,
            fail: reject
          });
        });
      }
    };
    
    // 方案二：云函数
    // return {
    //   type: 'cloud-function',
    //   segmentPerson: async (imagePath) => {
    //     const res = await wx.cloud.callFunction({
    //       name: 'segment',
    //       data: { imagePath }
    //     });
    //     return res.result;
    //   }
    // };
  }
}
```

### 修改 `utils/image-processor.js`

适配新的分割接口：

```javascript
static async segmentImage(model, imagePath, width, height) {
  if (model.type === 'wechat-ai') {
    // 调用微信 AI
    const result = await model.segmentPerson(imagePath);
    return result.maskPath; // 返回掩码或透明图路径
  } else if (model.type === 'cloud-function') {
    // 调用云函数
    const result = await model.segmentPerson(imagePath);
    return result.transparentImagePath;
  }
  
  // 原有 TF.js 逻辑作为降级方案
  // ...
}
```

## 性能对比

| 方案 | 加载时间 | 处理时间 | 准确率 | 成本 |
|------|---------|---------|--------|------|
| 微信 AI | < 100ms | 500-1000ms | 高 | 免费额度 |
| 云函数 | < 100ms | 1000-2000ms | 高 | 按调用计费 |
| 第三方插件 | < 100ms | 500-1500ms | 中 - 高 | 视插件而定 |
| 后端 API | < 100ms | 500-2000ms | 高 | 按调用计费 |
| 本地 TF.js | 3-5 秒 | 2-5 秒 | 高 | 免费 |

## 推荐实施路径

### MVP 版本（快速上线）
1. 使用微信 AI 开放平台
2. 实现基础抠图功能
3. 完成相框合成
4. 上线验证效果

### 迭代版本（优化体验）
1. 收集用户反馈
2. 优化相框设计
3. 添加更多交互
4. 性能调优

### 扩展版本（增加功能）
1. 多人物支持
2. 自定义相框
3. 滤镜和调色
4. 视频支持

## 参考资源

- [微信 AI 开放平台](https://ai.weixin.qq.com/)
- [微信小程序云开发](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
- [TensorFlow.js 文档](https://js.tensorflow.org/)
- [BodyPix 模型](https://github.com/tensorflow/tfjs-models/tree/master/body-pix)
