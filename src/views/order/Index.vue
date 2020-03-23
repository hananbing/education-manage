<template>
  <div>
    <search-box :form="form" title="订单列表">
      <template slot="input">
        
      </template>
      <template slot='button'>
        <el-button type="warning"  icon="el-icon-search" @click="searchData">搜索</el-button>
        <el-button  icon="el-icon-refresh" @click="resetForm">重置</el-button>
      </template>
    </search-box>
     <div class="container">
      <div>
        <vxe-table
          border
          stripe
          highlight-hover-row
          :loading='tableLoading'
          ref="orderTable">
          <vxe-table-column field="commodityClassificationId" title="订单编号"></vxe-table-column>
          <vxe-table-column field="number" title="下单时间" show-overflow></vxe-table-column>
          <vxe-table-column field="name" title="下单用户ID" show-overflow></vxe-table-column>
          <vxe-table-column field="originalPrice" title="状态"></vxe-table-column>
          <vxe-table-column fixed='right' title="操作" width='130'>
            <template slot-scope="scope">
              <div class="operation-icon">
                <i @click="checkDetails(scope.row)">订单详情</i>
                <i>审核</i>
              </div> 
            </template>
          </vxe-table-column>
        </vxe-table>
        <pagniation
          :pageSize="form.pageSize"
          :currentPage="form.current"
          :totalPage="totalPage"
          :totalNum="totalNum"
          @changePage="handleChangePage"
        ></pagniation>
      </div>
    </div>
  </div>
</template>
<script>
import searchBox from '@/components/tools/searchBox.vue'
import Pagniation from '@/components/tools/Pagniation.vue'
export default {
  components:{ searchBox, Pagniation, OrderDetails },
  data() {
    return {
      form:{
        current:0,
        pageSize:30,
      },
      tableLoading:false,
      totalPage:0,
      totalNum:0,
      dialogVisible:true,
    }
  },
  mounted(){
    this.getData()
  },
  methods: {
    getData(){
      this.$refs.orderTable.loadData([]);
    },
    // 查看详情
    checkDetails(){
      this.dialogVisible = true
    },
    searchData(){
      this.form.current = 0;
      this.getData()
    },
    handleChangePage(page){
      this.form.pageSize = page.pageSize;
      this.form.current = page.currentPage - 1;
      this.getData()
    },
    resetForm(){

    }
  },
}
</script>
<style scoped>
</style>
