<template>
    <div class="uploadImg">
        <el-upload
            name="upload"
            :action="action"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :file-list="fileList"
            multiple
            :limit="limit"
            :on-success='handleSuccess'
            :on-error='handleError'
            :on-exceed='handleExceed'
        >
            <i class="el-icon-plus"></i>
            <div slot="file" slot-scope="{ file }" class="picture-list">
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                <span class="el-upload-list__item-actions">
                  <div class="picture-layer">
                    <i class="iconfont iconsheweifengmian" @click="setCover(file.url)">设为封面</i>
                  </div>
                  <i class="iconfont iconshanchu close-btn" @click="handleRemove(file.url)"></i>
                  <i class="banner" v-if='file.display'></i>
                </span>
            </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>
<script>
import environment from '../../environmental' 
export default {
    name: 'uploadImg',
    data() {
        return {
          fileList:[],
          dialogImageUrl:'',
          dialogVisible:false,
          action:environment.env().url + '/files/file'
        };
    },
    props:{
      limit:{
        type:Number,
        default: 20
      },
      value:{
        type:Array,
        default: ()=> []
      }
    },
    watch:{
      fileList(val){
        this.$emit('input', val)
      },
      value(val){
        this.fileList = val
      }  
    },
    methods: {
      handleSuccess(file){
        let fileItem = { display:false, url:file.data }
        this.fileList.push({ display:this.fileList.length < 1, url:file.data })
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      }
      ,setCover(url){
        this.fileList = this.fileList.map(item => {
          item.display = false
          if(item.url === url){
            item.display = true;
          }
          return item
        })
      },
      handleRemove(url) {
        this.fileList = this.fileList.filter(item => item.url !== url)
        if(this.fileList.length === 1){
          let file = this.fileList[0];
          file.display = true
          this.fileList = [file]
        }
      },
      handleError(){
        this.$message.error('上传失败')
      },
      handleExceed(){
        this.$message.error('只能上传一张图片')
      }
    }
};
</script>
<style >
  .uploadImg .el-upload-list__item-actions{
    background: transparent !important;
    opacity: 1;
  }
  .uploadImg .el-upload-list--picture-card .el-upload-list__item{
    overflow: inherit;
    height: 120px;
    width: 120px;
  }
  .uploadImg .el-upload--picture-card{
    height: 120px;
    width: 120px;
    line-height: 120px;
  }
</style>
<style scoped>
.picture-layer{
  width: 100%;
  height:30px;
  line-height: 30px;
  text-align: center;
  font-size: 12px;
  color: #fff;
  background:rgba(0,0,0,.6);
  opacity: 0;
  position: absolute;
  bottom: 0;
  z-index: 2222;
  cursor: pointer;
  transition: opacity .2s;
}
.el-upload-list__item-actions:hover .picture-layer{
  opacity: 1;
}
.picture-layer .iconfont{
  font-size: 12px;
}
.picture-layer .iconfont::before{
  margin-right: 4px;
}
.close-btn{
  position: absolute;
  top: -11px;
  right: -4px;
  font-size: 17px;
  color: #cccccc ;
  cursor: pointer;
}
.close-btn:hover{
  color: #a6a6a6
}
.banner{
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 34px;
  height: 34px;
  background-image: url('../../assets/img/fengmian.png')
}
</style>
