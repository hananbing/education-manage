<template>
  <div class="custom-button" >
    <el-button icon="iconfont iconxinzeng" @click="$emit('click')" :disabled='disabled'><slot/></el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
    }
  },
  props:{
    disabled:{
      type:Boolean,
      default:false
    }
  },
  methods: {

  },
}
</script>
<style scoped>
.custom-button .el-button{
  border-style: dashed;
  width: 100%;
}
</style>
