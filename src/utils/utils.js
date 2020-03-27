
//表单判断是否全为空格
const validateName = (rule, value, callback) => {
  if (value && /^[ ]*$/.test(value)) {
    callback(new Error('内容不能全为空格！'))
  } else if (/[%\/\\]/.test(value)) {
    callback(new Error('内容不能包含% / \\字符！'))
  }
  callback()
}
//表单判断是否未手机号
const validatePhone = (rule, value, callback) => {
  if (!/^1[3456789]\d{9}$/.test(value)) {
    callback(new Error('请输入正确的手机号！'))
  }
  callback()
}
//验证邮箱
const validateEmail = (rule, value, callback) => {
  if (!/^([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/.test(value)) {
    callback(new Error('邮箱格式不正确！'))
  }
  callback()
}
//表单判断数字
const validateFormNumber = (rule, value, callback) => {
  if (value && !/^(-)?([1-9]+\.?\d*|0)$/.test(Number(value))) {
    callback(new Error('请输入数字'))
  }
  callback()
}
//表单判断数字
const validateNumber = (value) => {
  if (value && !/^(-)?([1-9]+\.?\d*|0)$/.test(Number(value))) {
    return false
  }
  return true
}

// 时间戳 => 2019-01-01   yyyy-MM-dd hh:mm:ss
const formatDate = (now, format = 'yyyy-MM-dd') => {
  if (!now) return ''
  now = new Date(now)
  var args = {
    'M+': now.getMonth() + 1,
    'd+': now.getDate(),
    'h+': now.getHours(),
    'm+': now.getMinutes(),
    's+': now.getSeconds(),
    'q+': Math.floor((now.getMonth() + 3) / 3), //quarter
    S: now.getMilliseconds()
  }
  if (/(y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      (now.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (var i in args) {
    var n = args[i]
    if (new RegExp('(' + i + ')').test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? n : ('00' + n).substr(('' + n).length)
      )
    }
  }
  return format
}
// 生成随机id
const guid = function(template = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx') {
  return template.replace(/[xy]/g, function(c) {
    let r = (Math.random() * 16) | 0
    let v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
/**
 * @param { Function } func 需要执行的函数
 * @param { Number } delay 延迟时间
 * @param { Boolean } immediate 是否立即执行
 */
// 防抖
const debouce = function(func, delay) {
  let timer = null
  return function() {
    let self = this
    let args = arguments
    timer && clearTimeout(timer)
    timer = setTimeout(function() {
      func.apply(self, args)
    }, delay)
  }
}
// 节流
const throttle = function(func, delay) {
  var timer = null
  var startTime = Date.now()
  return function() {
    var curTime = Date.now()
    var remaining = delay - (curTime - startTime)
    var context = this
    var args = arguments
    clearTimeout(timer)
    if (remaining <= 0) {
      func.apply(context, args)
      startTime = Date.now()
    } else {
      timer = setTimeout(func, remaining)
    }
  }
}
// 扩展数组原形方法 { filterMap } 结合map和filter
const extendArray = function() {
  // eslint-disable-next-line no-extend-native
  Array.prototype.filterMap = function(fn) {
    let arr = Array.prototype.slice.call(this)
    let result = []
    for (let i = 0; i < arr.length; i++) {
      let value = fn.call(this, arr[i], i)
      if (value && typeof value !== 'undefined') result.push(value)
    }
    return result
  }
}
// 扩展Number 方法 格式化货币
const formatMoney = function() {
  // 保留几位小数，货币符号，千位分隔符，小数分隔符
  // eslint-disable-next-line no-extend-native
  Number.prototype.formatMoney = function(
    places = 2,
    symbol = '',
    thousand = '',
    decimal = '.'
  ) {
    let number = this
    number = parseFloat(number)
    let negative = number < 0 ? '-' : ''
    let i = parseInt((number = Math.abs(+number || 0).toFixed(places)), 10) + ''
    let j = (j = i.length) > 3 ? j % 3 : 0
    return (
      symbol +
      negative +
      (j ? i.substr(0, j) + thousand : '') +
      i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousand) +
      (places
        ? decimal +
          Math.abs(number - i)
            .toFixed(places)
            .slice(2)
        : '')
    )
  }
}
// 复制文本
/**
 * @param {String} text 需要选择的内容
 */
const copyContent = function(text = '') {
  let node = document.createElement('span')
  node.textContent = text
  node.style.transform = 'translateX(-1000px)'
  document.body.appendChild(node)
  return new Promise(resolve => {
    let range = document.createRange()
    range.selectNodeContents(node)
    let selection = document.getSelection()
    selection.removeAllRanges() // 清空内容
    selection.addRange(range) // 添加node的内容
    document.execCommand('Copy') // 执行复制
    document.body.removeChild(node)
    resolve()
  })
}
// 判断数据变化是否需要改变页码，自动跳转上一页
/**
 * @param { number } data 返回数据
 * @param { Object } form 页码表单对象
 * @param { fn } fn 获取数据函数
 */
const judgeIsChangeCurPage = function(data, form, fn) {
  const { content, totalPages } = data
  const len = (content || []).length
  if (!len && totalPages == form.current && form.current > 0) {
    form.current--
    fn && fn()
  }
}

export {
  validateName,
  validateNumber,
  validateFormNumber, // 表单使用
  validatePhone,
  debouce,
  throttle,
  guid,
  extendArray,
  formatDate,
  formatMoney,
  copyContent,
  judgeIsChangeCurPage
}
