<script>
import Vue from "vue";
import Vuex from "vuex";
//----------------------自定义modules------------
import Jurisdiction from "./modules/Jurisdiction.js";
import Common from "./modules/common.js";
Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    Jurisdiction, //权限库
    Common, // 公共数据
  }
});
</script>