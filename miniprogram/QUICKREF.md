# 快速参考卡

## 项目命令

```bash
# 查看项目结构
tree miniprogram/ -L 3

# 检查文件大小
find miniprogram/frames -type f -exec ls -lh {} \;
```

## 核心 API

### 图片选择
```javascript
wx.chooseImage({
  count: 1,
  sizeType: ['compressed'],
  sourceType: ['album', 'camera'],
  success: (res) => {
    const path = res.tempFilePaths[0];
  }
})
```

### 图片压缩
```javascript
wx.compressImage({
  src: imagePath,
  quality: 80,
  compressedWidth: 1024,
  compressedHeight: 1024
})
```

### Canvas 绘制
```javascript
const ctx = canvas.getContext('2d');
ctx.drawImage(img, x, y, width, height);
ctx.save();
ctx.translate(x, y);
ctx.scale(s, s);
ctx.rotate(angle);
ctx.restore();
```

### 保存图片
```javascript
wx.canvasToTempFilePath({
  canvas: canvas,
  fileType: 'png',
  success: (res) => {
    wx.saveImageToPhotosAlbum({
      filePath: res.tempFilePath
    })
  }
})
```

### 微信 AI 分割（推荐）
```javascript
wx.ai.segmentPerson({
  imagePath: tempFilePath,
  success: (res) => {
    const mask = res.mask;
    const image = res.image;
  }
})
```

### 云函数调用
```javascript
wx.cloud.callFunction({
  name: 'segment',
  data: { imageBase64: base64Data }
})
```

## 关键配置

### BodyPix 配置（如使用）
```javascript
const bodyPixConfig = {
  architecture: 'MobileNetV1',
  outputStride: 16,
  multiplier: 0.75,
  quantBytes: 2
};

const segmentationConfig = {
  flipHorizontal: false,
  internalResolution: 'medium',
  segmentationThreshold: 0.7
};
```

### 手势配置
```javascript
const GestureConfig = {
  drag: {
    enabled: true,
    bounds: { minX: -100, maxX: 100, minY: -50, maxY: 150 }
  },
  pinch: {
    enabled: true,
    minScale: 0.5,
    maxScale: 1.5
  },
  rotate: {
    enabled: true,
    minAngle: -30,
    maxAngle: 30
  }
};
```

### 相框配置
```javascript
{
  id: 'classic',
  name: '经典相框',
  background: { url: '/frames/classic_bg.png', width: 375, height: 500 },
  foreground: { url: '/frames/classic_fg.png', width: 375, height: 500 },
  subjectPosition: { x: 0, y: 0, scale: 1.0 }
}
```

## 调试技巧

### 性能监控
```javascript
const start = Date.now();
// ... 执行操作
const duration = Date.now() - start;
console.log(`耗时：${duration}ms`);
```

### 内存检查
```javascript
// 微信开发者工具 → Console → Memory
// 观察内存使用趋势
```

### Canvas 调试
```javascript
// 绘制辅助线
ctx.strokeStyle = 'red';
ctx.strokeRect(x, y, width, height);
```

### 真机调试
```
1. 微信开发者工具 → 真机调试
2. 扫码连接
3. 查看真机日志
```

## 常见问题

### Q: 图片加载失败？
```javascript
// 检查路径是否正确
// 使用绝对路径：/miniprogram/frames/xxx.png
// 或使用 wx.getFileSystemManager().readFile
```

### Q: Canvas 不显示？
```javascript
// 确保使用 type="2d"
// 确保在 ready 后初始化
// 检查 dpr 缩放
```

### Q: 手势不响应？
```javascript
// 检查 touch 事件绑定
// 确保 preventDefault 正确使用
// 检查 z-index 层级
```

### Q: 保存失败？
```javascript
// 检查相册权限
// 使用 wx.authorize 提前申请
// 处理 auth deny 错误
```

## 文件路径速查

```
项目根目录/
├── miniprogram/
│   ├── pages/frame-composer/
│   │   ├── index.js          ← 主逻辑
│   │   ├── index.wxml        ← 页面结构
│   │   └── index.wxss        ← 样式
│   ├── utils/
│   │   ├── bodypix-loader.js ← AI 模型
│   │   ├── image-processor.js← 图像处理
│   │   ├── frame-composer.js ← 图层合成
│   │   └── gesture-handler.js← 手势
│   ├── frames/               ← 相框素材
│   └── images/               ← 其他图片
└── project.config.json       ← 项目配置
```

## 性能指标目标

| 指标 | 目标值 | 当前值 |
|------|--------|--------|
| 模型加载 | < 3s | - |
| 抠图处理 | < 5s | - |
| 渲染帧率 | ≥ 30fps | - |
| 内存占用 | < 200MB | - |
| 包体积 | < 2MB | - |

## 上线前检查

- [ ] AppID 已配置
- [ ] 相框素材已添加
- [ ] AI 接口已接入
- [ ] 真机测试通过
- [ ] 性能指标达标
- [ ] 错误处理完善
- [ ] 用户提示友好
- [ ] 隐私政策准备
