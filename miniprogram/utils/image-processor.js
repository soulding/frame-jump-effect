// utils/image-processor.js
/**
 * 图像处理器
 * 负责图片压缩、信息获取、AI 分割和透明图像生成
 */

import { segmentPerson } from './wechat-ai-loader';

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
   * @param {object} model - AI 模型实例（微信 AI 或云函数）
   * @param {string} imagePath - 图片路径
   * @param {number} width - 图片宽度
   * @param {number} height - 图片高度
   * @param {string} type - 分割类型 (person/pet/plant/object 等)
   * @returns {Promise<string>} - 透明背景图片路径
   */
  static async segmentImage(model, imagePath, width, height, type = 'person') {
    try {
      console.log(`Starting ${type} segmentation with model type:`, model.type);
      
      // 调用 AI 分割（传入类型参数）
      const result = await segmentImage(model, imagePath, type);
      console.log('Segmentation result:', result);
      
      // 微信 AI 或云函数已直接返回透明图
      if (result.imageUrl) {
        console.log('Using AI-generated transparent image');
        return result.imageUrl;
      }
      
      // 如果有掩码，手动生成透明图
      if (result.maskPath) {
        console.log('Creating transparent image from mask');
        const transparentPath = await this.createTransparentImageFromMask(
          imagePath,
          result.maskPath,
          width,
          height
        );
        return transparentPath;
      }
      
      throw new Error('AI 分割未返回有效结果');
    } catch (error) {
      console.error('Segmentation failed:', error);
      throw error;
    }
  }

  /**
   * 从掩码创建透明图像
   * @param {string} imagePath - 原图路径
   * @param {string} maskPath - 掩码路径
   * @param {number} width - 宽度
   * @param {number} height - 高度
   * @returns {Promise<string>} - 透明图片路径
   */
  static async createTransparentImageFromMask(imagePath, maskPath, width, height) {
    const canvasId = 'transparentCanvas';
    const ctx = wx.createCanvasContext(canvasId);

    return new Promise((resolve, reject) => {
      // 绘制原图
      ctx.drawImage(imagePath, 0, 0, width, height);
      
      ctx.draw(false, () => {
        // 获取原图数据
        wx.canvasGetImageData({
          canvasId: canvasId,
          x: 0,
          y: 0,
          width: width,
          height: height,
          success: async (res) => {
            try {
              // 读取掩码数据
              const maskData = await this.getMaskData(maskPath, width, height);
              
              // 创建透明图像数据
              const newImageData = this.applyMaskToImageData(res.data, maskData);
              
              // 写回 Canvas
              wx.canvasPutImageData({
                canvasId: canvasId,
                x: 0,
                y: 0,
                width: width,
                height: height,
                data: newImageData,
                success: () => {
                  // 转换为图片
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
            } catch (error) {
              reject(error);
            }
          },
          fail: reject
        });
      });
    });
  }

  /**
   * 获取掩码数据
   */
  static async getMaskData(maskPath, width, height) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: maskPath,
        success: (info) => {
          const canvasId = 'maskCanvas';
          const ctx = wx.createCanvasContext(canvasId);
          
          ctx.drawImage(maskPath, 0, 0, width, height);
          ctx.draw(false, () => {
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
        },
        fail: reject
      });
    });
  }

  /**
   * 将掩码应用到图像数据
   */
  static applyMaskToImageData(imageData, maskData) {
    const newImageData = new Uint8ClampedArray(imageData.length);
    
    for (let i = 0; i < imageData.length; i += 4) {
      const maskAlpha = maskData[i + 3]; // 掩码的 alpha 通道
      
      if (maskAlpha > 128) {
        // 前景区域：保留原图
        newImageData[i] = imageData[i];
        newImageData[i + 1] = imageData[i + 1];
        newImageData[i + 2] = imageData[i + 2];
        newImageData[i + 3] = 255; // 完全不透明
      } else {
        // 背景区域：透明
        newImageData[i] = 0;
        newImageData[i + 1] = 0;
        newImageData[i + 2] = 0;
        newImageData[i + 3] = 0; // 完全透明
      }
    }
    
    return newImageData;
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
