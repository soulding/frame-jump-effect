// utils/bodypix-loader.js
/**
 * BodyPix 模型加载器
 * 负责加载和管理 TensorFlow.js + BodyPix 模型
 */

// BodyPix 模型配置
const bodyPixConfig = {
  architecture: 'MobileNetV1',
  outputStride: 16,
  multiplier: 0.75,
  quantBytes: 2
};

// 分割参数配置
export const segmentationConfig = {
  flipHorizontal: false,
  internalResolution: 'medium',
  segmentationThreshold: 0.7,
  scoreThreshold: 0.2,
  maxDetections: 1
};

/**
 * 模型加载器类
 */
export class ModelLoader {
  static instance = null;
  static isLoading = false;

  /**
   * 获取模型实例（单例模式）
   */
  static async getInstance() {
    if (this.instance) {
      return this.instance;
    }

    if (this.isLoading) {
      // 等待加载完成
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (this.instance) {
            clearInterval(checkInterval);
            resolve(this.instance);
          }
        }, 100);
      });
    }

    this.isLoading = true;

    try {
      // 加载 TensorFlow.js 和 BodyPix
      // 注意：微信小程序需要使用兼容版本
      // 这里使用 CDN 加载，实际部署时建议下载到本地
      
      const tf = await this.loadTensorFlow();
      const bodyPix = await this.loadBodyPix();
      
      // 加载模型
      console.log('Loading BodyPix model...');
      this.instance = await bodyPix.load(bodyPixConfig);
      console.log('BodyPix model loaded successfully');
      
      return this.instance;
    } catch (error) {
      console.error('Model loading failed:', error);
      throw new Error('AI 模型加载失败，请检查网络连接');
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * 加载 TensorFlow.js
   */
  static async loadTensorFlow() {
    return new Promise((resolve, reject) => {
      // 检查是否已加载
      if (typeof tf !== 'undefined') {
        resolve(tf);
        return;
      }

      // 动态加载 TensorFlow.js
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.11.0/dist/tf.min.js';
      script.onload = () => resolve(tf);
      script.onerror = () => reject(new Error('TensorFlow.js 加载失败'));
      document.head.appendChild(script);
    });
  }

  /**
   * 加载 BodyPix
   */
  static async loadBodyPix() {
    return new Promise((resolve, reject) => {
      // 检查是否已加载
      if (typeof bodyPix !== 'undefined') {
        resolve(bodyPix);
        return;
      }

      // 动态加载 BodyPix
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/body-pix@2.2.0/dist/body-pix.min.js';
      script.onload = () => resolve(bodyPix);
      script.onerror = () => reject(new Error('BodyPix 加载失败'));
      document.head.appendChild(script);
    });
  }

  /**
   * 清理模型内存
   */
  static dispose() {
    if (this.instance) {
      // BodyPix 模型清理
      if (this.instance.dispose) {
        this.instance.dispose();
      }
      this.instance = null;
    }
  }
}

/**
 * 执行图像分割
 */
export async function segmentPerson(model, imageElement) {
  try {
    const segmentation = await model.segmentPerson(imageElement, segmentationConfig);
    return segmentation;
  } catch (error) {
    console.error('Segmentation failed:', error);
    throw error;
  }
}
