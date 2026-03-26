# 🚀 快速开始 - 微信 AI 接入

## ✅ 已完成的代码

你的代码已经更新，现在支持微信 AI 开放平台的人体分割功能！

### 更新内容

1. **新增文件**:
   - `utils/wechat-ai-loader.js` - AI 加载器
   - `cloudfunctions/segment-person/` - 云函数（降级方案）
   - `WECHAT_AI_INTEGRATION.md` - 完整接入指南

2. **修改文件**:
   - `app.json` - 添加 AI 插件配置
   - `app.js` - 初始化云开发
   - `pages/frame-composer/index.js` - 使用微信 AI
   - `utils/image-processor.js` - 适配微信 AI

3. **已推送到 GitHub**:
   - 访问：https://github.com/soulding/frame-jump-effect

---

## 📋 三选一接入方案

### 方案 A: AI 插件 ⭐ 最简单

**适合**: 快速上线，无需后端

**步骤**:
1. 登录微信公众平台
2. 添加 AI 插件（搜索"人体分割"）
3. 复制插件 AppID
4. 修改 `app.json` 中的 `provider`
5. 完成！

**修改位置**:
```json
// app.json
{
  "plugins": {
    "aiPlugin": {
      "version": "1.0.0",
      "provider": "wx7c8d593b2c3a7703" // ← 改成你的插件 ID
    }
  }
}
```

---

### 方案 B: 云函数 + HTTP API ⭐ 推荐

**适合**: 需要灵活控制，有后端需求

**步骤**:
1. 注册 https://ai.weixin.qq.com/
2. 创建应用，获取 AppID 和 Secret
3. 部署云函数 `segment-person`
4. 配置密钥
5. 完成！

**配置密钥**:
```javascript
// cloudfunctions/segment-person/index.js
const AI_CONFIG = {
  appid: 'YOUR_APPID',      // ← 改成你的
  secret: 'YOUR_SECRET',    // ← 改成你的
  segmentUrl: 'https://api.weixin.qq.com/cv/img/segment'
};
```

**部署云函数**:
```bash
cd cloudfunctions/segment-person
npm install

# 在微信开发者工具中右键 → 上传并部署：云端安装依赖
```

---

### 方案 C: 云函数 + TensorFlow.js

**适合**: 需要自定义模型

参考 `WECHAT_AI_INTEGRATION.md` 中的详细说明。

---

## 🧪 测试步骤

### 1. 导入项目

```bash
# 如果还没下载
git clone https://github.com/soulding/frame-jump-effect.git
```

### 2. 打开微信开发者工具

- 导入项目：选择 `miniprogram/` 目录
- 填入你的 AppID
- 编译运行

### 3. 测试 AI 抠图

1. 点击"选择照片"
2. 选择一张人物照片
3. 观察加载提示
4. 检查抠图效果

### 4. 查看日志

在开发者工具控制台查看：
```
WeChat AI loaded successfully
Starting segmentation with model type: wechat-ai-plugin
Segmentation completed, subjectPath: ...
```

---

## ⚠️ 常见问题

### Q: 报错 "plugin not found"

**解决**: 
- 在小程序后台添加 AI 插件
- 修改 `app.json` 中的 `provider`
- 重新编译

### Q: 云函数调用失败

**解决**:
- 检查云开发是否初始化
- 确认云函数已部署
- 查看云函数日志

### Q: 抠图效果不好

**解决**:
- 使用清晰的人物照片
- 确保人物完整在画面中
- 调整图片亮度对比度

---

## 📚 详细文档

- **完整指南**: `WECHAT_AI_INTEGRATION.md`
- **云函数说明**: `cloudfunctions/segment-person/README.md`
- **项目文档**: `README.md`

---

## 🎯 下一步

1. **选择接入方案** (推荐方案 A 或 B)
2. **配置密钥或插件 ID**
3. **测试 AI 抠图功能**
4. **准备相框素材**
5. **真机测试**

---

## 💡 提示

- 微信 AI 有免费额度，个人开发足够使用
- 云函数建议设置环境变量存储密钥
- 测试时使用清晰的人物正面照
- 相框素材需要自行设计制作

---

**更新时间**: 2026-03-26 15:21 GMT+8  
**代码位置**: https://github.com/soulding/frame-jump-effect
