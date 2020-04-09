<template>
    <div>
        <search-box :form="form">
            <template slot="input">
                <el-col :span="18"> 作业标题：{{ homeWorkTitle }} </el-col>
            </template>
            <template slot="rightButton">
                <el-button type="default" icon="iconfont iconfanhui" @click="openAddDialog">返回</el-button>
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
                <vxe-table-column field="name" title="作业标题"></vxe-table-column>
                <vxe-table-column title="结束时间">
                    <template slot-scope="scope">{{ scope.row.endDate | formatDate }}</template>
                </vxe-table-column>
                <vxe-table-column fixed="right" title="操作" width="220">
                    <template slot-scope="scope">
                        <div class="operation-icon">
                            <el-button type="text" @click="homeworkCorrecting(scope.row)">{{
                                scope.row.corrented ? '重批' : '批改'
                            }}</el-button>
                        </div>
                    </template>
                </vxe-table-column>
            </vxe-table>
            <pagniation :currentPage="form.current" :totalPage="totalPage" :totalNum="totalNum" @changePage="handleChangePage"></pagniation>
        </div>
        <el-dialog
            :title="addDialogTitle"
            :visible.sync="wokDialogVisible"
            @close="closeAddDialog"
            :close-on-click-modal="false"
            width="780px"
        >
            <p class="course-name">班级名称&nbsp;{{ curClassName }}</p>
            <el-form ref="workForm" class="dialog-form-box" :model="workForm" label-width="115px">
                <el-form-item label="作业标题" prop="name">
                    <el-input v-model.trim="workForm.name" placeholder="请输入作业标题"></el-input>
                </el-form-item>
                <el-form-item label="结束时间" prop="time">
                    <el-date-picker v-model="workForm.time" type="datetime" style="width: 100%;" value-format="timestamp"> </el-date-picker>
                </el-form-item>
                <el-form-item label="作业内容" prop="content">
                    <tinymce v-model.trim="workForm.content" :height="250" />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <template v-if="dialogType !== 'view'">
                    <el-button @click="wokDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveData">确 定</el-button>
                </template>
                <template v-else><el-button @click="wokDialogVisible = false">关 闭</el-button></template>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import Tinymce from '@/components/Tinymce';
export default {
    data() {
        return {
            tableData: [],
            curCheckId: null,
            tableLoading: false,
            workForm: {},
            dialogType: 'add',
            totalPage: 0,
            totalNum: 0,
            wokDialogVisible: false
        };
    },
    components: { Tinymce },
    computed: {
        addDialogTitle() {
            return this.dialogType === 'add' ? '新增' : this.dialogType === 'edit' ? '编辑' : '查看';
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
            const params = Object.assign({}, this.form);
            params.endStatus = params.endStatus !== 'unFinished';
            this.$http.courseService
                .getAllCourses(params)
                .then(res => {
                    this.totalPage = res.data.totalPages;
                    this.totalNum = res.data.totalElements;
                    this.tableData = Object.freeze(res.data.content);
                })
                .finally(() => {
                    this.tableLoading = false;
                });
        },
        // 批改作业
        homeworkCorrecting() {},
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
        handleChangePage(page) {
            this.form.pageSize = page.pageSize;
            this.form.current = page.currentPage - 1;
            this.getData();
        }
    }
};
</script>
<style scoped lang="scss"></style>
