// utils/segmentation-types.js
/**
 * AI 分割类型定义
 * 支持人体、宠物、植物、通用物体等多种分割模式
 */

/**
 * 分割模式枚举
 */
export const SegmentType = {
  /** 人像分割 - 最成熟准确 */
  PERSON: 'person',
  
  /** 人像分割（含人脸细节） */
  FACE: 'face',
  
  /** 人体关键点 + 分割 */
  BODY_PARTS: 'body_parts',
  
  /** 宠物分割（猫狗等） */
  PET: 'pet',
  
  /** 动物分割（通用） */
  ANIMAL: 'animal',
  
  /** 植物分割 */
  PLANT: 'plant',
  
  /** 通用物体分割 */
  OBJECT: 'object',
  
  /** 车辆分割 */
  VEHICLE: 'vehicle',
  
  /** 食物分割 */
  FOOD: 'food',
  
  /** 自定义/手动分割 */
  MANUAL: 'manual'
};

/**
 * 分割模式配置
 */
export const SegmentConfig = {
  [SegmentType.PERSON]: {
    name: '人像抠图',
    icon: '👤',
    description: '适合人物照片，支持多人',
    accuracy: '高',
    speed: '快',
    apiType: 'person',
    models: ['body_pix', 'selfie', 'deeplab']
  },
  
  [SegmentType.FACE]: {
    name: '人脸抠图',
    icon: '😊',
    description: '精确人脸分割，含发丝细节',
    accuracy: '极高',
    speed: '中',
    apiType: 'face',
    models: ['face_segmentation']
  },
  
  [SegmentType.PET]: {
    name: '宠物抠图',
    icon: '🐶',
    description: '猫、狗等宠物',
    accuracy: '高',
    speed: '快',
    apiType: 'pet',
    models: ['body_pix', 'pet_segmentation']
  },
  
  [SegmentType.ANIMAL]: {
    name: '动物抠图',
    icon: '🦁',
    description: '各种动物',
    accuracy: '中',
    speed: '中',
    apiType: 'animal',
    models: ['body_pix', 'deeplab']
  },
  
  [SegmentType.PLANT]: {
    name: '植物抠图',
    icon: '🌿',
    description: '花卉、树木等植物',
    accuracy: '中',
    speed: '慢',
    apiType: 'plant',
    models: ['deeplab', 'plant_segmentation']
  },
  
  [SegmentType.OBJECT]: {
    name: '通用物体',
    icon: '📦',
    description: '日常物品、商品等',
    accuracy: '中',
    speed: '中',
    apiType: 'object',
    models: ['body_pix', 'deeplab', 'modnet']
  },
  
  [SegmentType.VEHICLE]: {
    name: '车辆抠图',
    icon: '🚗',
    description: '汽车、摩托车等',
    accuracy: '高',
    speed: '快',
    apiType: 'vehicle',
    models: ['vehicle_segmentation']
  },
  
  [SegmentType.FOOD]: {
    name: '食物抠图',
    icon: '🍔',
    description: '美食、食材等',
    accuracy: '中',
    speed: '快',
    apiType: 'food',
    models: ['food_segmentation']
  },
  
  [SegmentType.MANUAL]: {
    name: '手动抠图',
    icon: '✏️',
    description: '手动描边，精确控制',
    accuracy: '取决于用户',
    speed: '慢',
    apiType: 'manual',
    models: []
  }
};

/**
 * 获取分割模式配置
 */
export function getSegmentConfig(type) {
  return SegmentConfig[type] || SegmentConfig[SegmentType.PERSON];
}

/**
 * 获取所有可用的分割模式
 */
export function getAllSegmentTypes() {
  return Object.keys(SegmentConfig).map(key => ({
    key,
    ...SegmentConfig[key]
  }));
}

/**
 * 根据场景推荐分割模式
 */
export function recommendSegmentType(scene) {
  const recommendations = {
    'portrait': SegmentType.PERSON,
    'selfie': SegmentType.FACE,
    'group_photo': SegmentType.PERSON,
    'pet_cat': SegmentType.PET,
    'pet_dog': SegmentType.PET,
    'flower': SegmentType.PLANT,
    'tree': SegmentType.PLANT,
    'product': SegmentType.OBJECT,
    'car': SegmentType.VEHICLE,
    'food_dish': SegmentType.FOOD
  };
  
  return recommendations[scene] || SegmentType.PERSON;
}

/**
 * 分割模式能力对比表
 */
export const CapabilityMatrix = {
  // 精度评分 (1-5)
  accuracy: {
    [SegmentType.PERSON]: 5,
    [SegmentType.FACE]: 5,
    [SegmentType.PET]: 4,
    [SegmentType.ANIMAL]: 3,
    [SegmentType.PLANT]: 3,
    [SegmentType.OBJECT]: 3,
    [SegmentType.VEHICLE]: 4,
    [SegmentType.FOOD]: 4,
    [SegmentType.MANUAL]: 5
  },
  
  // 速度评分 (1-5, 5 最快)
  speed: {
    [SegmentType.PERSON]: 5,
    [SegmentType.FACE]: 4,
    [SegmentType.PET]: 5,
    [SegmentType.ANIMAL]: 3,
    [SegmentType.PLANT]: 2,
    [SegmentType.OBJECT]: 3,
    [SegmentType.VEHICLE]: 5,
    [SegmentType.FOOD]: 4,
    [SegmentType.MANUAL]: 1
  },
  
  // 边缘质量评分 (1-5)
  edgeQuality: {
    [SegmentType.PERSON]: 5,
    [SegmentType.FACE]: 5,
    [SegmentType.PET]: 4,
    [SegmentType.ANIMAL]: 3,
    [SegmentType.PLANT]: 2,
    [SegmentType.OBJECT]: 3,
    [SegmentType.VEHICLE]: 4,
    [SegmentType.FOOD]: 4,
    [SegmentType.MANUAL]: 5
  }
};
