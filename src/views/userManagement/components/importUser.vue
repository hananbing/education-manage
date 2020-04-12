<template>
    <div>
        <p class="course-name" v-if="this.dialogDto.classesName">班级名称&nbsp;{{ this.dialogDto.classesName }}</p>
        <div class="dialog-search-box">
            <el-upload
                class="upload-demo"
                :action="action"
                :headers="headers"
                :data="params"
                :limit="1"
                :before-upload="onBeforeUpload"
                :on-error="onError"
                :on-success="onSuccess"
                :on-exceed="onExceed"
                :file-list="fileList"
            >
                <!-- <el-button size="small" type="primary">点击上传</el-button> -->
                <el-button type="primary" @click="importData">导入数据</el-button>
                <div slot="tip" class="el-upload__tip">只能上传excel文件</div>
            </el-upload>
            <el-button icon="iconfont iconmobanxiazai" class="download" @click="downloadTemplate">下载模板</el-button>
        </div>
        <div class="box">
            <h4>错误列表</h4>
            <vxe-table border stripe highlight-hover-row size="small" :data="tableData" max-height="350px">
                <vxe-table-column field="name" title="姓名" width="100"></vxe-table-column>
                <vxe-table-column title="手机号" field="phone" width="130"> </vxe-table-column>
                <vxe-table-column title="失败原因" field="reason" show-overflow> </vxe-table-column>
            </vxe-table>
            <!-- <pagniation :currentPage="form.current" :totalPage="totalPage" :totalNum="totalNum" @changePage="handleChangePage"></pagniation> -->
        </div>
        <a href="http://file.miniedu.com/学员导入模板1586410816381.csv?v=1586111" download ref="download"></a>
    </div>
</template>
<script>
import environment from '../../../environmental/index.js';
let baseURL = environment.env().url;
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
            fileList: [],
            action: '',
            headers: {},
            params: {
                classesId: this.dialogDto.classesId
            } // 额外参数
        };
    },
    props: {
        dialogDto: {
            type: Object,
            default: {}
        } // 组件props集合
    },
    computed: {
        visible() {
            return this.dialogDto.visible;
        }
    },
    watch: {
        visible(val) {
            if (!val) {
                this.tableData = [];
                this.fileList = [];
            }
        }
    },
    created() {
        this.headers.Authorization = 'Bearer ' + (sessionStorage.getItem('token') || '');
        this.action = baseURL + '/users/import';
    },
    methods: {
        getData() {},
        handleChangePage(page) {
            this.form.pageSize = page.pageSize;
            this.form.current = page.currentPage - 1;
            this.getData();
        },
        onBeforeUpload(file) {
            const type = ['.csv'];
            const flag = type.some(item => file.name.indexOf(item) > -1);
            if (!flag) {
                this.$message.error('导入文件只能是 csv 格式!');
            }
            return flag;
        },
        onError(err, file, fileList) {
            this.$message.error('上传失败');
        },
        onExceed() {
            this.$message.error('请删除历史文件后继续');
        },
        onSuccess(res) {
            this.tableData = res.data.failData || [];
        },
        importData() {},
        downloadTemplate() {
            this.$refs.download.click();
        }
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
