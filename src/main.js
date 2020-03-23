import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import api from './service/index.js'
import './style/element-variables.scss';
import 'babel-polyfill';
import 'xe-utils';
import VXETable from 'vxe-table';
import 'vxe-table/lib/index.css';
import { extendArray, formatMoney } from './utils/utils.js'
import * as directives from './directive/index.js'
import * as filters from './filters/index.js'
import confirm from './plugins/confirm/index.js'
import alert from './plugins/alert/index.js'
import searchBox from './components/tools/searchBox.vue'
import pagniation from './components/tools/Pagniation.vue'
Vue.use(VXETable);
Vue.config.productionTip = false;
Vue.use(ElementUI, {
    size: 'small'
});
extendArray() // 扩展数组方法
formatMoney() // 扩展Number方法
// filters
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})
  // 自定义指令
Object.keys(directives).forEach(key => {
    if (key === 'drag') {
      Vue.directive('el-drag-dialog', directives[key]) //弹框拖动
    } else {
      Vue.directive(key, directives[key])
    }
  })
Vue.component('search-box', searchBox)  
Vue.component('pagniation', pagniation)  
Vue.use(confirm)
Vue.use(alert)
Vue.prototype.$http = api // 挂载接口服务在原型上
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
