// 云函数入口文件
const cloud = require('wx-server-sdk');
const axios = require('axios');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

// 微信 AI 开放平台配置
// 在微信 AI 开放平台 https://ai.weixin.qq.com/ 创建应用后获取
const AI_CONFIG = {
  appid: process.env.AI_APPID || 'YOUR_APPID',
  secret: process.env.AI_SECRET || 'YOUR_SECRET',
  segmentUrl: 'https://api.weixin.qq.com/cv/img/segment'
};

/**
 * 获取访问令牌
 */
async function getAccessToken() {
  try {
    const params = {
      grant_type: 'client_credential',
      appid: AI_CONFIG.appid,
      secret: AI_CONFIG.secret
    };

    const response = await axios.get(
      'https://api.weixin.qq.com/cgi-bin/token',
      { params }
    );

    if (response.data.access_token) {
      return response.data.access_token;
    } else {
      console.error('获取 access_token 失败:', response.data);
      throw new Error(response.data.errmsg || '获取 access_token 失败');
    }
  } catch (error) {
    console.error('Get token error:', error);
    throw error;
  }
}

/**
 * 图像分割主函数（支持多种类型）
 */
async function segmentImage(imageBase64, type = 'person') {
  try {
    // 获取 access_token
    const accessToken = await getAccessToken();
    console.log('获取到 access_token，类型:', type);

    // 映射分割类型到 API 参数
    const apiTypeMap = {
      'person': 'person',      // 人像
      'face': 'face',          // 人脸
      'pet': 'pet',            // 宠物
      'animal': 'animal',      // 动物
      'plant': 'plant',        // 植物
      'object': 'object',      // 通用物体
      'vehicle': 'vehicle',    // 车辆
      'food': 'food'           // 食物
    };

    const apiType = apiTypeMap[type] || 'object';

    // 调用微信 AI 分割 API
    const params = {
      access_token: accessToken
    };

    const response = await axios.post(
      AI_CONFIG.segmentUrl,
      {
        img: imageBase64,
        type: apiType
      },
      { params }
    );

    const result = response.data;
    console.log('AI 分割结果:', result);

    if (result.errcode === 0) {
      // 上传结果到云存储
      const fileExtension = 'png';
      const cloudPath = `segmented/${type}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExtension}`;
      
      const uploadResult = await cloud.uploadFile({
        cloudPath: cloudPath,
        fileContent: Buffer.from(result.img_base64 || result.mask_base64, 'base64')
      });

      console.log('上传到云存储成功:', uploadResult.fileID);

      return {
        success: true,
        imageUrl: uploadResult.fileID,
        width: result.width || 0,
        height: result.height || 0,
        type: type,
        confidence: result.confidence || 1.0
      };
    } else {
      console.error('AI 分割失败:', result);
      return {
        success: false,
        errMsg: result.errmsg || 'AI 分割失败',
        errCode: result.errcode
      };
    }
  } catch (error) {
    console.error('Segmentation error:', error);
    return {
      success: false,
      errMsg: error.message || '分割失败',
      stack: error.stack
    };
  }
}

/**
 * 云函数入口
 */
exports.main = async (event, context) => {
  const { imageBase64, type = 'person' } = event;

  if (!imageBase64) {
    return {
      success: false,
      errMsg: '缺少 imageBase64 参数'
    };
  }

  console.log('收到分割请求，类型:', type);

  try {
    const result = await segmentImage(imageBase64, type);
    return result;
  } catch (error) {
    console.error('云函数执行失败:', error);
    return {
      success: false,
      errMsg: error.message,
      stack: error.stack
    };
  }
};
