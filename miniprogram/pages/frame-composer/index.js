// pages/frame-composer/index.js
import { WeChatAILoader } from '../../utils/wechat-ai-loader';
import { ImageProcessor } from '../../utils/image-processor';
import { FrameComposer } from '../../utils/frame-composer';
import { GestureHandler } from '../../utils/gesture-handler';
import { SegmentType, getAllSegmentTypes, getSegmentConfig } from '../../utils/segmentation-types';

Page({
  data: {
    imagePath: null,
    subjectPath: null,
    loading: false,
    loadingText: '',
    transform: {
      x: 0,
      y: 0,
      scale: 1.0,
      rotate: 0
    },
    currentFrame: 'classic',
    canvasWidth: 375,
    canvasHeight: 500,
    segmentType: 'person', // 当前分割类型
    segmentTypes: [], // 可选的分割类型列表
    showTypePicker: false
  },

  // 实例引用
  model: null,
  composer: null,
  gestureHandler: null,
  canvas: null,
  ctx: null,

  onLoad() {
    this.initCanvas();
    this.preloadModel();
    this.loadSegmentTypes();
  },

  /**
   * 加载分割类型列表
   */
  loadSegmentTypes() {
    const types = getAllSegmentTypes();
    this.setData({ segmentTypes: types });
    console.log('可用分割类型:', types.map(t => t.name).join(', '));
  },

  /**
   * 初始化 Canvas
   */
  async initCanvas() {
    try {
      const query = wx.createSelectorQuery();
      query.select('#mainCanvas')
        .fields({ node: true, size: true })
        .exec(async (res) => {
          if (res[0]) {
            this.canvas = res[0].node;
            this.ctx = this.canvas.getContext('2d');
            
            // 设置画布尺寸
            const dpr = wx.getSystemInfoSync().pixelRatio;
            this.canvas.width = this.data.canvasWidth * dpr;
            this.canvas.height = this.data.canvasHeight * dpr;
            this.ctx.scale(dpr, dpr);
            
            // 初始化合成器
            this.composer = new FrameComposer(this.ctx, this.data.canvasWidth, this.data.canvasHeight);
            
            // 初始化手势处理器
            this.gestureHandler = new GestureHandler(this.canvas, this.onTransformChange.bind(this));
            
            console.log('Canvas initialized');
          }
        });
    } catch (error) {
      console.error('Canvas init failed:', error);
    }
  },

  /**
   * 预加载 AI 模型（后台）
   */
  async preloadModel() {
    try {
      this.model = await WeChatAILoader.getInstance();
      console.log('WeChat AI model preloaded, type:', this.model.type);
    } catch (error) {
      console.error('AI model preload failed:', error);
      wx.showToast({ 
        title: 'AI 初始化失败', 
        icon: 'none',
        duration: 2000
      });
    }
  },

  /**
   * 选择分割类型
   */
  showTypePicker() {
    const types = this.data.segmentTypes;
    const itemList = types.map(t => `${t.icon} ${t.name}`);
    
    wx.showActionSheet({
      itemList: itemList,
      success: (res) => {
        const selectedType = types[res.tapIndex].key;
        const config = getSegmentConfig(selectedType);
        
        this.setData({ 
          segmentType: selectedType,
          'transform.scale': config.defaultScale || 1.0
        });
        
        wx.showToast({ 
          title: `已切换到${config.name}`, 
          icon: 'success' 
        });
        
        // 如果已有图片，重新处理
        if (this.data.imagePath) {
          this.processImage(this.data.imagePath);
        }
      }
    });
  },

  /**
   * 选择照片
   */
  async chooseImage() {
    try {
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: async (res) => {
          const tempFilePath = res.tempFilePaths[0];
          this.setData({ imagePath: tempFilePath });
          
          // 处理图片
          await this.processImage(tempFilePath);
        }
      });
    } catch (error) {
      console.error('Choose image failed:', error);
      wx.showToast({ title: '选择失败', icon: 'none' });
    }
  },

  /**
   * 处理图片 - 压缩 + 抠图
   */
  async processImage(imagePath) {
    this.setLoading(true, '压缩图片中...');
    
    try {
      // 1. 压缩图片
      const compressedPath = await ImageProcessor.compressImage(imagePath, 1024);
      
      // 2. 获取图片信息
      const imageInfo = await ImageProcessor.getImageInfo(compressedPath);
      
      // 3. 加载 AI 模型
      this.setLoading(true, '加载 AI 模型...');
      if (!this.model) {
        this.model = await WeChatAILoader.getInstance();
        console.log('AI model loaded, type:', this.model.type);
      }
      
      // 4. 执行分割（根据选择的类型）
      const segmentType = this.data.segmentType;
      const config = getSegmentConfig(segmentType);
      
      this.setLoading(true, `AI 正在识别${config.name}...`);
      const startTime = Date.now();
      
      const subjectPath = await ImageProcessor.segmentImage(
        this.model,
        compressedPath,
        imageInfo.width,
        imageInfo.height,
        segmentType // 传入分割类型
      );
      
      const duration = Date.now() - startTime;
      console.log(`${config.name}分割完成，耗时：${duration}ms, subjectPath:`, subjectPath);
      
      const duration = Date.now() - startTime;
      console.log(`Segmentation completed in ${duration}ms`);
      
      // 5. 更新数据
      this.setData({
        subjectPath: subjectPath,
        transform: {
          x: 0,
          y: 0,
          scale: 1.0,
          rotate: 0
        }
      });
      
      // 6. 渲染合成
      await this.render();
      
      this.setLoading(false);
      wx.showToast({ title: '抠图完成', icon: 'success' });
      
    } catch (error) {
      console.error('Image processing failed:', error);
      this.setLoading(false);
      wx.showToast({ title: '处理失败', icon: 'none' });
    }
  },

  /**
   * 渲染合成
   */
  async render() {
    if (!this.composer || !this.data.subjectPath) return;
    
    try {
      const frameConfig = FrameComposer.getFrameConfig(this.data.currentFrame);
      await this.composer.compose(
        this.data.subjectPath,
        frameConfig,
        this.data.transform
      );
    } catch (error) {
      console.error('Render failed:', error);
    }
  },

  /**
   * 变换回调
   */
  onTransformChange(transform) {
    // 节流渲染
    if (this.renderTimer) {
      clearTimeout(this.renderTimer);
    }
    
    this.renderTimer = setTimeout(async () => {
      this.setData({ transform });
      await this.render();
    }, 16); // 60fps
  },

  /**
   * 手势事件处理
   */
  handleTouchStart(e) {
    if (this.gestureHandler) {
      this.gestureHandler.handleTouchStart(e);
    }
  },

  handleTouchMove(e) {
    if (this.gestureHandler) {
      this.gestureHandler.handleTouchMove(e);
    }
  },

  handleTouchEnd(e) {
    if (this.gestureHandler) {
      this.gestureHandler.handleTouchEnd(e);
    }
  },

  /**
   * 滑块控制
   */
  onScaleChange(e) {
    const scale = e.detail.value;
    this.setData({ 'transform.scale': scale });
    this.render();
  },

  onRotateChange(e) {
    const rotate = e.detail.value;
    this.setData({ 'transform.rotate': rotate });
    this.render();
  },

  /**
   * 重置变换
   */
  resetTransform() {
    this.setData({
      transform: {
        x: 0,
        y: 0,
        scale: 1.0,
        rotate: 0
      }
    });
    this.render();
    wx.showToast({ title: '已重置', icon: 'success' });
  },

  /**
   * 显示相框选择器
   */
  showFramePicker() {
    wx.showActionSheet({
      itemList: ['经典相框', '现代相框', '复古相框'],
      success: (res) => {
        const frames = ['classic', 'modern', 'vintage'];
        this.setData({ currentFrame: frames[res.tapIndex] });
        this.render();
      }
    });
  },

  /**
   * 保存图片
   */
  async saveImage() {
    if (!this.canvas) return;
    
    this.setLoading(true, '保存图片...');
    
    try {
      const query = wx.createSelectorQuery();
      query.select('#mainCanvas')
        .fields({ node: true })
        .exec(async (res) => {
          if (res[0]) {
            const canvas = res[0].node;
            
            wx.canvasToTempFilePath({
              canvas: canvas,
              fileType: 'png',
              quality: 1.0,
              success: (res) => {
                wx.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success: () => {
                    this.setLoading(false);
                    wx.showToast({ title: '保存成功', icon: 'success' });
                  },
                  fail: (err) => {
                    this.setLoading(false);
                    if (err.errMsg.includes('auth deny')) {
                      wx.showModal({
                        title: '需要授权',
                        content: '请在设置中开启相册保存权限',
                        confirmText: '去设置',
                        success: (res) => {
                          if (res.confirm) {
                            wx.openSetting();
                          }
                        }
                      });
                    } else {
                      wx.showToast({ title: '保存失败', icon: 'none' });
                    }
                  }
                });
              },
              fail: (err) => {
                this.setLoading(false);
                console.error('Canvas to file failed:', err);
                wx.showToast({ title: '生成失败', icon: 'none' });
              }
            });
          }
        });
    } catch (error) {
      console.error('Save image failed:', error);
      this.setLoading(false);
      wx.showToast({ title: '保存失败', icon: 'none' });
    }
  },

  /**
   * 设置加载状态
   */
  setLoading(loading, text = '') {
    this.setData({ loading, loadingText: text });
  },

  onUnload() {
    // 清理资源
    if (this.gestureHandler) {
      this.gestureHandler.dispose();
    }
  }
});
