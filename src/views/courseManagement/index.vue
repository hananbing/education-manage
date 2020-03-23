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
                <el-button type="warning" icon="el-icon-plus" @click="addCoursedialogVisible = true">新增</el-button>
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
                            <el-button type="text" @click="handleEditClasses(scope.row)">编辑</el-button>
                            <el-button type="text" @click="remove(scope.row)">删除</el-button>
                            <el-button type="text" @click="addLink(scope.row)" v-if="scope.row.type === 'VIDEO' && !scope.row.url"
                                >添加链接</el-button
                            >
                            <el-button type="text" @click="upload(scope.row)" v-if="scope.row.type === 'OFFICE' && !scope.row.annexName"
                                >上传附件</el-button
                            >
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
						<p class="classes-name">班级名称</p>
            <el-form
                ref="addClassesForm"
                class="dialog-form-box"
                v-if="classesDialogType !== 'view'"
                :model="addClassesForm"
                :rules="addClassesRules"
                label-width="80px"
            >
                <el-form-item label="班级名称" prop="name">
                    <el-input v-model="addClassesForm.name" placeholder="请输入班级名称"></el-input>
                </el-form-item>
                <el-form-item label="日期" prop="time">
                    <el-date-picker
                        v-model="addClassesForm.time"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        style="width:100%"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="辅导员" prop="instructorFirstName">
                    <el-select v-model="addClassesForm.instructorFirstName" style="width:100%" placeholder="请输入辅导员名称">
                        <el-option label="全部" value="ALL"></el-option>
                        <el-option v-for="(value, key) in classesOptions" :key="key" :label="value" :value="key"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="专家" prop="expertFirstName">
                    <el-select v-model="addClassesForm.expertFirstName" style="width:100%" placeholder="请输入专家名称">
                        <el-option label="全部" value="ALL"></el-option>
                        <el-option v-for="(value, key) in classesOptions" :key="key" :label="value" :value="key"> </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <ul class="dialog-form-view" v-else>
                <li class="item">
                    <div class="label">班级名称</div>
                    <div class="content">{{ addClassesForm.name }}</div>
                </li>
                <li class="item">
                    <div class="label">开始时间</div>
                    <div class="content">{{ addClassesForm.time[0] | formatDate('yyyy-MM-dd') }}</div>
                </li>
                <li class="item">
                    <div class="label">结束时间</div>
                    <div class="content">{{ addClassesForm.time[1] | formatDate('yyyy-MM-dd') }}</div>
                </li>
                <li class="item">
                    <div class="label">辅导员</div>
                    <div class="content">{{ addClassesForm.instructorFirstName }}</div>
                </li>
                <li class="item">
                    <div class="label">专家</div>
                    <div class="content">{{ addClassesForm.expertFirstName }}</div>
                </li>
            </ul>
            <span slot="footer" class="dialog-footer">
                <template v-if="classesDialogType !== 'view'">
                    <el-button @click="addCoursedialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveData">确 定</el-button>
                </template>
                <template v-else><el-button @click="addCoursedialogVisible = false">关 闭</el-button></template>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
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
            addCourseForm: {},
            classesDialogType: 'add',
            totalPage: 0,
            totalNum: 0,
            addCoursedialogVisible: false,
            classesOptions: [] // 班级列表
        };
    },
    computed: {
        addDialogTitle() {
            return this.classesDialogType === 'add' ? '新增' : this.classesDialogType === 'edit' ? '编辑' : '查看';
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
            this.$refs.classesTable.loadData([
                { name: 121, expertFirstName: 13213131, instructorFirstName: 2423423424 },
                { name: 121, expertFirstName: 13213131, instructorFirstName: 2423423424 }
            ]);
        },
        remove({ id }) {},
        addLink({ id }) {},
        upload({ id }) {},
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
        openAddDialog() {},
        // 新增/编辑班级
        saveData() {
            this.$refs['addClassesForm'].validate(valid => {
                if (valid) {
                }
            });
        },
        handleEditClasses(row) {
            this.splitData(row, 'edit');
        },
        splitData({ name, expertFirstName, instructorFirstName, startDate, endDate }, type = 'edit') {
            this.addClassesForm = {
                name,
                time: [startDate, endDate],
                expertFirstName,
                instructorFirstName
            };
            this.classesDialogType = type;
            this.addCoursedialogVisible = true;
        },
        viewData(row) {
            this.splitData(row, 'view');
        },
        closeAddDialog() {
            this.resetClassesForm();
        },
        resetClassesForm() {
            this.addClassesForm = {
                name: '',
                time: [],
                expertFirstName: '',
                instructorFirstName: ''
            };
            const addClassesForm = this.$refs.addClassesForm;
            addClassesForm && addClassesForm.resetFields();
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
<style scoped></style>
