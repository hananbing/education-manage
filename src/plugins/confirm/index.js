import confirmComponent from './confirm.vue'

const Confirm = {};

// 注册confirm
Confirm.install = function (Vue) {
  const ConfirmConstructor = Vue.extend(confirmComponent)
  const instance = new ConfirmConstructor();
  instance.$mount(document.createElement('div'))
  document.body.appendChild(instance.$el)

  // 通过Vue的原型注册一个方法
  Vue.prototype.$confirmComponent = (msgTitle, msgText, btnObj = {}) => {
    return new Promise((resolve, reject) => {
      instance.messageTitle = msgTitle;
      instance.messageText = msgText;
      instance.icon = btnObj.icon || null;
      instance.type = btnObj.type || 'warning';
      instance.closeOnClickModal = typeof btnObj.closeOnClickModal === 'boolean' ? btnObj.closeOnClickModal : true;
      instance.leftButtonText = btnObj.leftButtonText || '';
      instance.confirmButtonText = btnObj.confirmButtonText || '确 定';
      instance.cancelButtonText = btnObj.cancelButtonText || '取 消';
      instance.visible = true;
      instance.confirmBtn = function () { // 确认框
        instance.visible = false;
        resolve('confirm')
      }
      instance.leftBtn = function () { // 左侧返回框
        instance.visible = false;
        resolve('leftBtn')
      }
      instance.cancelBtn = function () { // 取消框
        instance.visible = false;
        reject()
      }
    })
  }
}

export default Confirm
