<template>
  <transition name="el-fade-in-linear">
    <div class="alert-warpper"  v-show='visible' >
      <div class="message-box" @click.stop transition="expand">
        <div class="message-header">
          <i class="tips-icon" :class='titleIcon' :style="{'color': colorType}"></i>
          <span >{{title}}</span>
          <!-- <i class="el-icon-close" @click='visible = false'></i> -->
        </div>
        <div class="message-body">
          <div class="message-content-box">
            <p v-if="dangerouslyUseHTMLString" v-html="messageText"></p>
            <p v-else >{{messageText}}</p>
          </div>
        </div>
        <div class="message-footer">
          <div style="float:right">
            <el-button type="primary" @click="confirmBtn" size='small'>{{confirmButtonText}}</el-button>
          </div>
        </div>
      </div>
    </div>
  </transition> 
</template>
<script>
export default {
  data(){
    return {
      messageText:'',
      title:'',
      type:'warning', //图标类型
      icon:'',
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: false, // 是否插入html
      visible:false, 
    }
  },
  computed:{
    titleIcon(){
      if(this.icon){
        return this.icon
      }else{
        return 'el-icon-'+ this.type
      }
    },
    colorType(){
      const colors = {
        warning:'#e6a23c',
        success:'#52C41A',
        error:'#F5222D'
      }
      return colors[this.type] || '#e6a23c'
    }
  },
  methods:{
    confirmBtn(){
      this.visible = false;
    }
  }
}
</script>

<style scoped lang='scss'>
  .el-fade-in-linear-enter .message-box{
    transform: translateY(-20px);
  }
  .el-fade-in-linear-leave-active .message-box{
    transform: translateY(-6px);
  }
  .message-box{
    transition: all .25s;
    padding: 5px 20px 10px;
    background: red;
    display: inline-block;
    width: 380px;
    padding-bottom: 10px;
    vertical-align: middle;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    font-size: 18px;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    text-align: left;
    overflow: hidden;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    position: absolute;
    left:50%;
    margin-left: -210px;
    top:30%;
    z-index: 1000111;
  }
  .message-body{
    .message-content-box{
      padding-left: 35px;
      color: #5E6D82;
      line-height: 22px;
      font-size: 12px;
      margin-bottom: 26px;
      .title{
        color: #1F2D3D;
        font-size: 16px;
        font-weight: 700;
        margin-bottom: 5px;
      }
    }
  }
  .alert-warpper{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    background-color:rgba(0,0,0,.5);
    z-index: 1000;
  }
  .message-footer{
    overflow: hidden;
    line-height: 36px;
  }
  .message-header{
    display: flex;
    align-items: center;
    line-height: 20px;
    padding: 10px 0 8px ;
    .tips-icon{
      font-size:20px;
      color: #e6a23c;
      margin-right: 15px;
    }
    span{
      font-size: 16px;
      color: #262626;
      font-weight: bold;
    }
  }
  .expand-transition {
  transition: all .2s ease;
  height: 30px;
  padding: 10px;
  background-color: #eee;
  overflow: hidden;
}
.expand-enter, .expand-leave {
  height: 0;
  padding: 0 10px;
  opacity: 0;
}
</style>

