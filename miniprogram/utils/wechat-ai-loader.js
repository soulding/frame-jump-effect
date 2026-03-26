// utils/wechat-ai-loader.js
/**
 * 微信 AI 开放平台接入模块
 * 提供人体分割、图像抠图能力
 * 
 * 接入步骤：
 * 1. 访问 https://ai.weixin.qq.com/ 注册并创建应用
 * 2. 在小程序后台开通 AI 能力
 * 3. 获取 AI 插件的 pluginId
 * 4. 在 app.json 中配置插件
 */

/**
 * 微信 AI 配置
 */
const WeChatAIConfig = {
  // AI 插件 ID（需要在小程序后台配置）
  pluginId: 'your-ai-plugin-id',
  
  // 分割模式
  segmentType: 'person', // 'person' | 'face' | 'body'
  
  // 输出配置
  output: {
    format: 'png',      // 输出格式
    quality: 1.0,       // 图片质量
    withAlpha: true     // 包含透明通道
  }
};

/**
 * 微信 AI 加载器类
 */
export class WeChatAILoader {
  static instance = null;
  static isLoading = false;

  /**
   * 获取 AI 实例（单例模式）
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
      // 方案一：使用微信 AI 插件（推荐）
      this.instance = await this.loadAIPlugin();
      
      console.log('WeChat AI loaded successfully');
      return this.instance;
    } catch (error) {
      console.error('WeChat AI loading failed:', error);
      
      // 降级方案：使用云函数
      console.warn('Falling back to cloud function...');
      this.instance = await this.loadCloudFunction();
      
      return this.instance;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * 加载 AI 插件
   */
  static async loadAIPlugin() {
    return new Promise((resolve, reject) => {
      try {
        // 检查插件是否已配置
        const plugin = requirePlugin('aiPlugin');
        
        if (!plugin) {
          reject(new Error('AI 插件未配置，请在 app.json 中添加插件配置'));
          return;
        }

        resolve({
          type: 'wechat-ai-plugin',
          plugin: plugin,
          
          /**
           * 执行人体分割
           * @param {string} imagePath - 图片路径
           * @returns {Promise<{maskPath: string, imageUrl: string}>}
           */
          segmentPerson: async (imagePath) => {
            return new Promise((resolve, reject) => {
              plugin.segmentPerson({
                imagePath: imagePath,
                outputType: 'mask', // 输出掩码或透明图
                success: (res) => {
                  resolve({
                    maskPath: res.maskPath,
                    imageUrl: res.imageUrl,
                    width: res.width,
                    height: res.height
                  });
                },
                fail: (err) => {
                  console.error('AI segmentation failed:', err);
                  reject(err);
                }
              });
            });
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 加载云函数方案（降级）
   */
  static async loadCloudFunction() {
    // 检查云开发是否初始化
    if (!wx.cloud) {
      throw new Error('云开发未初始化，请在 app.js 中调用 wx.cloud.init()');
    }

    return {
      type: 'cloud-function',
      
      /**
       * 执行分割（通过云函数）
       * @param {string} imagePath - 图片路径
       * @returns {Promise<{maskPath: string, imageUrl: string}>}
       */
      segmentPerson: async (imagePath) => {
        // 读取图片文件
        const fileInfo = await this.readFileAsBase64(imagePath);
        
        // 调用云函数
        const result = await wx.cloud.callFunction({
          name: 'segment-person',
          data: {
            imageBase64: fileInfo.base64,
            type: 'person'
          }
        });

        if (result.result && result.result.success) {
          return {
            maskPath: result.result.maskPath,
            imageUrl: result.result.imageUrl,
            width: result.result.width,
            height: result.result.height
          };
        } else {
          throw new Error(result.result?.errMsg || '云函数调用失败');
        }
      }
    };
  }

  /**
   * 读取文件为 Base64
   */
  static async readFileAsBase64(filePath) {
    return new Promise((resolve, reject) => {
      wx.getFileSystemManager().readFile({
        filePath: filePath,
        encoding: 'base64',
        success: (res) => {
          resolve({
            base64: res.data,
            filePath: filePath
          });
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  }

  /**
   * 清理资源
   */
  static dispose() {
    this.instance = null;
  }
}

/**
 * 执行人体分割（便捷函数）
 */
export async function segmentPerson(model, imagePath) {
  if (!model) {
    throw new Error('AI 模型未初始化');
  }

  try {
    const result = await model.segmentPerson(imagePath);
    return result;
  } catch (error) {
    console.error('Segmentation failed:', error);
    throw error;
  }
}
