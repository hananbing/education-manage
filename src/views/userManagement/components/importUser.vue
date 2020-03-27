<template>
    <div>
        <div class="dialog-search-box">
            <!-- <el-input placeholder="请输入内容" v-model="input3" class="input-with-select">
                <el-select v-model="select" slot="prepend" placeholder="请选择">
                    <el-option label="餐厅名" value="1"></el-option>
                    <el-option label="订单号" value="2"></el-option>
                    <el-option label="用户电话" value="3"></el-option>
                </el-select>
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input> -->
            <el-button icon="iconfont icondaoru" @click="importData">导入</el-button>
            <el-button icon="iconfont iconxiazaimoban" @click="downloadTemplate">下载模板</el-button>
        </div>
        <p class="course-name" v-if="courseName">班级名称&nbsp;{{ courseName }}</p>
        <!-- <div class="container"> -->
        <vxe-table border stripe highlight-hover-row size="small" :loading="tableLoading">
            <vxe-table-column field="name" title="姓名" width="80"></vxe-table-column>
            <vxe-table-column title="手机号" field="login" width="110"> </vxe-table-column>
            <vxe-table-column title="失败原因" field="remark" show-overflow> </vxe-table-column>
        </vxe-table>
        <pagniation :currentPage="form.current" :totalPage="totalPage" :totalNum="totalNum" @changePage="handleChangePage"></pagniation>
        <!-- </div> -->
    </div>
</template>
<script>
export default {
    name: 'importUser',
    data() {
        return {
            form: {
                current: 0,
                pageSize: 30
            },
            tableData: [],
            totalPage: 0,
            totalNum: 0,
            tableLoading: false
        };
    },
    props: {
        courseName: String // 名称
    },
    methods: {
        getData() {},
        handleChangePage(page) {
            this.form.pageSize = page.pageSize;
            this.form.current = page.currentPage - 1;
            this.getData();
        }
    }
};
</script>
<style scoped></style>
