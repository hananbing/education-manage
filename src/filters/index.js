// 时间格式  input: 2019001  output :2019-01-01
let dateServer = value => {
  return value.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');
};
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
export { dateServer, formatDate };
