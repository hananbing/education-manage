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
                    <el-input v-model="form.title" placeholder="请输入话题标题" @keyup.enter.native="searchData"></el-input>
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
                <vxe-table-column field="title" title="话题标题"></vxe-table-column>
                <vxe-table-column field="publisherName" title="发布人"> </vxe-table-column>
                <vxe-table-column field="replyNumber" title="回复数"></vxe-table-column>
                <vxe-table-column title="创建时间">
                    <template slot-scope="scope">{{ scope.row.createDate | formatDate('yyyy-MM-dd hh:mm') }}</template>
                </vxe-table-column>
                <vxe-table-column fixed="right" title="操作" width="140">
                    <template slot-scope="scope">
                        <div class="operation-icon">
                            <el-button type="text" @click="viewData(scope.row)">查看</el-button>
                            <template v-if="form.endStatus == 'unFinished'">
                                <el-button type="text" @click="handleEditWork(scope.row)">编辑</el-button>
                                <el-button type="text" @click="remove(scope.row)">删除</el-button>
                            </template>
                            <template v-else>
                                <el-button type="text" @click="handleScoring(scope.row)">打分</el-button>
                            </template>
                        </div>
                    </template>
                </vxe-table-column>
            </vxe-table>
            <pagniation :currentPage="form.current" :totalPage="totalPage" :totalNum="totalNum" @changePage="handleChangePage"></pagniation>
        </div>
        <el-dialog :title="addDialogTitle" :visible.sync="addTopicDialogVisible" @close="closeAddDialog" :close-on-click-modal="false" width="600px">
            <p class="classes-name">班级名称&nbsp;{{ curClassName }}</p>
            <el-form
                ref="topicForm"
                class="dialog-form-box"
                v-if="dialogType !== 'view'"
                :model="topicForm"
                :rules="addTopicRules"
                label-width="85px"
            >
                <el-form-item label="话题标题" prop="title">
                    <el-input v-model.trim="topicForm.title" placeholder="请输入话题标题"></el-input>
                </el-form-item>
                <el-form-item label="话题内容" prop="topicContent">
                    <el-input v-model.trim="topicForm.topicContent" placeholder="请输入话题内容"></el-input>
                </el-form-item>
                <el-form-item label="结束时间" prop="deadline">
                    <el-date-picker
                        v-model.number="topicForm.deadline"
                        type="datetime"
                        placeholder="请选择结束时间"
                        style="width: 100%;"
                        value-format="timestamp"
                    >
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <ul class="dialog-form-view" v-else>
                <li class="item">
                    <div class="label">话题标题</div>
                    <div class="content">{{ viewForm.title }}</div>
                </li>
                <li class="item">
                    <div class="label">话题内容</div>
                    <div class="content">{{ viewForm.topicContent }}</div>
                </li>
                <li class="item">
                    <div class="label">发布人</div>
                    <div class="content">{{ viewForm.publisherName }}</div>
                </li>
                <li class="item">
                    <div class="label">结束时间</div>
                    <div class="content">{{ viewForm.deadline | formatDate('yyyy-MM-dd hh:mm') }}</div>
                </li>

                <li class="item">
                    <div class="label">创建时间</div>
                    <div class="content">{{ viewForm.createDate | formatDate('yyyy-MM-dd hh:mm') }}</div>
                </li>
            </ul>
            <span slot="footer" class="dialog-footer">
                <template v-if="dialogType !== 'view'">
                    <el-button @click="addTopicDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveData">确 定</el-button>
                </template>
                <template v-else><el-button @click="addTopicDialogVisible = false">关 闭</el-button></template>
            </span>
        </el-dialog>
    </div>
</template>
<script>
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
            topicForm: {
                title: '',
                deadline: '',
                topicContent: ''
            },
            viewForm: {},
            dialogType: 'add',
            totalPage: 0,
            totalNum: 0,
            addTopicDialogVisible: false,
            addTopicRules: {
                title: { required: true, message: '请输入话题标题', trigger: 'blur' },
                deadline: { required: true, message: '请选择结束时间', trigger: 'change' },
                topicContent: { required: true, message: '请输入话题内容', trigger: 'blur' }
            }
        };
    },
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
            params.ended = this.form.endStatus !== 'unFinished';
            delete params.endStatus;
            this.$http.topiceService
                .getTopiceList(params)
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
            this.$http.topiceService.removeTopice(id).then(res => {
                this.$message({
                    message: '删除成功',
                    type: 'success'
                });
                this.getData();
            });
        },
        // 打分
        handleScoring({ id, title }) {
            this.$router.push({
                path: '/topic-details/' + id,
                query: {
                    title
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
        // 新增/编辑班级
        saveData() {
            this.$refs['topicForm'].validate(valid => {
                if (valid) {
                    const params = Object.assign({}, this.topicForm);
                    this.dialogLoading = true;
                    if (this.dialogType === 'add') {
                        const { id, name } = this.getClassesById();
                        params.classesId = id;
                        params.classesName = name;
                        this.$http.topiceService
                            .addTopice(params)
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
                        params.id = this.curCheckId;
                        this.dialogLoading = true;
                        this.$http.topiceService
                            .editTopice(params)
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
                }
            });
        },
        handleEditWork(row) {
            this.splitData(row, 'edit');
            this.curCheckId = row.id;
        },
        splitData({ title, topicContent, deadline }, opeartionType = 'edit') {
            this.topicForm = {
                title,
                topicContent,
                deadline
            };
            this.dialogType = opeartionType;
            this.addTopicDialogVisible = true;
        },
        openAddDialog() {
            if (!this.form.classesId) {
                this.$message.error('请先选择班级!');
                return;
            }
            this.addTopicDialogVisible = true;
            this.dialogType = 'add';
        },
        viewData(row) {
            this.viewForm = row;
            this.dialogType = 'view';
            this.addTopicDialogVisible = true;
        },
        closeAddDialog() {
            this.addTopicDialogVisible = false;
            this.resetcourseForm();
        },
        closeUploadDialog() {
            this.uploadForm = { annexName: '', url: '' };
            this.$refs.uploadForm.resetFields();
        },
        resetcourseForm() {
            this.topicForm = {
                title: '',
                topicContent: '',
                deadline: ''
            };
            const topicForm = this.$refs.topicForm;
            topicForm && topicForm.resetFields();
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
