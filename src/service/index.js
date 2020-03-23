const serviceContext = require.context('./pc/', true, /\.js$/);
let serviceAssgin = {}
serviceContext.keys().forEach(service => {
    const serviceModule = serviceContext(service);
    serviceAssgin = Object.assign(serviceAssgin, serviceModule.default)
    /**
     * 兼容 import export 和 require module.export 两种规范
     */
});
export default serviceAssgin
