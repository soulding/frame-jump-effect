// utils/gesture-handler.js
/**
 * 手势处理器
 * 负责处理触摸事件，实现拖动、缩放、旋转功能
 */

/**
 * 手势配置
 */
const GestureConfig = {
  // 单指拖动 - 移动主体位置
  drag: {
    enabled: true,
    bounds: {
      minX: -100,
      maxX: 100,
      minY: -50,
      maxY: 150
    }
  },
  
  // 双指缩放 - 调整主体大小
  pinch: {
    enabled: true,
    minScale: 0.5,
    maxScale: 1.5
  },
  
  // 双指旋转 - 调整主体角度
  rotate: {
    enabled: true,
    minAngle: -30,
    maxAngle: 30
  }
};

/**
 * 手势处理器类
 */
export class GestureHandler {
  /**
   * 构造函数
   * @param {HTMLCanvasElement} canvas - Canvas 元素
   * @param {function} onTransformChange - 变换回调函数
   */
  constructor(canvas, onTransformChange) {
    this.canvas = canvas;
    this.onTransformChange = onTransformChange;
    
    // 状态
    this.touches = new Map();
    this.initialTransform = null;
    this.currentTransform = {
      x: 0,
      y: 0,
      scale: 1.0,
      rotate: 0
    };
    
    // 初始距离和角度（用于双指手势）
    this.initialDistance = 0;
    this.initialAngle = 0;
  }

  /**
   * 处理触摸开始ER
   * @param {object} e - 触摸事件
   */
  handleTouchStart(e) {
    const touches = e.touches;
    
    // 记录所有触摸点
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      this.touches.set(touch.identifier, {
        x: touch.x,
        y: touch.y
      });
    }
    
    // 双指手势 - 记录初始状态
    if (touches.length === 2) {
      this.initialDistance = this.getDistance(touches[0], touches[1]);
      this.initialAngle = this.getAngle(touches[0], touches[1]);
      this.initialTransform = { ...this.currentTransform };
    }
    // 单指手势 - 记录初始位置
    else if (touches.length === 1) {
      this.initialTransform = { ...this.currentTransform };
    }
  }

  /**
   * 处理触摸移动
   * @param {object} e - 触摸事件
   */
  handleTouchMove(e) {
    e.preventDefault();
    
    const touches = e.touches;
    
    if (touches.length === 1 && GestureConfig.drag.enabled) {
      // 单指拖动
      this.handleDrag(touches[0]);
    } else if (touches.length === 2) {
      // 双指缩放和旋转
      this.handlePinchAndRotate(touches);
    }
  }

  /**
   * 处理触摸结束
   * @param {object} e - 触摸事件
   */
  handleTouchEnd(e) {
    const touches = e.touches;
    
    // 清除已结束的触摸点
    for (const [identifier, data] of this.touches) {
      let found = false;
      for (let i = 0; i < touches.length; i++) {
        if (touches[i].identifier === identifier) {
          found = true;
          break;
        }
      }
      if (!found) {
        this.touches.delete(identifier);
      }
    }
    
    // 如果所有触摸都结束，重置初始状态
    if (touches.length === 0) {
      this.initialTransform = null;
    }
  }

  /**
   * 处理拖动
   * @param {object} touch - 触摸点
   */
  handleDrag(touch) {
    if (!this.initialTransform) return;
    
    const initialTouch = this.touches.get(touch.identifier);
    if (!initialTouch) return;
    
    // 计算位移
    const deltaX = touch.x - initialTouch.x;
    const deltaY = touch.y - initialTouch.y;
    
    // 应用边界限制
    let newX = this.initialTransform.x + deltaX;
    let newY = this.initialTransform.y + deltaY;
    
    newX = Math.max(GestureConfig.drag.bounds.minX, Math.min(GestureConfig.drag.bounds.maxX, newX));
    newY = Math.max(GestureConfig.drag.bounds.minY, Math.min(GestureConfig.drag.bounds.maxY, newY));
    
    // 更新变换
    this.currentTransform = {
      ...this.initialTransform,
      x: newX,
      y: newY
    };
    
    // 触发回调
    if (this.onTransformChange) {
      this.onTransformChange(this.currentTransform);
    }
  }

  /**
   * 处理缩放和旋转
   * @param {Array} touches - 两个触摸点
   */
  handlePinchAndRotate(touches) {
    if (!this.initialTransform) return;
    
    const currentDistance = this.getDistance(touches[0], touches[1]);
    const currentAngle = this.getAngle(touches[0], touches[1]);
    
    // 计算缩放比例
    const scaleRatio = currentDistance / this.initialDistance;
    let newScale = this.initialTransform.scale * scaleRatio;
    newScale = Math.max(GestureConfig.pinch.minScale, Math.min(GestureConfig.pinch.maxScale, newScale));
    
    // 计算旋转角度
    const angleDelta = currentAngle - this.initialAngle;
    let newRotate = this.initialTransform.rotate + angleDelta;
    newRotate = Math.max(GestureConfig.rotate.minAngle, Math.min(GestureConfig.rotate.maxAngle, newRotate));
    
    // 更新变换
    this.currentTransform = {
      ...this.initialTransform,
      scale: newScale,
      rotate: newRotate
    };
    
    // 触发回调
    if (this.onTransformChange) {
      this.onTransformChange(this.currentTransform);
    }
  }

  /**
   * 计算两点间距离
   * @param {object} t1 - 触摸点 1
   * @param {object} t2 - 触摸点 2
   * @returns {number} 距离
   */
  getDistance(t1, t2) {
    const dx = t2.x - t1.x;
    const dy = t2.y - t1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * 计算两点间角度
   * @param {object} t1 - 触摸点 1
   * @param {object} t2 - 触摸点 2
   * @returns {number} 角度（度）
   */
  getAngle(t1, t2) {
    const dx = t2.x - t1.x;
    const dy = t2.y - t1.y;
    return Math.atan2(dy, dx) * 180 / Math.PI;
  }

  /**
   * 获取当前变换
   * @returns {object} 当前变换
   */
  getTransform() {
    return { ...this.currentTransform };
  }

  /**
   * 设置变换
   * @param {object} transform - 变换参数
   */
  setTransform(transform) {
    this.currentTransform = { ...transform };
  }

  /**
   * 清理资源
   */
  dispose() {
    this.touches.clear();
    this.initialTransform = null;
  }
}
