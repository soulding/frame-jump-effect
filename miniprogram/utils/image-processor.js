// utils/image-processor.js
/**
 * 图像处理器
 * 负责图片压缩、信息获取、AI 分割和透明图像生成
 */

import { segmentPerson, segmentationConfig } from './bodypix-loader';

/**
 * 图像处理器类
 */
export class ImageProcessor {
  /**
   * 压缩图片
   * @param {string} imagePath - 图片路径
   * @param {number} maxSize - 最大边长
   * @returns {Promise<string>} - 压缩后的图片路径
   */
  static async compressImage(imagePath, maxSize = 1024) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: imagePath,
        success: (info) => {
          let quality = 0.8;
          let targetWidth = info.width;
          let targetHeight = info.height;

          // 按最大边长压缩
          if (Math.max(info.width, info.height) > maxSize) {
            const ratio = maxSize / Math.max(info.width, info.height);
            targetWidth = Math.floor(info.width * ratio);
            targetHeight = Math.floor(info.height * ratio);
          }

          wx.compressImage({
            src: imagePath,
            quality: quality,
            compressedWidth: targetWidth,
            compressedHeight: targetHeight,
            success: (res) => resolve(res.tempFilePath),
            fail: (err) => {
              console.warn('Compress failed, using original:', err);
              resolve(imagePath);
            }
          });
        },
        fail: reject
      });
    });
  }

  /**
   * 获取图片信息
   * @param {string} imagePath - 图片路径
   * @returns {Promise<{width: number, height: number}>}
   */
  static async getImageInfo(imagePath) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: imagePath,
        success: (info) => {
          resolve({
            width: info.width,
            height: info.height,
            path: info.path
          });
        },
        fail: reject
      });
    });
  }

  /**
   * 执行图像分割并生成透明背景 PNG
   * @param {object} model - BodyPix 模型实例
   * @param {string} imagePath - 图片路径
   * @param {number} width - 图片宽度
   * @param {number} height - 图片高度
   * @returns {Promise<string>} - 透明背景图片路径
   */
  static async segmentImage(model, imagePath, width, height) {
    return new Promise((resolve, reject) => {
      // 创建离屏 Canvas 用于处理
      const canvasId = 'segmentCanvas';
      
      // 加载图片到 Canvas
      const ctx = wx.createCanvasContext(canvasId);
      
      ctx.drawImage(imagePath, 0, 0, width, height);
      ctx.draw(false, async () => {
        try {
          // 获取图像数据
          const imageData = await this.getCanvasImageData(canvasId, width, height);
          
          // 创建 Image 对象用于 BodyPix
          const img = await this.createImageFromData(imageData, width, height);
          
          // 执行分割
          const segmentation = await segmentPerson(model, img);
          
          // 生成透明背景图像
          const transparentPath = await this.createTransparentImage(
            imageData,
            segmentation,
            width,
            height
          );
          
          resolve(transparentPath);
        } catch (error) {
          console.error('Segmentation process failed:', error);
          reject(error);
        }
      });
    });
  }

  /**
   * 获取 Canvas 图像数据
   */
  static async getCanvasImageData(canvasId, width, height) {
    return new Promise((resolve, reject) => {
      wx.canvasGetImageData({
        canvasId: canvasId,
        x: 0,
        y: 0,
        width: width,
        height: height,
        success: (res) => resolve(res.data),
        fail: reject
      });
    });
  }

  /**
   * 从图像数据创建 Image 对象
   */
  static async createImageFromData(imageData, width, height) {
    return new Promise((resolve, reject) => {
      // 创建临时 Canvas
      const canvasId = 'tempImageCanvas';
      const ctx = wx.createCanvasContext(canvasId);
      
      // 将 imageData 绘制到 Canvas
      // 注意：微信小程序需要特殊处理
      wx.createImageData()
      
      // 简化方案：直接使用图片路径
      // BodyPix 在小程序环境需要适配
      const img = {
        width: width,
        height: height,
        data: imageData
      };
      
      resolve(img);
    });
  }

  /**
   * 创建透明背景图像
   * @param {Uint8ClampedArray} imageData - 原始图像数据
   * @param {object} segmentation - 分割结果
   * @param {number} width - 宽度
   * @param {number} height - 高度
   * @returns {Promise<string>} - 透明图片路径
   */
  static async createTransparentImage(imageData, segmentation, width, height) {
    const canvasId = 'transparentCanvas';
    const ctx = wx.createCanvasContext(canvasId);

    // 创建新的 imageData，将背景设为透明
    const newImageData = new Uint8ClampedArray(imageData.length);
    
    for (let i = 0; i < imageData.length; i += 4) {
      const pixelIndex = i / 4;
      const row = Math.floor(pixelIndex / width);
      const col = pixelIndex % width;
      
      // 检查该像素是否属于前景
      const isForeground = segmentation.data[pixelIndex] === 1;
      
      if (isForeground) {
        newImageData[i] = imageData[i];     // R
        newImageData[i + 1] = imageData[i + 1]; // G
        newImageData[i + 2] = imageData[i + 2]; // B
        newImageData[i + 3] = imageData[i + 3]; // A (保持原 alpha)
      } else {
        newImageData[i] = 0;     // R
        newImageData[i + 1] = 0; // G
        newImageData[i + 2] = 0; // B
        newImageData[i + 3] = 0; // Alpha = 0 (透明)
      }
    }

    // 将处理后的图像数据写入 Canvas
    return new Promise((resolve, reject) => {
      wx.canvasPutImageData({
        canvasId: canvasId,
        x: 0,
        y: 0,
        width: width,
        height: height,
        data: newImageData,
        success: () => {
          wx.canvasToTempFilePath({
            canvasId: canvasId,
            fileType: 'png',
            quality: 1.0,
            success: (res) => resolve(res.tempFilePath),
            fail: reject
          });
        },
        fail: reject
      });
    });
  }

  /**
   * 清理 TensorFlow 内存
   */
  static cleanupTensorMemory(tensors) {
    if (tensors && Array.isArray(tensors)) {
      tensors.forEach(tensor => {
        if (tensor && tensor.dispose) {
          tensor.dispose();
        }
      });
    }
  }
}
