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
                <el-col :span="3">
                    <el-input v-model="form.name" placeholder="请输入课程名称" @keyup.enter.native="searchData"></el-input>
                </el-col>
                <el-col :span="3">
                    <el-form-item>
                        <el-select v-model="form.type" style="width: 100%;" placeholder="课程类型" @change="searchData" clearable>
                            <el-option v-for="(value, key) in courseOptions" :key="key" :label="value" :value="key"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </template>
            <template slot="button">
                <el-button type="primary" icon="el-icon-search" @click="searchData">搜索</el-button>
                <el-button icon="el-icon-refresh" @click="resetForm">重置</el-button>
            </template>
            <template slot="rightButton">
                <el-button type="warning" icon="el-icon-plus" @click="openAddDialog">新增</el-button>
            </template>
        </search-box>
        <div class="container" v-loading="tableLoading">
            <vxe-table
                stripe
                highlight-hover-row
                size="medium"
                ref="courseTable"
                show-header-overflow
                show-overflow
                :max-height="tableMaxHeight"
            >
                <vxe-table-column field="name" title="课程名称"></vxe-table-column>
                <vxe-table-column title="课程类型" width="110">
                    <template slot-scope="scope">{{ courseOptions[scope.row.type] }}</template>
                </vxe-table-column>
                <vxe-table-column title="开始时间">
                    <template slot-scope="scope">{{ scope.row.startDate | formatDate('yyyy-MM-dd hh:mm') }}</template>
                </vxe-table-column>
                <vxe-table-column title="结束时间">
                    <template slot-scope="scope">{{ scope.row.endDate | formatDate('yyyy-MM-dd hh:mm') }}</template>
                </vxe-table-column>
                <vxe-table-column field="teacherName" title="授课老师名称"></vxe-table-column>
                <vxe-table-column field="score" title="评分" width="100"></vxe-table-column>
                <vxe-table-column title="是否加链接" align="center">
                    <template v-slot="{ row }">
                        <div class="icon">
                            <i class="iconfont iconshi" v-if="row.url"></i>
                            <i class="iconfont iconfou" v-else></i>
                        </div>
                    </template>
                </vxe-table-column>
                <vxe-table-column fixed="right" title="操作" width="230">
                    <template slot-scope="scope">
                        <div class="operation-icon">
                            <el-button type="text" @click="viewData(scope.row)">查看</el-button>
                            <!-- <template v-if="form.endStatus === 'finished'"> -->
                            <el-button type="text" @click="handleScoring(scope.row)">打分</el-button>
                            <!-- </template> -->
                            <!-- <template v-else> -->
                            <el-button type="text" @click="handleEditcourse(scope.row)">编辑</el-button>
                            <el-button type="text" @click="remove(scope.row)">删除</el-button>
                            <el-button type="text" @click="addLink(scope.row)">{{
                                scope.row.type === 'LIVE' ? '添加链接' : '上传附件'
                            }}</el-button>
                            <!-- <el-button type="text" @click="upload(scope.row)" v-if="scope.row.type === 'OFFICE'">上传附件</el-button> -->
                            <!-- </template> -->
                        </div>
                    </template>
                </vxe-table-column>
            </vxe-table>
            <pagniation :currentPage="form.current" :totalPage="totalPage" :totalNum="totalNum" @changePage="handleChangePage"></pagniation>
        </div>
        <el-dialog
            :title="addDialogTitle"
            :visible.sync="addCoursedialogVisible"
            @close="closeAddDialog"
            :close-on-click-modal="false"
            width="520px"
        >
            <p class="course-name">班级名称&nbsp;{{ curClassName }}</p>
            <el-form
                ref="addCourseForm"
                class="dialog-form-box"
                v-if="courseDialogType !== 'view'"
                :model="addCourseForm"
                :rules="addcourseRules"
                label-width="115px"
            >
                <el-form-item label="课程名称" prop="name">
                    <el-input v-model="addCourseForm.name" placeholder="请输入课程名称"></el-input>
                </el-form-item>
                <el-form-item label="课程类型" prop="type">
                    <el-select v-model="addCourseForm.type" style="width: 100%;" placeholder="请选择课程类型">
                        <el-option v-for="(value, key) in courseOptions" :key="key" :label="value" :value="key"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="授课时间" prop="time">
                    <el-date-picker
                        v-model="addCourseForm.time"
                        type="datetimerange"
                        range-separator="-"
                        start-placeholder="开始时间"
                        end-placeholder="开始时间"
                        style="width: 100%;"
                        value-format="timestamp"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="授课老师名称" prop="teacherName">
                    <el-input v-model="addCourseForm.teacherName" placeholder="请输入授课老师名称"></el-input>
                </el-form-item>
            </el-form>
            <ul class="dialog-form-view" v-else>
                <li class="item">
                    <div class="label">课程名称</div>
                    <div class="content">{{ addCourseForm.name }}</div>
                </li>
                <li class="item">
                    <div class="label">课程类型</div>
                    <div class="content">{{ courseOptions[addCourseForm.type] }}</div>
                </li>
                <li class="item">
                    <div class="label">开始时间</div>
                    <div class="content">{{ addCourseForm.time[0] | formatDate('yyyy-MM-dd hh:mm') }}</div>
                </li>
                <li class="item">
                    <div class="label">结束时间</div>
                    <div class="content">{{ addCourseForm.time[1] | formatDate('yyyy-MM-dd hh:mm:ss') }}</div>
                </li>
                <li class="item">
                    <div class="label">授课老师名称</div>
                    <div class="content">{{ addCourseForm.teacherName }}</div>
                </li>
            </ul>
            <span slot="footer" class="dialog-footer">
                <template v-if="courseDialogType !== 'view'">
                    <el-button @click="addCoursedialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveData">确 定</el-button>
                </template>
                <template v-else><el-button @click="addCoursedialogVisible = false">关 闭</el-button></template>
            </span>
        </el-dialog>
        <!-- 上传附件/视频/链接 -->
        <el-dialog
            :title="uploadDialogTitle"
            :visible.sync="uploadDialogVisible"
            @close="closeUploadDialog"
            :close-on-click-modal="false"
            width="450px"
        >
            <p class="course-name">课程名称&nbsp;{{ curCourseName }}</p>
            <el-form ref="uploadForm" class="dialog-form-box" :model="uploadForm" :rules="uploadRules" label-width="85px">
                <template v-if="uploadDialogType === 'LIVE'">
                    <el-form-item label="链接地址" prop="url" key="1" required>
                        <el-input v-model="uploadForm.url" placeholder="请输入链接地址" clearable></el-input>
                    </el-form-item>
                </template>
                <template v-else>
                    <el-form-item label="附件名称" prop="annexName">
                        <el-input v-model="uploadForm.annexName" placeholder="请输入附件名称" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="播放地址" prop="url" v-if="uploadDialogType === 'VIDEO'" key="2">
                        <el-input v-model="uploadForm.url" placeholder="请输入播放地址"></el-input>
                    </el-form-item>
                    <el-form-item label="上传文件" prop="url" required v-else>
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
                            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过10M</div>
                        </el-upload>
                    </el-form-item>
                </template>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="uploadDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="uploadData">确 定</el-button>
            </span>
        </el-dialog>
        <scoring-component ref="scoring" />
    </div>
</template>
<script>
import environment from '@/environmental/index.js';
import scoringComponent from './components/scoringComponent.vue';
export default {
    data() {
        var validateUrl = (rule, value, callback) => {
            if (!value) {
                const mesg = this.uploadDialogType === 'VIDEO' ? '请输入视频地址' : '请上传附件';
                callback(new Error(mesg));
            } else {
                callback();
            }
        };
        return {
            form: {
                endStatus: 'unFinished',
                classesId: '',
                name: '',
                pageSize: 30,
                current: 0,
                type: ''
            },
            tableData: [],
            curCheckId: null,
            courseOptions: Object.freeze({ LIVE: '直播', VIDEO: '视频', OFFICE: 'office文件' }), // 课程类型
            tableLoading: false,
            addCourseForm: {
                name: '',
                type: '',
                time: [],
                teacherName: ''
            },
            uploadForm: { annexName: '', url: '' },
            uploadRules: {
                annexName: { required: true, message: '请输入附件名称', trigger: 'blur' },
                url: { validator: validateUrl, trigger: 'blur' }
            },
            fileList: [], // 文件上传列表
            uploadDialogType: 'LIVE',
            courseDialogType: 'add',
            totalPage: 0,
            totalNum: 0,
            addCoursedialogVisible: false,
            uploadDialogVisible: false,
            addcourseRules: {
                name: { required: true, message: '请输入课程名称', trigger: 'blur' },
                type: { required: true, message: '请选择课程类型', trigger: 'change' },
                time: { required: true, message: '请选择课程时间', trigger: 'change' },
                teacherName: { required: true, message: '请输入老师名称', trigger: 'blur' }
            },
            action: environment.env().url + 'file'
        };
    },
    components: { scoringComponent },
    computed: {
        addDialogTitle() {
            return this.courseDialogType === 'add' ? '新增' : this.courseDialogType === 'edit' ? '编辑' : '查看';
        },
        uploadDialogTitle() {
            return this.uploadDialogType === 'LIVE' ? '上传链接' : '上传附件';
        },
        // 当前显示的班级名称
        curClassName() {
            const data = this.classesOptions.find(item => item.id === this.form.classesId);
            return data ? data.name : '';
        },
        classesOptions() {
            return this.$store.state.Common.classesData;
        },
        curCourseName() {
            return (this.tableData.find(item => item.id === this.curCheckId) || {}).name;
        }
    },
    async created() {
        this.tableLoading = true;
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
            params.endStatus = params.endStatus !== 'unFinished';
            this.$http.courseService
                .getAllCourses(params)
                .then(res => {
                    this.$refs.courseTable.loadData(res.data.content);
                    this.totalPage = res.data.totalPages;
                    this.totalNum = res.data.totalElements;
                    this.tableData = Object.freeze(res.data.content);
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
        addLink({ id, annexName, url, type }) {
            this.uploadForm = {
                annexName,
                url
            };
            this.uploadDialogType = type;
            this.uploadDialogVisible = true;
            this.curCheckId = id;
        },
        upload({ id, annexName, url, type }) {
            this.uploadForm = {
                annexName,
                url
            };
            this.uploadDialogType = type;
            this.uploadDialogVisible = true;
            this.curCheckId = id;
        },
        handleScoring({ id, name }) {
            this.$refs.scoring.openDialog(id, name);
        },
        resetForm() {
            this.form = {
                endStatus: this.form.endStatus,
                classesId: this.form.classesId,
                name: '',
                pageSize: this.form.pageSize,
                current: 0,
                type: ''
            };
            this.getData();
        },
        openAddDialog() {
            if (!this.form.classesId) {
                this.$message.error('请先选择班级!');
                return;
            }
            this.addCoursedialogVisible = true;
        },
        getClassesById() {
            return this.classesOptions.find(item => item.id === this.form.classesId);
        },
        // 新增/编辑班级
        saveData() {
            this.$refs['addCourseForm'].validate(valid => {
                if (valid) {
                    const params = Object.assign({}, this.addCourseForm);
                    params.startDate = params.time[0];
                    params.endDate = params.time[1];
                    this.dialogLoading = true;
                    if (this.courseDialogType === 'add') {
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
        // 上传附件/视频/链接
        uploadData() {
            this.$refs['uploadForm'].validate(valid => {
                if (valid) {
                    this.dialogLoading = true;
                    // const row = this.tableData.find(item => item.id === this.curCheckId);
                    const params = Object.assign({ id: this.curCheckId }, this.uploadForm);
                    this.$http.courseService
                        .updateCourseAnnex(params)
                        .then(res => {
                            this.getData();
                            this.$message({
                                type: 'success',
                                message: '上传成功'
                            });
                            this.uploadDialogVisible = false;
                        })
                        .finally(() => {
                            this.dialogLoading = false;
                        });
                }
            });
        },
        beforeUpload() {},
        uploadSuccess(response, file, fileList) {
            console.log(response, file, fileList);
        },
        handleEditcourse(row) {
            this.splitData(row, 'edit');
            this.curCheckId = row.id;
        },
        splitData({ name, type, teacherName, startDate, endDate }, opeartionType = 'edit') {
            this.addCourseForm = {
                name,
                type,
                time: [startDate, endDate],
                teacherName
            };
            this.courseDialogType = opeartionType;
            this.addCoursedialogVisible = true;
        },
        viewData(row) {
            this.splitData(row, 'view');
        },
        closeAddDialog() {
            this.addCoursedialogVisible = false;
            this.resetcourseForm();
        },
        closeUploadDialog() {
            this.uploadForm = { annexName: '', url: '' };
            this.$refs.uploadForm.resetFields();
        },
        resetcourseForm() {
            this.addCourseForm = {
                name: '',
                type: '',
                time: [],
                teacherName: ''
            };
            const addCourseForm = this.$refs.addCourseForm;
            addCourseForm && addCourseForm.resetFields();
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
