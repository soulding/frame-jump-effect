const { questions } = require('../../utils/data')
const { calculateResult } = require('../../utils/calculator')

Page({
  data: {
    questions: questions,
    currentQuestion: 0,
    selectedOption: null,
    answers: {},
    progress: 0
  },

  onLoad() {
    this.updateProgress()
  },

  get currentQuestionObj() {
    return this.data.questions[this.data.currentQuestion]
  },

  getDimName(dim) {
    const dimNames = {
      'S1': '自我认知',
      'S2': '自我清晰',
      'S3': '成就动机',
      'E1': '依恋焦虑',
      'E2': '投入程度',
      'E3': '独立需求',
      'A1': '人性看法',
      'A2': '规则态度',
      'A3': '意义追求',
      'Ac1': '趋避倾向',
      'Ac2': '决策风格',
      'Ac3': '执行风格',
      'So1': '社交倾向',
      'So2': '亲密需求',
      'So3': '社交面具'
    }
    return dimNames[dim] || dim
  },

  updateProgress() {
    const progress = ((this.data.currentQuestion + 1) / this.data.questions.length) * 100
    this.setData({ progress })
  },

  selectOption(e) {
    const value = e.currentTarget.dataset.value
    const index = e.currentTarget.dataset.index
    this.setData({ selectedOption: index })
  },

  nextQuestion() {
    if (this.data.selectedOption === null) return

    const currentQ = this.data.questions[this.data.currentQuestion]
    const selectedValue = currentQ.options[this.data.selectedOption].value

    // 保存答案
    const answers = { ...this.data.answers }
    answers[currentQ.id] = selectedValue
    this.setData({ answers })

    // 判断是否最后一题
    if (this.data.currentQuestion === this.data.questions.length - 1) {
      // 计算结果并跳转
      const result = calculateResult(answers)
      wx.setStorageSync('sbti_result', result)
      wx.navigateTo({
        url: '/pages/result/result'
      })
    } else {
      // 下一题
      this.setData({
        currentQuestion: this.data.currentQuestion + 1,
        selectedOption: null
      })
      this.updateProgress()
    }
  }
})
