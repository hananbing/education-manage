<template>
  <transition name="el-fade-in-linear">
    <div class="comfire-warpper"  v-show='visible' @click.stop='handleCloseOnClickModal'>
      <div class="message-box" @click.stop transition="expand">
        <div class="message-header">
          <span >{{title}}</span>
          <i class="el-icon-close" @click='visible = false'></i>
        </div>
        <div class="message-body">
          <i class="tips-icon" :class='titleIcon' :style="{'color': type === 'success' ? '#52C41A' : type === 'warning' ? '#e6a23c': '#e6a23c'}"></i>
          <div class="message-content-box">
            <p class="title">{{messageTitle}}</p>
            <p v-show="messageText">{{messageText}}</p>
          </div>
        </div>
        <div class="message-footer">
          <el-button type="text" v-if='leftButtonText' style='float:left;font-size:12px;' @click='leftBtn'>{{leftButtonText}}</el-button>
          <div style="float:right">
            <el-button @click="cancelBtn" size='small'>{{cancelButtonText}}</el-button>
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
      messageTitle:'',
      messageText:'',
      title:'',
      type:'warning', //图标类型
      icon:'',
      closeOnClickModal:'true', // 点击遮罩层关闭弹框
      leftButtonText:'',
      confirmButtonText: "确定",
      cancelButtonText: "取消",
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
    }
  },
  methods:{
    cancelBtn(){
      this.visible = false;
    },
    confirmBtn(){
      this.visible = false;
    },
    leftBtn(){
      this.visible = false;
    },
    handleCloseOnClickModal(){
      this.closeOnClickModal && (this.visible = false)
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
    transition: all .3s;
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
    z-index: 10001;
  }
  .message-body{
    .tips-icon{
      font-size:25px;
      color: #e6a23c;
      position: absolute;
    }
    .message-content-box{
      padding-left: 40px;
      color: #5E6D82;
      line-height: 24px;
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
  .comfire-warpper{
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
    padding: 3px 0 ;
    align-items: center;
    justify-content: space-between;
    span{
      font-size: 16px;
      font-weight: bold;
    }
    i{
      cursor: pointer;
    }
    i:hover{
      color: #1d7fff;
    } 
  }
  .expand-transition {
  transition: all .3s ease;
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

