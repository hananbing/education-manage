<template>
    <div>
        <search-box :form="form">
            <template slot="input">
                <el-col :span="18"
                    ><span class="content-title">作业标题：{{ homeWorkTitle }} </span>
                </el-col>
            </template>
            <template slot="rightButton">
                <el-button type="default" icon="iconfont iconfanhui" @click="$router.back()">返回</el-button>
            </template>
        </search-box>
        <div class="container" v-loading="tableLoading">
            <vxe-table
                stripe
                highlight-hover-row
                size="medium"
                :data="tableData"
                show-header-overflow
                show-overflow
                :max-height="tableMaxHeight"
            >
                <vxe-table-column field="studentName" title="学员姓名"></vxe-table-column>
                <vxe-table-column title="提交时间">
                    <template slot-scope="scope">{{ scope.row.submitTime | formatDate('yyyy-MM-dd hh:mm') }}</template>
                </vxe-table-column>
                <vxe-table-column field="score" title="分数"></vxe-table-column>
                <vxe-table-column fixed="right" title="操作" width="220">
                    <template slot-scope="scope">
                        <div class="operation-icon">
                            <el-button type="text" @click="homeworkCorrecting(scope.row)">{{
                                scope.row.score ? '重批' : '批改'
                            }}</el-button>
                        </div>
                    </template>
                </vxe-table-column>
            </vxe-table>
            <pagniation :currentPage="form.current" :totalPage="totalPage" :totalNum="totalNum" @changePage="handleChangePage"></pagniation>
        </div>
        <el-dialog
            :title="addDialogTitle"
            :visible.sync="workDialogVisible"
            @close="closeAddDialog"
            :close-on-click-modal="false"
            width="780px"
        >
            <el-form ref="workForm" class="dialog-form-box" :model="workForm" label-width="100px">
                <el-form-item label="作业内容" prop="name">
                    <!-- <tinymce v-model.trim="workForm.content" :height="250" /> -->
                    <div v-html="workForm.content" class="work-content-box"></div>
                </el-form-item>
                <el-form-item label="得分" prop="score">
                    <el-slider v-model.number="workForm.score" show-input input-size="mini"> </el-slider>
                </el-form-item>
                <el-form-item label="评语">
                    <el-input
                        type="textarea"
                        placeholder="请输入评语"
                        v-model.trim="workForm.comment"
                        maxlength="300"
                        show-word-limit
                        :autosize="{ minRows: 2, maxRows: 4 }"
                    />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <template>
                    <el-button @click="workDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveData">确 定</el-button>
                </template>
            </span>
        </el-dialog>
    </div>
</template>
<script>
// import Tinymce from '@/components/Tinymce';
export default {
    data() {
        return {
            tableData: [],
            curCheckId: null,
            tableLoading: false,
            workForm: {
                content: '',
                score: 0,
                comment: ''
            },
            form: {
                current: 0,
                pageSize: 30
            },
            dialogType: 'add',
            totalPage: 0,
            totalNum: 0,
            homeWorkData: {},
            workDialogVisible: false
        };
    },
    // components: { Tinymce },
    computed: {
        addDialogTitle() {
            return this.dialogType === 'add' ? '批改' : '重批';
        },
        // 当前显示的作业标题
        homeWorkTitle() {
            return this.$route.query.title || '';
        },
        homeWorkId() {
            return this.$route.params.id;
        }
    },
    created() {
        this.getData();
    },
    methods: {
        searchData() {
            this.form.current = 0;
            this.getData();
        },
        getData() {
            this.tableLoading = true;
            this.$http.homeWorkService
                .getStudentByhomeWork({ homeworkId: this.homeWorkId })
                .then(res => {
                    this.totalPage = res.data.totalPages;
                    this.totalNum = res.data.totalElements;
                    this.tableData = res.data.content;
                })
                .finally(() => {
                    this.tableLoading = false;
                });
        },
        getHomeWorkDetails() {
            this.$http.homeWorkService.getHomeWorkById(this.homeWorkId).then(res => {
                this.homeWorkData = res.data;
            });
        },
        // 批改作业
        homeworkCorrecting({ score, answer, id }) {
            if (score) {
                this.dialogType = 'edit'; // 重批
            } else {
                this.dialogType = 'add'; // 批改
            }
            this.workForm.content = answer;
            this.curCheckId = id;
            this.workDialogVisible = true;
        },
        // 批改作业
        saveData() {
            this.dialogLoading = true;
            const params = {
                comment: this.workForm.comment,
                score: this.workForm.score,
                id: this.curCheckId
            };
            this.$http.homeWorkService
                .homeworkCorrecting(params)
                .then(res => {
                    this.closeAddDialog();
                    this.$message({
                        type: 'success',
                        message: '作业已批改'
                    });
                    this.getData();
                })
                .finally(() => {
                    this.dialogLoading = false;
                });
        },
        closeAddDialog() {
            this.workDialogVisible = false;
            this.resetWorkForm();
        },
        resetWorkForm() {
            this.workForm = {
                content: '',
                score: 0,
                comment: ''
            };
        },
        handleChangePage(page) {
            this.form.pageSize = page.pageSize;
            this.form.current = page.currentPage - 1;
            this.getData();
        }
    }
};
</script>
<style scoped lang="scss">
.content-title {
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
}
.work-content-box {
    height: 250px;
    overflow: auto;
    width: 100%;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    padding-left: 10px;
    box-sizing: border-box;
}
</style>
