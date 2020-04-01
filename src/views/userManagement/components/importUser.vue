<template>
    <div>
        <p class="course-name" v-if="this.dialogDto.classesName">班级名称&nbsp;{{ this.dialogDto.classesName }}</p>
        <div class="dialog-search-box">
            <el-upload
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts/"
                :limit="1"
                :on-error="onError"
                :file-list="fileList"
            >
                <!-- <el-button size="small" type="primary">点击上传</el-button> -->
                <el-button type="primary" @click="importData">导入数据</el-button>
                <div slot="tip" class="el-upload__tip">只能上传excel文件</div>
            </el-upload>
            <el-button icon="iconfont iconmobanxiazai" class="download" @click="downloadTemplate">下载模板</el-button>
        </div>
        <div class="box" >
            <h4>错误列表</h4>
            <vxe-table border stripe highlight-hover-row size="small">
                <vxe-table-column field="name" title="姓名" width="100"></vxe-table-column>
                <vxe-table-column title="手机号" field="login" width="130"> </vxe-table-column>
                <vxe-table-column title="失败原因" field="remark" show-overflow> </vxe-table-column>
            </vxe-table>
            <pagniation :currentPage="form.current" :totalPage="totalPage" :totalNum="totalNum" @changePage="handleChangePage"></pagniation>
        </div>
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
            fileList: []
        };
    },
    props: {
        dialogDto: {
            type: Object,
            default: {}
        } // 组件props集合
    },
    methods: {
        getData() {},
        handleChangePage(page) {
            this.form.pageSize = page.pageSize;
            this.form.current = page.currentPage - 1;
            this.getData();
        },
        onError(err, file, fileList){
            this.$message.error('上传失败')
        },
        importData() {},
        downloadTemplate() {}
    }
};
</script>
<style scoped>
.dialog-search-box {
    position: relative;
    margin: 5px 0 20px;
}
.download {
    position: absolute;
    left: 90px;
    top: 0;
}
</style>
