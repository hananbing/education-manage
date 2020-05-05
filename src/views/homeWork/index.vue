<template>
    <div>
        <search-box :form="form">
            <template slot="tabs">
                <el-tabs v-model="form.endStatus" @tab-click="searchData">
                    <el-tab-pane label="未结束" name="unFinished"></el-tab-pane>
                    <el-tab-pane label="已结束" name="finished"></el-tab-pane>
                </el-tabs>
            </template>
            <template slot="input">
                <el-col :span="5">
                    <el-form-item>
                        <el-select v-model="form.classesId" style="width: 100%;" placeholder="班级名称" @change="searchData" filterable>
                            <el-option v-for="item in classesOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-input v-model="form.title" placeholder="请输入作业标题" clearable @keyup.enter.native="searchData"></el-input>
                </el-col>
            </template>
            <template slot="button">
                <el-button type="primary" icon="el-icon-search" @click="searchData">搜索</el-button>
                <el-button icon="el-icon-refresh" @click="resetForm">重置</el-button>
            </template>
            <template slot="rightButton">
                <el-button type="warning" icon="iconfont iconfabu" @click="openAddDialog">发布</el-button>
            </template>
        </search-box>
        <div class="container" v-loading="tableLoading">
            <vxe-table stripe highlight-hover-row size="medium" :data="tableData" show-header-overflow show-overflow :max-height="tableMaxHeight">
                <vxe-table-column field="title" title="作业标题"></vxe-table-column>
                <vxe-table-column title="结束时间">
                    <template slot-scope="scope">{{ scope.row.deadline | formatDate('yyyy-MM-dd hh:mm') }}</template>
                </vxe-table-column>
                <vxe-table-column fixed="right" title="操作" width="150">
                    <template slot-scope="scope">
                        <div class="operation-icon">
                            <template v-if="form.endStatus === 'unFinished'">
                                <el-button type="text" @click="viewData(scope.row)">查看</el-button>
                                <el-button type="text" @click="handleEditWork(scope.row)">编辑</el-button>
                                <el-button type="text" @click="remove(scope.row)">删除</el-button>
                            </template>
                            <template v-else>
                                <el-button type="text" @click="homeworkCorrecting(scope.row)">批改作业</el-button>
                            </template>
                        </div>
                    </template>
                </vxe-table-column>
            </vxe-table>
            <pagniation :currentPage="form.current" :totalPage="totalPage" :totalNum="totalNum" @changePage="handleChangePage"></pagniation>
        </div>
        <el-dialog :title="addDialogTitle" :visible.sync="addWokDialogVisible" @close="closeAddDialog" :close-on-click-modal="false" width="780px">
            <p class="course-name">班级名称&nbsp;{{ curClassName }}</p>
            <el-form
                ref="addHomeWorkForm"
                class="dialog-form-box"
                v-if="dialogType !== 'view'"
                :model="addHomeWorkForm"
                :rules="addWorkRules"
                label-width="85px"
            >
                <el-form-item label="作业标题" prop="title">
                    <el-input v-model.trim="addHomeWorkForm.title" placeholder="请输入作业标题"></el-input>
                </el-form-item>
                <el-form-item label="结束时间" prop="time">
                    <el-date-picker v-model.number="addHomeWorkForm.deadline" type="datetime" style="width: 100%;" value-format="timestamp">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="作业内容" prop="content">
                    <tinymce v-model.trim="addHomeWorkForm.content" :height="250" />
                </el-form-item>
            </el-form>
            <ul class="dialog-form-view" v-else>
                <li class="item">
                    <div class="label">作业标题</div>
                    <div class="content">{{ viewForm.title }}</div>
                </li>
                <li class="item">
                    <div class="label">结束时间</div>
                    <div class="content">{{ viewForm.deadline | formatDate('yyyy-MM-dd hh:mm') }}</div>
                </li>
                <li class="item">
                    <div class="label">作业内容</div>
                    <div class="content" v-html="viewForm.content"></div>
                </li>
                <li class="item">
                    <div class="label">发布人</div>
                    <div class="content">{{ viewForm.publisherName }}</div>
                </li>
                <li class="item">
                    <div class="label">创建时间</div>
                    <div class="content">{{ viewForm.createDate | formatDate('yyyy-MM-dd hh:mm') }}</div>
                </li>
            </ul>
            <span slot="footer" class="dialog-footer">
                <template v-if="dialogType !== 'view'">
                    <el-button @click="addWokDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveData">确 定</el-button>
                </template>
                <template v-else><el-button @click="addWokDialogVisible = false">关 闭</el-button></template>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import Tinymce from '@/components/Tinymce';
export default {
    data() {
        return {
            form: {
                endStatus: 'unFinished',
                classesId: '',
                title: '',
                pageSize: 30,
                current: 0
            },
            tableData: [],
            curCheckId: null,
            tableLoading: false,
            addHomeWorkForm: {
                title: '',
                deadline: '',
                content: ''
            },
            viewForm: {},
            dialogType: 'add',
            totalPage: 0,
            totalNum: 0,
            addWokDialogVisible: false,
            addWorkRules: {
                title: { required: true, message: '请输入作业标题', trigger: 'blur' },
                deadline: { required: true, message: '请选择结束时间', trigger: 'change' },
                content: { required: true, message: '请输入作业内容', trigger: 'blur' }
            }
        };
    },
    components: { Tinymce },
    computed: {
        addDialogTitle() {
            return this.dialogType === 'add' ? '发布' : this.dialogType === 'edit' ? '编辑' : '查看';
        },
        // 当前显示的班级名称
        curClassName() {
            const data = this.classesOptions.find(item => item.id === this.form.classesId);
            return data ? data.name : '';
        },
        classesOptions() {
            return this.$store.state.Common.classesData;
        }
    },
    async created() {
        await this.setFirstClassId();
        this.getData();
    },
    methods: {
        // 默认选中第一项
        async setFirstClassId() {
            if (!this.classesOptions.length) {
                await this.getAllClassesData();
            }
            const first = this.classesOptions[0];
            this.form.classesId = first ? first.id : '';
        },
        async getAllClassesData() {
            await this.$http.classesService.getAllClasses().then(res => {
                this.$store.commit({
                    type: 'setClassesData',
                    val: res.data
                });
            });
        },
        searchData() {
            this.form.current = 0;
            this.getData();
        },
        getData() {
            this.tableLoading = true;
            const params = Object.assign({}, this.form);
            params.ended = params.endStatus !== 'unFinished';
            delete params.endStatus;
            this.$http.homeWorkService
                .getHomeWorkList(params)
                .then(res => {
                    this.totalPage = res.data.totalPages;
                    this.totalNum = res.data.totalElements;
                    this.tableData = res.data.content;
                })
                .finally(() => {
                    this.tableLoading = false;
                });
        },
        remove({ id }) {
            this.$http.homeWorkService.removehomeWork(id).then(res => {
                this.$confirm('此操作将删除该作业, 是否继续?', '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getData();
                    })
                    .catch(() => {});
            });
        },
        // 批改作业
        homeworkCorrecting({ id, title }) {
            this.$router.push({
                path: '/homework-correcting/' + id,
                query: {
                    title: title
                }
            });
        },
        resetForm() {
            this.form = {
                endStatus: this.form.endStatus,
                classesId: this.form.classesId,
                title: '',
                pageSize: this.form.pageSize,
                current: 0
            };
            this.getData();
        },
        getClassesById() {
            return this.classesOptions.find(item => item.id === this.form.classesId);
        },
        // 新增/编辑作业
        saveData() {
            this.$refs['addHomeWorkForm'].validate(valid => {
                if (valid) {
                    const params = Object.assign({}, this.addHomeWorkForm);
                    this.dialogLoading = true;
                    if (this.dialogType === 'add') {
                        const { id, name } = this.getClassesById();
                        params.classesId = id;
                        params.classesName = name;
                        this.$http.homeWorkService
                            .createhomeWork(params)
                            .then(res => {
                                this.closeAddDialog();
                                this.$message({
                                    type: 'success',
                                    message: '作业添加成功'
                                });
                                this.getData();
                            })
                            .finally(() => {
                                this.dialogLoading = false;
                            });
                    } else {
                        params.id = this.curCheckId;
                        params.classesId = this.form.classesId;
                        this.dialogLoading = true;
                        this.$http.homeWorkService
                            .updatehomeWork(params)
                            .then(res => {
                                this.getData();
                                this.closeAddDialog();
                                this.$message({
                                    type: 'success',
                                    message: '作业修改成功'
                                });
                            })
                            .finally(() => {
                                this.dialogLoading = false;
                            });
                    }
                }
            });
        },
        handleEditWork(row) {
            this.splitData(row, 'edit');
            this.curCheckId = row.id;
        },
        splitData({ content, title, deadline }, opeartionType = 'edit') {
            this.addHomeWorkForm = {
                content,
                title,
                deadline
            };
            this.dialogType = opeartionType;
            this.addWokDialogVisible = true;
        },
        openAddDialog() {
            if (!this.form.classesId) {
                this.$message.error('请先选择班级!');
                return;
            }
            this.addWokDialogVisible = true;
            this.dialogType = 'add';
        },
        viewData(row) {
            this.viewForm = row;
            this.dialogType = 'view';
            this.addWokDialogVisible = true;
        },
        closeAddDialog() {
            this.addWokDialogVisible = false;
            this.resetcourseForm();
        },
        closeUploadDialog() {
            this.uploadForm = { annexName: '', url: '' };
            this.$refs.uploadForm.resetFields();
        },
        resetcourseForm() {
            this.addHomeWorkForm = {
                title: '',
                deadline: '',
                content: ''
            };
            const addHomeWorkForm = this.$refs.addHomeWorkForm;
            addHomeWorkForm && addHomeWorkForm.resetFields();
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
.course-name {
    color: #333;
    font-family: Microsoft YaHei;
    font-weight: bold;
}
.icon .iconshi,
.icon .iconfou {
    font-size: 12px;
}
</style>
