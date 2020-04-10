<template>
    <div>
        <search-box :form="form">
            <template slot="input">
                <el-col :span="5">
                    <el-form-item>
                        <el-select v-model="form.classesId" style="width: 100%;" placeholder="班级名称" @change="searchData" filterable>
                            <el-option v-for="item in classesOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-input v-model="form.name" placeholder="请输入资源名称" @keyup.enter.native="searchData"></el-input>
                </el-col>
            </template>
            <template slot="button">
                <el-button type="primary" icon="el-icon-search" @click="searchData">搜索</el-button>
                <el-button icon="el-icon-refresh" @click="resetForm">重置</el-button>
            </template>
            <template slot="rightButton">
                <el-button type="warning" icon="iconfont el-icon-plus" @click="openAddDialog">新增</el-button>
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
                <vxe-table-column field="name" title="资源名称">
                    <template slot-scope="scope">
                        <span class="resources-name">{{ scope.row.name }}</span>
                    </template>
                </vxe-table-column>
                <vxe-table-column field="name" title="上传人" width="200"> </vxe-table-column>
                <vxe-table-column title="上传时间" width="200">
                    <template slot-scope="scope">{{ scope.row.createDate | formatDate('yyyy-MM-dd hh:mm') }}</template>
                </vxe-table-column>
                <vxe-table-column fixed="right" title="操作" width="100">
                    <template slot-scope="scope">
                        <div class="operation-icon">
                            <el-button type="text" @click="viewData(scope.row)">查看</el-button>
                            <el-button type="text" @click="handleEditWork(scope.row)">编辑</el-button>
                        </div>
                    </template>
                </vxe-table-column>
            </vxe-table>
            <pagniation :currentPage="form.current" :totalPage="totalPage" :totalNum="totalNum" @changePage="handleChangePage"></pagniation>
        </div>
        <el-dialog
            :title="addDialogTitle"
            :visible.sync="addTopicDialogVisible"
            @close="closeAddDialog"
            :close-on-click-modal="false"
            width="600px"
        >
            <p class="classes-name">班级名称&nbsp;{{ curClassName }}</p>
            <el-form
                ref="rescoucesForm"
                class="dialog-form-box"
                v-if="dialogType !== 'view'"
                :model="rescoucesForm"
                :rules="addTopicRules"
                label-width="85px"
            >
                <el-form-item label="资源名称" prop="name">
                    <el-input v-model.trim="rescoucesForm.name" placeholder="请输入资源名称"></el-input>
                </el-form-item>
                <el-form-item label="下载地址" prop="url" required>
                    <el-upload
                        class="upload-demo"
                        drag
                        :action="action"
                        :before-upload="beforeUpload"
                        :file-list="fileList"
                        :limit="1"
                        :on-success="uploadSuccess"
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过10M</div> -->
                    </el-upload>
                </el-form-item>
            </el-form>
            <ul class="dialog-form-view" v-else>
                <li class="item">
                    <div class="label">资源名称</div>
                    <div class="content">{{ rescoucesForm.name }}</div>
                </li>
                <li class="item">
                    <div class="label">下载地址</div>
                    <div class="content">{{ rescoucesForm.url }}</div>
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
import environment from '@/environmental/index.js';
export default {
    data() {
        return {
            form: {
                classesId: '',
                name: '',
                pageSize: 30,
                current: 0,
            },
            fileList: [],
            action: environment.env().url + 'file',
            tableData: [],
            curCheckId: null,
            tableLoading: false,
            rescoucesForm: {
                name: '',
                url:''
            },
            dialogType: 'add',
            totalPage: 0,
            totalNum: 0,
            addTopicDialogVisible: false,
            addTopicRules: {
                name: { required: true, message: '请输入资源名称', trigger: 'blur' },
                url: { required: true, message: '请上传资源文件', trigger: 'change' },
            }
        };
    },
    computed: {
        addDialogTitle() {
            return this.dialogType === 'add' ? '新增' : this.dialogType === 'edit' ? '编辑' : '查看';
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
            this.$http.courseService
                .getAllCourses(this.form)
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
            this.$http.courseService.deleteCourse(id).then(res => {
                this.$message({
                    message: '删除成功',
                    type: 'success'
                });
                this.getData();
            });
        },
        // 打分
        handleScoring() {
            this.$router.push('/');
        },
        beforeUpload() {},
        uploadSuccess(response, file, fileList) {
            this.rescoucesForm.url = response.data
        },
        resetForm() {
            this.form = {
                classesId: this.form.classesId,
                name: '',
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
            this.$refs['rescoucesForm'].validate(valid => {
                if (valid) {
                    const params = Object.assign({}, this.rescoucesForm);
                    params.startDate = params.time[0];
                    params.endDate = params.time[1];
                    this.dialogLoading = true;
                    if (this.dialogType === 'add') {
                        const { id, name } = this.getClassesById();
                        params.classesId = id;
                        params.classesName = name;
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
                        params.id = this.curCheckId;
                        this.dialogLoading = true;
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
                }
            });
        },
        handleEditWork(row) {
            this.splitData(row, 'edit');
            this.curCheckId = row.id;
        },
        splitData({ name, url }, opeartionType = 'edit') {
            this.rescoucesForm = {
                name,
                url,
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
            this.splitData(row, 'view');
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
            this.rescoucesForm = {
                name: '',
                url:''
            };
            const rescoucesForm = this.$refs.rescoucesForm;
            rescoucesForm && rescoucesForm.resetFields();
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
.resources-name {
    color: #2693ff;
}
</style>
