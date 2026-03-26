// utils/frame-composer.js
/**
 * 相框合成器
 * 负责图层合成、相框配置管理
 */

/**
 * 相框配置接口
 */
const FrameConfigs = {
  classic: {
    id: 'classic',
    name: '经典相框',
    background: {
      url: '/miniprogram/frames/classic_bg.png',
      width: 375,
      height: 500
    },
    foreground: {
      url: '/miniprogram/frames/classic_fg.png',
      width: 375,
      height: 500,
      occlusionZones: [
        { x: 50, y: 50, width: 275, height: 100 },
        { x: 50, y: 400, width: 275, height: 100 }
      ]
    },
    subjectPosition: {
      x: 0,
      y: 0,
      scale: 1.0
    },
    allowedGestures: ['drag', 'pinch', 'rotate']
  },
  
  modern: {
    id: 'modern',
    name: '现代相框',
    background: {
      url: '/miniprogram/frames/modern_bg.png',
      width: 375,
      height: 500
    },
    foreground: {
      url: '/miniprogram/frames/modern_fg.png',
      width: 375,
      height: 500,
      occlusionZones: [
        { x: 30, y: 30, width: 315, height: 80 },
        { x: 30, y: 420, width: 315, height: 80 }
      ]
    },
    subjectPosition: {
      x: 0,
      y: 0,
      scale: 1.0
    },
    allowedGestures: ['drag', 'pinch', 'rotate']
  },
  
  vintage: {
    id: 'vintage',
    name: '复古相框',
    background: {
      url: '/miniprogram/frames/vintage_bg.png',
      width: 375,
      height: 500
    },
    foreground: {
      url: '/miniprogram/frames/vintage_fg.png',
      width: 375,
      height: 500,
      occlusionZones: [
        { x: 40, y: 40, width: 295, height: 120 },
        { x: 40, y: 380, width: 295, height: 120 }
      ]
    },
    subjectPosition: {
      x: 0,
      y: 0,
      scale: 1.0
    },
    allowedGestures: ['drag', 'pinch', 'rotate']
  }
};

/**
 * 相框合成器类
 */
export class FrameComposer {
  /**
   * 构造函数
   * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
   * @param {number} width - 画布宽度
   * @param {number} height - 画布高度
   */
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  /**
   * 获取相框配置
   * @param {string} frameId - 相框 ID
   * @returns {object} 相框配置
   */
  static getFrameConfig(frameId) {
    return FrameConfigs[frameId] || FrameConfigs.classic;
  }

  /**
   * 获取所有可用相框
   * @returns {Array} 相框列表
   */
  static getAllFrames() {
    return Object.values(FrameConfigs);
  }

  /**
   * 执行图层合成
   * @param {string} subjectPath - 透明主体图片路径
   * @param {object} frameConfig - 相框配置
   * @param {object} transform - 主体变换参数
   */
  async compose(subjectPath, frameConfig, transform = {}) {
    const { x = 0, y = 0, scale = 1.0, rotate = 0 } = transform;
    
    try {
      // 清空画布
      this.ctx.clearRect(0, 0, this.width, this.height);
      
      // 第 1 层：绘制相框背景
      await this.drawImage(frameConfig.background.url, 0, 0, this.width, this.height);
      
      // 第 2 层：绘制主体（带变换）
      this.ctx.save();
      
      // 应用变换
      const centerX = this.width / 2;
      const centerY = this.height / 2;
      this.ctx.translate(centerX + x, centerY + y);
      this.ctx.scale(scale, scale);
      this.ctx.rotate(rotate * Math.PI / 180);
      
      // 计算主体尺寸
      const subjectWidth = this.width * 0.8;
      const subjectHeight = subjectWidth * (4 / 3);
      
      await this.drawImage(
        subjectPath,
        -subjectWidth / 2,
        -subjectHeight / 2,
        subjectWidth,
        subjectHeight
      );
      
      this.ctx.restore();
      
      // 第 3 层：绘制相框前景（制造遮挡效果）
      await this.drawImage(frameConfig.foreground.url, 0, 0, this.width, this.height);
      
    } catch (error) {
      console.error('Compose failed:', error);
      throw error;
    }
  }

  /**
   * 绘制图片（Promise 封装）
   * @param {string} path - 图片路径
   * @param {number} x - x 坐标
   * @param {number} y - y 坐标
   * @param {number} width - 宽度
   * @param {number} height - 高度
   */
  drawImage(path, x, y, width, height) {
    return new Promise((resolve, reject) => {
      const img = wx.createImage();
      img.src = path;
      img.onload = () => {
        this.ctx.drawImage(img, x, y, width, height);
        resolve();
      };
      img.onerror = (err) => {
        console.error('Image load failed:', path, err);
        reject(err);
      };
    });
  }

  /**
   * 计算主体显示宽度
   */
  calcSubjectWidth() {
    return this.width * 0.8;
  }

  /**
   * 计算主体显示高度
   */
  calcSubjectHeight() {
    return this.calcSubjectWidth() * (4 / 3);
  }
}
