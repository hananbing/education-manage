<template>
    <div>
        <search-box :form="form">
            <template slot="tabs">
                <el-tabs v-model="form.type" @tab-click="searchData">
                    <el-tab-pane label="未结束" name="unFinished"></el-tab-pane>
                    <el-tab-pane label="已结束" name="finished"></el-tab-pane>
                </el-tabs>
            </template>
            <template slot="input">
                <el-col :span="5">
                    <el-form-item>
                        <el-select v-model="form.name" style="width:100%" placeholder="班级名称" @change="searchData">
                            <el-option label="全部" value="ALL"></el-option>
                            <el-option v-for="(value, key) in classesOptions" :key="key" :label="value" :value="key"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="3">
                    <el-input v-model="form.courseName" placeholder="请输入课程名称"></el-input>
                </el-col>
                <el-col :span="3">
                    <el-form-item>
                        <el-select v-model="form.expertFirstName" style="width:100%" placeholder="课程类型" @change="searchData">
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
        <div class="container">
            <vxe-table border stripe highlight-hover-row size="medium" :loading="tableLoading" ref="courseTable">
                <vxe-table-column field="name" title="课程名称"></vxe-table-column>
                <vxe-table-column title="课程类型" width="110">
                    <template slot-scope="scope">{{ courseOptions[scope.row.type] }}</template>
                </vxe-table-column>
                <vxe-table-column title="开始时间">
                    <template slot-scope="scope">{{ Number(scope.row.startDate) | formatDate('yyyy-MM-dd mm:ss') }}</template>
                </vxe-table-column>
                <vxe-table-column title="结束时间">
                    <template slot-scope="scope">{{ Number(scope.row.endDate) | formatDate('yyyy-MM-dd mm:ss') }}</template>
                </vxe-table-column>
                <vxe-table-column field="teacherName" title="授课老师名称"></vxe-table-column>
                <vxe-table-column field="score" title="评分"></vxe-table-column>
                <vxe-table-column title="是否加链接">
                    <template></template>
                </vxe-table-column>
                <vxe-table-column fixed="right" title="操作" width="220">
                    <template slot-scope="scope">
                        <div class="operation-icon">
                            <el-button type="text" @click="viewData(scope.row)">查看</el-button>
                            <el-button type="text" @click="handleScoring(scope.row)" v-if="form.type === 'finished'">打分</el-button>
                            <el-button type="text" @click="handleEditcourse(scope.row)">编辑</el-button>
                            <el-button type="text" @click="remove(scope.row)">删除</el-button>
                            <el-button type="text" @click="addLink(scope.row)" v-if="scope.row.type === 'LIVE'">添加链接</el-button>
                            <el-button type="text" @click="upload(scope.row)" v-if="scope.row.type === 'OFFICE'">上传附件</el-button>
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
            width="500px"
        >
            <p class="course-name">班级名称</p>
            <el-form
                ref="addCourseForm"
                class="dialog-form-box"
                v-if="courseDialogType !== 'view'"
                :model="addCourseForm"
                :rules="addcourseRules"
                label-width="105px"
            >
                <el-form-item label="课程名称" prop="name">
                    <el-input v-model="addCourseForm.name" placeholder="请输入课程名称"></el-input>
                </el-form-item>
                <el-form-item label="课程类型" prop="type">
                    <el-select v-model="addCourseForm.type" style="width:100%" placeholder="请选择课程类型">
                        <el-option v-for="(value, key) in courseOptions" :key="key" :label="value" :value="key"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="授课时间" prop="time">
                    <el-date-picker
                        v-model="addCourseForm.time"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="开始时间"
                        end-placeholder="开始时间"
                        style="width:100%"
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
                    <div class="content">{{ addCourseForm.time[0] | formatDate('yyyy-MM-dd mm:ss') }}</div>
                </li>
                <li class="item">
                    <div class="label">结束时间</div>
                    <div class="content">{{ addCourseForm.time[1] | formatDate('yyyy-MM-dd mm:ss') }}</div>
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
            <p class="course-name">班级名称</p>
            <el-form ref="uploadForm" class="dialog-form-box" :model="uploadForm" :rules="uploadRules" label-width="105px">
                <template v-if="uploadDialogType === 'LIVE'">
                    <el-form-item label="链接地址" prop="url">
                        <el-input v-model="uploadForm.url" placeholder="请输入链接地址"></el-input>
                    </el-form-item>
                </template>
                <template v-else>
                    <el-form-item label="附件名称" prop="annexName">
                        <el-input v-model="uploadForm.annexName" placeholder="请输入附件名称"></el-input>
                    </el-form-item>
                    <el-form-item label="播放地址" prop="url" v-if="uploadDialogType === 'VIDEO'">
                        <el-input v-model="uploadForm.url" placeholder="请输入播放地址"></el-input>
                    </el-form-item>
                    <el-form-item label="上传文件" prop="url" required v-else>
                        <el-upload class="upload-demo" drag :action="action" multiple>
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
    </div>
</template>
<script>
import environment from '@/environmental/index.js';
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
                name: '',
                courseName: '',
                pageSize: 30,
                current: 0,
                type: 'unFinished'
            },
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
                url: { validator: validateUrl }
            },
            uploadDialogType: 'LIVE',
            courseDialogType: 'add',
            totalPage: 0,
            totalNum: 0,
            addCoursedialogVisible: false,
            uploadDialogVisible: false,
            addcourseRules: {},
            classesOptions: [], // 班级列表
            action: environment.env().url + 'file'
        };
    },
    computed: {
        addDialogTitle() {
            return this.courseDialogType === 'add' ? '新增' : this.courseDialogType === 'edit' ? '编辑' : '查看';
        },
        uploadDialogTitle() {
            return this.uploadDialogType === 'LIVE' ? '上传链接' : '上传附件';
        }
    },
    mounted() {
        this.getData();
    },
    methods: {
        searchData() {
            this.form.current = 0;
            this.getData();
        },
        getData() {
            this.$refs.courseTable.loadData([
                { name: 121, expertFirstName: 13213131, instructorFirstName: 2423423424 },
                { name: 121, expertFirstName: 13213131, instructorFirstName: 2423423424 }
            ]);
        },
        remove({ id }) {},
        addLink({ id, annexName, url, type }) {
            this.uploadForm = {
                annexName,
                url
            };
            this.uploadDialogType = type;
            this.uploadDialogVisible = true;
        },
        upload({ id, annexName, url, type }) {
            this.uploadForm = {
                annexName,
                url
            };
            this.uploadDialogType = type;
            this.uploadDialogVisible = true;
        },
        handleScoring({ id }) {},
        resetForm() {
            this.form = {
                name: '',
                courseName: '',
                pageSize: 30,
                current: 0,
                type: this.form.type
            };
        },
        openAddDialog() {
            if (!this.form.courseName) {
                this.$message.error('请先选择班级!');
                return;
            }
            this.addCoursedialogVisible = true;
        },
        // 新增/编辑班级
        saveData() {
            this.$refs['addCourseForm'].validate(valid => {
                if (valid) {
                }
            });
        },
        // 上传附件
        uploadData() {},
        handleEditcourse(row) {
            this.splitData(row, 'edit');
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
            this.resetcourseForm();
        },
        closeUploadDialog() {
            this.$refs.uploadForm.resetFields();
        },
        resetcourseForm() {
            this.addCourseForm = {
                name: '',
                time: [],
                expertFirstName: '',
                instructorFirstName: ''
            };
            const addCourseForm = this.$refs.addCourseForm;
            addCourseForm && addCourseForm.resetFields();
        },
        handleChangePage(page) {
            this.form.pageSize = page.pageSize;
            this.form.current = page.currentPage - 1;
            this.getData();
        },
        resetForm() {
            this.form = {
                name: '',
                expertFirstName: '',
                instructorFirstName: '',
                pageSize: 30,
                current: 0
            };
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
</style>
