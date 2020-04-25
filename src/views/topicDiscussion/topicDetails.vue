<template>
    <div>
        <search-box :form="form">
            <template slot="input">
                <el-col :span="18"
                    ><span class="content-title">话题标题：{{ topicTitle }} </span>
                </el-col>
            </template>
            <template slot="rightButton">
                <el-button type="default" icon="iconfont iconfanhui" @click="$router.back()">返回</el-button>
            </template>
        </search-box>
        <div class="container" v-loading="tableLoading">
            <vxe-table stripe highlight-hover-row size="medium" :data="tableData" show-header-overflow show-overflow :max-height="tableMaxHeight">
                <vxe-table-column title="回复时间" width="180">
                    <template slot-scope="scope">{{ scope.row.replyTime | formatDate('yyyy-MM-dd hh:mm') }}</template>
                </vxe-table-column>
                <vxe-table-column field="replierName" title="回复人姓名" width="150"></vxe-table-column>
                <vxe-table-column field="replyContent" title="回复内容"></vxe-table-column>
                <vxe-table-column title="得分" width="380">
                    <template slot-scope="scope">
                        <el-slider
                            show-input
                            input-size="mini"
                            v-model.number="scope.row.score"
                            class="slider"
                            :class="{ dark: !scope.row.light }"
                            @change="sliderChange(scope.row)"
                            style="margin-left:5px;"
                        >
                        </el-slider>
                    </template>
                </vxe-table-column>
                <vxe-table-column title="" width="100">
                    <template slot-scope="scope">
                        <el-button type="text" @click="saveScore(scope.row)">保存</el-button>
                        <el-button type="text" @click="removeReply(scope.row)">删除</el-button>
                    </template>
                </vxe-table-column>
            </vxe-table>
            <pagniation :currentPage="form.current" :totalPage="totalPage" :totalNum="totalNum" @changePage="handleChangePage"></pagniation>
        </div>
        <el-dialog :title="addDialogTitle" :visible.sync="workDialogVisible" @close="closeAddDialog" :close-on-click-modal="false" width="780px">
            <el-form ref="workForm" class="dialog-form-box" :model="workForm" label-width="115px">
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
            workDialogVisible: false
        };
    },
    // components: { Tinymce },
    computed: {
        addDialogTitle() {
            return this.dialogType === 'add' ? '批改' : '重批';
        },
        // 当前显示的作业标题
        topicTitle() {
            return this.$route.query.title || '';
        },
        topicId() {
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
            this.$http.topiceService
                .getTopiceReplicesList(this.topicId, this.form)
                .then(res => {
                    this.totalPage = res.data.totalPages;
                    this.totalNum = res.data.totalElements;
                    this.tableData = (res.data.content || []).map(item => {
                        item.light = false;
                        // item.score = 0;
                        return item;
                    });
                })
                .finally(() => {
                    this.tableLoading = false;
                });
        },
        // 删除回复
        removeReply({ id }) {
            this.$http.topiceService.removeReply(id).then(res => {
                this.$message({
                    type: 'success',
                    message: '回复已删除'
                });
                this.getData()
            });
        },
        // 批改作业
        homeworkCorrecting({ corrented, content }) {
            if (corrented) {
                this.dialogType = 'edit'; // 重批
            } else {
                this.dialogType = 'add'; // 重批
            }
            this.content = content;
            this.workDialogVisible = true;
        },
        // 保存打分
        saveScore(row) {
            this.$http.topiceService.correntScore({ id: row.studentTopicId ,  score:row.score }).then(res => {
                row.light = false;
                this.$message({
                    type: 'success',
                    message: '保存成功'
                });
            });
        },
        // 批改作业
        saveData() {
            this.dialogLoading = true;
            if (this.dialogType === 'add') {
                this.$http.courseService
                    .createCourse(params)
                    .then(res => {
                        this.closeAddDialog();
                        this.$message({
                            type: 'success',
                            message: '课程添加成功'
                        });
                        this.getData();
                    })
                    .finally(() => {
                        this.dialogLoading = false;
                    });
            } else {
                this.$http.courseService
                    .updateCourse(params)
                    .then(res => {
                        this.getData();
                        this.closeAddDialog();
                        this.$message({
                            type: 'success',
                            message: '课程修改成功'
                        });
                    })
                    .finally(() => {
                        this.dialogLoading = false;
                    });
            }
        },
        sliderChange(row) {
            row.light = true;
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
<style scoped>
.dark >>> .el-slider__bar {
    background-color: #cccccc;
}
.dark >>> .el-slider__button {
    border-color: #cccccc;
}
.slider >>> .el-slider__input.el-input-number {
    width: 100px !important;
}
.slider >>> .el-slider__runway {
    margin-right: 114px;
}
</style>
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
}
</style>
