import alertComponent from './alert.vue'

const Alert = {}

// 注册alert
Alert.install = function(Vue) {
  const AlertConstructor = Vue.extend(alertComponent)
  const instance = new AlertConstructor()
  instance.$mount(document.createElement('div'))
  document.body.appendChild(instance.$el)

  // 通过Vue的原型注册一个方法
  Vue.prototype.$alertComponent = (msgText, title, propsObj) => {
    return new Promise(resolve => {
      instance.messageText = msgText
      instance.title = title || '提示'
      instance.type = propsObj.type || 'warning'
      instance.icon = propsObj.icon || ''
      instance.dangerouslyUseHTMLString = propsObj.dangerouslyUseHTMLString || false
      instance.confirmButtonText = propsObj.confirmButtonText || '确 定'
      instance.visible = true
      instance.confirmBtn = function() {
        // 确认框
        instance.visible = false
        resolve()
      }
    })
  }
}

export default Alert
