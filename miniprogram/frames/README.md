# 相框素材占位文件

## 说明

此目录用于存放相框图层素材。由于无法直接生成图片文件，请按照以下指南准备素材：

## 所需素材清单

### 经典相框 (Classic)
- [ ] `classic_bg.png` - 经典相框背景层
- [ ] `classic_fg.png` - 经典相框前景层（透明）

### 现代相框 (Modern)
- [ ] `modern_bg.png` - 现代相框背景层
- [ ] `modern_fg.png` - 现代相框前景层（透明）

### 复古相框 (Vintage)
- [ ] `vintage_bg.png` - 复古相框背景层
- [ ] `vintage_fg.png` - 复古相框前景层（透明）

## 临时测试方案

在正式素材准备好之前，可以使用以下方法测试：

### 方案 1: 使用纯色块
创建简单的彩色 PNG 用于测试：
- 背景层：带边框的矩形
- 前景层：上下两条装饰带

### 方案 2: 使用在线生成器
使用在线工具快速生成测试素材：
- [Photopea](https://www.photopea.com/)
- [Canva](https://www.canva.com/)

### 方案 3: 使用示例图片
从免费素材网站下载：
- [Unsplash](https://unsplash.com/)
- [Pexels](https://www.pexels.com/)
- [Pixabay](https://pixabay.com/)

## 素材规格

| 属性 | 要求 |
|------|------|
| 尺寸 | 750x1000px (2x) |
| 格式 | PNG (支持透明) |
| 色彩 | sRGB |
| 文件大小 | < 200KB/张 |

## 放置位置

将准备好的素材文件放入此目录：
```
miniprogram/frames/
├── classic_bg.png
├── classic_fg.png
├── modern_bg.png
├── modern_fg.png
├── vintage_bg.png
└── vintage_fg.png
```

## 验证方法

素材添加后，在微信开发者工具中：
1. 编译项目
2. 选择"更换相框"
3. 检查相框是否正常显示
4. 测试遮挡效果
