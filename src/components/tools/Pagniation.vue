<template>

    <!-- 页码 -->
    <div  class="pagniation-box">
      <div
        class="pages-left"
      >
        <span class="el-pagination__total">共{{totalNum || 0}}条</span>
        <el-select
          v-model="pageSize"
          size="mini"
          @change="pageSizeChange"
          placeholder="10条/页"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="pages-right">
        <div>
          <el-pagination
            background
            layout="prev, pager, next"
            :page-count="Number(totalPage)"
            @current-change='handleCurrentChange'
            :current-page.sync="current"
          >
          </el-pagination>
        </div>
        <div class="page-jump">
          <div class="demo-input-suffix">
            前往
            <el-input
              v-model="jumpPage"
              type="text"
              style="width:auto"
              @keyup.enter.native="pageJump"
            >
            </el-input>
            页
            <el-button
              size="mini"
              @click="pageJump"
              style="margin-left:5px;"
            >跳转</el-button>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      jumpPage: 1,
      current: 1, //当前页码
      pageSize: 30, //每页行数
    };
  },
  props:{
    'totalPage':{
      default: 0
    },
    'totalNum':{
      default: 0
    },
    'initPageSize':{
      default: 30
    },
    'currentPage':{
      default:0,
      type:Number
    },
    options:{
      default:()=>[
        {
          value: 30,
          label: "30条/页"
        },
        {
          value: 50,
          label: "50条/页"
        },
        {
          value: 70,
          label: "70条/页"
        },
        {
          value: 100,
          label: "100条/页"
        }
      ],
      type:Array
    }
  },
  created(){
    this.current = this.currentPage + 1;
    this.pageSize = this.initPageSize;
  },
  watch: {
    // pageSize(val, oldval) {
    //   if (val != oldval) {
    //     this.current = 1;
    //     this.getData();
    //   }
    // },
    currentPage(val){
      this.current = val + 1;
      this.jumpPage = val + 1;
    },
  },
  methods: {
    //跳转至某页
    pageJump() {
      if (
        parseInt(this.jumpPage) &&
        parseInt(this.jumpPage) <= this.totalPage
      ) {
        this.current = parseInt(this.jumpPage);
        this.getData();
      }
    },
    pageSizeChange(){
      this.current = 1;
      this.getData();
    },
    handleCurrentChange(page) {
      this.current = page;
      this.getData();
    },
    getData() {
      this.jumpPage = this.current
      this.$emit("changePage", {
        pageSize: this.pageSize,
        currentPage: this.current
      });
    },
    //重置页码
    refreshPage() {
      this.current = 1;
      this.jumpPage = 1;
    }
  }
};
</script>
<style >
.pagniation-box{
  background: #fff;
  padding: 15px 10px; 
  overflow: hidden;
  display: flex;
  justify-content:flex-end;
  align-items: center;
}
.pages-left{
  display: flex;
  margin-right: 20px;
  align-items: center;
}
.pages-left .el-input__inner{
  width: 100px;
}
.pages-right{
  display: flex;justify-content: flex-start;
}
.el-pagination__total{
  font-size: 13px;
  margin-right: 10px;
  font-weight: 400;
  color: #606266;
}
.page-jump .el-input__inner {
    height: 28px !important;
    line-height: 29px;
    width: 60px;
    margin-top: 2px;
}
.page-jump {
  font-size: 14px;
  color: #5d687a;
  float: left;
}
</style>

