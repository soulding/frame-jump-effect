// SBTI 人格计算工具

const { TYPE_PATTERNS, TYPE_LIBRARY } = require('./data')

/**
 * 将用户答案转换为维度评分
 * @param {Object} answers - 用户答案 {q1: 1, q2: 2, ...}
 * @returns {Object} 维度评分
 */
function calculateDimensions(answers) {
  const dimensions = {
    S1: 0, S2: 0, S3: 0,
    E1: 0, E2: 0, E3: 0,
    A1: 0, A2: 0, A3: 0,
    Ac1: 0, Ac2: 0, Ac3: 0,
    So1: 0, So2: 0, So3: 0
  }

  const { questions } = require('./data')
  
  questions.forEach(q => {
    const answer = answers[q.id]
    if (answer !== undefined) {
      dimensions[q.dim] += answer
    }
  })

  // 计算每个维度的平均分 (每个维度 2 题，满分 6 分)
  Object.keys(dimensions).forEach(key => {
    dimensions[key] = dimensions[key] / 2
  })

  return dimensions
}

/**
 * 将分数转换为等级 (H/M/L)
 * @param {number} score - 分数 (1-3)
 * @returns {string} 等级
 */
function scoreToLevel(score) {
  if (score >= 2.5) return 'H'
  if (score <= 1.5) return 'L'
  return 'M'
}

/**
 * 计算人格匹配度
 * @param {string} userPattern - 用户模式字符串 (如 "HHH-HMH-MHH-HHH-MHM")
 * @param {string} typePattern - 类型模式字符串
 * @returns {number} 匹配度 (0-100)
 */
function calculateMatch(userPattern, typePattern) {
  if (typePattern === 'random') {
    return Math.floor(Math.random() * 20) + 60 // 60-80 随机
  }

  const userParts = userPattern.split('-')
  const typeParts = typePattern.split('-')
  
  let matches = 0
  let total = 0

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 3; j++) {
      total++
      if (userParts[i][j] === typeParts[i][j]) {
        matches++
      }
    }
  }

  return Math.round((matches / total) * 100)
}

/**
 * 根据维度评分生成模式字符串
 * @param {Object} dimensions - 维度评分
 * @returns {string} 模式字符串
 */
function dimensionsToPattern(dimensions) {
  const groups = [
    ['S1', 'S2', 'S3'],
    ['E1', 'E2', 'E3'],
    ['A1', 'A2', 'A3'],
    ['Ac1', 'Ac2', 'Ac3'],
    ['So1', 'So2', 'So3']
  ]

  return groups.map(group => {
    return group.map(dim => scoreToLevel(dimensions[dim])).join('')
  }).join('-')
}

/**
 * 计算最终人格类型
 * @param {Object} answers - 用户答案
 * @returns {Object} 结果 {type, match, dimensions, desc}
 */
function calculateResult(answers) {
  const dimensions = calculateDimensions(answers)
  const userPattern = dimensionsToPattern(dimensions)
  
  let bestMatch = null
  let bestScore = -1

  // 遍历所有人格类型，找到最佳匹配
  Object.entries(TYPE_PATTERNS).forEach(([code, pattern]) => {
    const score = calculateMatch(userPattern, pattern)
    if (score > bestScore) {
      bestScore = score
      bestMatch = code
    }
  })

  const typeInfo = TYPE_LIBRARY[bestMatch] || TYPE_LIBRARY['HHHH']

  return {
    type: bestMatch,
    typeCn: typeInfo.cn,
    intro: typeInfo.intro,
    desc: typeInfo.desc,
    match: bestScore,
    dimensions: dimensions,
    pattern: userPattern
  }
}

module.exports = {
  calculateDimensions,
  calculateResult,
  scoreToLevel,
  dimensionsToPattern
}
