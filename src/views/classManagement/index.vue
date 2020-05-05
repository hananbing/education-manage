<template>
    <div>
        <search-box :form="form" title="订单列表">
            <template slot="input">
                <el-col :span="5">
                    <el-form-item>
                        <el-select v-model.trim="form.name" style="width: 100%;" placeholder="请选择班级" filterable @change="searchData">
                            <el-option label="全部" value=""> </el-option>
                            <el-option v-for="item in classesOptions" :key="item.id" :label="item.name" :value="item.name"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col style="width: 240px;">
                    <el-form-item label="">
                        <el-date-picker
                            v-model.trim="form.time"
                            type="daterange"
                            range-separator="-"
                            value-format="timestamp"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                        >
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="3">
                    <el-form-item>
                        <el-select v-model.trim="form.instructorName" style="width: 100%;" placeholder="请选择辅导员" @change="searchData">
                            <el-option label="请选择辅导员" value=""></el-option>
                            <el-option v-for="(value, key) in instructorOptions" :key="key" :label="value" :value="key"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="3">
                    <el-form-item>
                        <el-select v-model.trim="form.expertName" style="width: 100%;" placeholder="请选择专家" @change="searchData">
                            <el-option label="请选择专家" value=""></el-option>
                            <el-option v-for="(value, key) in expertOptions" :key="key" :label="value" :value="key"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </template>
            <template slot="button">
                <el-button type="primary" icon="el-icon-search" @click="searchData">搜索</el-button>
                <el-button icon="el-icon-refresh" @click="resetForm">重置</el-button>
            </template>
            <template slot="rightButton">
                <el-button type="warning" icon="el-icon-plus" @click="addClassesdialogVisible = true">新增</el-button>
            </template>
        </search-box>
        <div class="container" v-loading="tableLoading">
            <vxe-table
                border
                stripe
                highlight-hover-row
                size="medium"
                ref="classesTable"
                show-header-overflow
                show-overflow
                :max-height="tableMaxHeight"
            >
                <vxe-table-column field="name" title="班级名称"></vxe-table-column>
                <vxe-table-column title="开始日期">
                    <template slot-scope="scope">{{ scope.row.startDate | formatDate }}</template>
                </vxe-table-column>
                <vxe-table-column title="结束日期">
                    <template slot-scope="scope">{{ scope.row.endDate | formatDate }}</template>
                </vxe-table-column>
                <vxe-table-column field="instructorName" title="辅导员名称"></vxe-table-column>
                <vxe-table-column field="expertName" title="专家名称"></vxe-table-column>
                <vxe-table-column fixed="right" title="操作" width="200">
                    <template slot-scope="scope">
                        <div class="operation-icon">
                            <el-button type="text" @click="viewData(scope.row)">查看</el-button>
                            <el-button type="text" @click="handleEditClasses(scope.row)">编辑</el-button>
                            <el-button type="text" @click="remove(scope.row)">删除</el-button>
                            <el-button type="text" @click="weightConfig(scope.row)">权重配置</el-button>
                        </div>
                    </template>
                </vxe-table-column>
            </vxe-table>
            <pagniation :currentPage="form.current" :totalPage="totalPage" :totalNum="totalNum" @changePage="handleChangePage"></pagniation>
        </div>
        <el-dialog
            :title="addDialogTitle"
            :visible.sync="addClassesdialogVisible"
            @close="closeAddDialog"
            :close-on-click-modal="false"
            width="500px"
        >
            <el-form
                ref="addClassesForm"
                class="dialog-form-box"
                v-if="classesDialogType !== 'view'"
                :model="addClassesForm"
                :rules="addClassesRules"
                label-width="80px"
            >
                <el-form-item label="班级名称" prop="name">
                    <el-input v-model.trim="addClassesForm.name" placeholder="请输入班级名称"></el-input>
                </el-form-item>
                <el-form-item label="日期" prop="time">
                    <el-date-picker
                        v-model.trim="addClassesForm.time"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        style="width: 100%;"
                        value-format="timestamp"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="项目类型" prop="projectType">
                    <el-select v-model="addClassesForm.projectType" style="width: 100%;" placeholder="请选择项目类型">
                        <el-option v-for="(value, key) in projectType" :key="key" :label="value" :value="key"> </el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="专家" prop="expertName">
                    <el-select v-model="addClassesForm.expertName" style="width:100%" placeholder="请输入专家名称">
                        <el-option v-for="(value, key) in classesOptions" :key="key" :label="value" :value="key"> </el-option>
                    </el-select>
                </el-form-item> -->
            </el-form>
            <ul class="dialog-form-view" v-else>
                <li class="item">
                    <div class="label">班级名称</div>
                    <div class="content">{{ addClassesForm.name }}</div>
                </li>
                <li class="item">
                    <div class="label">项目类型</div>
                    <div class="content">{{ projectType[addClassesForm.projectType] }}</div>
                </li>
                <li class="item">
                    <div class="label">开始时间</div>
                    <div class="content">{{ addClassesForm.time[0] | formatDate }}</div>
                </li>
                <li class="item">
                    <div class="label">结束时间</div>
                    <div class="content">{{ addClassesForm.time[1] | formatDate }}</div>
                </li>
                <li class="item">
                    <div class="label">辅导员</div>
                    <div class="content">{{ addClassesForm.instructorName }}</div>
                </li>
                <li class="item">
                    <div class="label">专家</div>
                    <div class="content">{{ addClassesForm.expertName }}</div>
                </li>
            </ul>
            <span slot="footer" class="dialog-footer">
                <template v-if="classesDialogType !== 'view'">
                    <el-button @click="addClassesdialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveData" :loading="dialogLoading">确 定</el-button>
                </template>
                <template v-else><el-button @click="addClassesdialogVisible = false">关 闭</el-button></template>
            </span>
        </el-dialog>
        <el-dialog title="权重配置" :visible.sync="addWeightDialogVisible" :close-on-click-modal="false" width="450px">
            <el-form ref="weightForm" class="dialog-form-box" :model="weightForm" :rules="weightRules" label-width="150px">
                <el-form-item label="签到分数权重%" prop="signInScore">
                    <el-input-number
                        v-model="weightForm.signInScore"
                        :min="1"
                        :max="100"
                        step-strictly
                        label="请输入签到分数权重"
                        style="width: 100%;"
                    ></el-input-number>
                </el-form-item>
                <el-form-item label="在线学习分数权重%" prop="onlineScore">
                    <el-input-number
                        v-model="weightForm.onlineScore"
                        :min="1"
                        :max="100"
                        step-strictly
                        label="请输入在线学习分数权重"
                        style="width: 100%;"
                    ></el-input-number>
                </el-form-item>
                <el-form-item label="课程学习分数权重%" prop="courseScore">
                    <el-input-number
                        v-model="weightForm.courseScore"
                        :min="1"
                        :max="100"
                        step-strictly
                        label="请输入课程学习分数权重"
                        style="width: 100%;"
                    ></el-input-number>
                </el-form-item>
                <el-form-item label="作业分数权重%" prop="assignmentScore">
                    <el-input-number
                        v-model="weightForm.assignmentScore"
                        :min="1"
                        :max="100"
                        step-strictly
                        label="请输入作业分数权重"
                        style="width: 100%;"
                    ></el-input-number>
                </el-form-item>
                <el-form-item label="话题分数权重%" prop="topicScore">
                    <el-input-number
                        v-model="weightForm.topicScore"
                        :min="1"
                        :max="100"
                        step-strictly
                        label="请输入话题分数权重"
                        style="width: 100%;"
                    ></el-input-number>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addWeightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addWeight" :loading="dialogLoading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        // const validateScore = (rule, value, callback) => {
        //     const { topicScore, courseScore, onlineScore, signInScore, assignmentScore } = this.weightForm;
        //     const num = topicScore + courseScore + onlineScore + signInScore + assignmentScore;
        //     console.log(num);
        //     if (num !== 100) {
        //         callback(new Error('各项之和必须为100'));
        //     } else {
        //         callback();
        //     }
        // };
        return {
            form: {
                name: '',
                expertName: '',
                instructorName: '',
                time: [],
                pageSize: 30,
                current: 0
            },
            tableLoading: false,
            addClassesForm: {
                name: '',
                projectType: '',
                time: []
                // expertName: '',
                // instructorName: ''
            },
            curCheckedId: null, // 当前操作数据的id
            dialogLoading: false,
            // 权重表单
            weightForm: {
                topicScore: 0,
                courseScore: 0,
                onlineScore: 0,
                signInScore: 0,
                assignmentScore: 0
            },
            projectType: { CHUAN_SHI: '川师', CITY: '省市区', OTHER: '其他省市' },
            weightRules: {
                topicScore: [
                    { type: 'number', required: true, message: '请输入百分比', trigger: 'blur' }
                    // { type: 'number', validate: validateScore}
                ],
                courseScore: [
                    { type: 'number', required: true, message: '请输入百分比', trigger: 'blur' }
                    // { type: 'number', validate: validateScore, trigger: 'blur' }
                ],
                onlineScore: [
                    { type: 'number', required: true, message: '请输入百分比', trigger: 'blur' }
                    // { type: 'number', validate: validateScore, trigger: 'blur' }
                ],
                signInScore: [
                    { type: 'number', required: true, message: '请输入百分比', trigger: 'blur' }
                    // { type: 'number', validate: validateScore, trigger: 'blur' }
                ],
                assignmentScore: [
                    { type: 'number', required: true, message: '请输入百分比', trigger: 'blur' }
                    // { type: 'number', validate: validateScore, trigger: 'blur' }
                ]
            },
            classesDialogType: 'add',
            totalPage: 0,
            totalNum: 0,
            addClassesdialogVisible: false,
            addWeightDialogVisible: false,
            classesOptions: [], // 班级列表
            instructorOptions: [], // 辅导员列表
            expertOptions: [], // 专家列表
            addClassesRules: {
                name: { required: true, message: '请输入班级名称', trigger: 'blur' },
                projectType: { required: true, message: '请选择项目类型', trigger: 'change' },
                // instructorName: { required: true, message: '请输入辅导员名称', trigger: 'blur' },
                time: { required: true, message: '请输入有效时间', trigger: 'blur' }
            }
        };
    },
    computed: {
        addDialogTitle() {
            return this.classesDialogType === 'add' ? '新增' : this.classesDialogType === 'edit' ? '编辑' : '查看';
        }
    },
    created() {
        this.getData();
        this.getAllClassesData();
    },
    watch: {
        addWeightDialogVisible(val) {
            if (!val) {
                this.$refs.weightForm.resetFields();
            }
        }
    },
    methods: {
        searchData() {
            this.form.current = 0;
            this.getData();
        },
        getData(isRefersh = false) {
            this.tableLoading = true;
            const params = Object.assign({}, this.form);
            params.startDate = params.time[0] || '';
            params.endDate = params.time[1] || '';
            delete params.time;
            this.$http.classesService
                .getClasses(params)
                .then(res => {
                    this.$refs.classesTable.loadData(res.data.content);
                    this.totalPage = res.data.totalPages;
                    this.totalNum = res.data.totalElements;
                    if (isRefersh) {
                        this.$store.commit({
                            type: 'setClassesData',
                            val: res.data
                        });
                    }
                })
                .finally(() => {
                    this.tableLoading = false;
                });
        },
        getAllClassesData() {
            this.$http.classesService.getAllClasses().then(res => {
                this.classesOptions = res.data;
            });
        },
        openAddDialog() {},
        // 新增/编辑班级
        saveData() {
            this.$refs['addClassesForm'].validate(valid => {
                if (valid) {
                    this.dialogLoading = true;
                    const { time, name, projectType } = this.addClassesForm;
                    const params = {
                        name,
                        projectType,
                        startDate: time[0],
                        endDate: time[1]
                    };
                    if (this.classesDialogType === 'add') {
                        this.$http.classesService
                            .createClasses(params)
                            .then(res => {
                                this.addClassesdialogVisible = false;
                                this.getData('refersh');
                            })
                            .finally(() => {
                                this.dialogLoading = false;
                            });
                    } else {
                        params.id = this.curCheckedId;
                        this.$http.classesService
                            .updateClasses(params)
                            .then(res => {
                                this.addClassesdialogVisible = false;
                                this.getData('refersh');
                            })
                            .finally(() => {
                                this.dialogLoading = false;
                            });
                    }
                }
            });
        },
        handleEditClasses(row) {
            this.splitData(row, 'edit');
            this.curCheckedId = row.id;
        },
        splitData({ name, projectType, expertName, instructorName, startDate, endDate }, type = 'edit') {
            this.addClassesForm = {
                name,
                time: [startDate, endDate],
                projectType,
                expertName,
                instructorName
            };
            this.classesDialogType = type;
            this.addClassesdialogVisible = true;
        },
        viewData(row) {
            this.splitData(row, 'view');
        },
        closeAddDialog() {
            this.resetClassesForm();
        },
        remove({ id }) {
            this.$http.classesService.deleteClasses(id).then(res => {
                this.$confirm('此操作将删除该班级, 是否继续?', '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getData('refersh');
                    })
                    .catch(() => {});
            });
        },
        weightConfig({ id, weightInfo }) {
            const { topicScore, courseScore, onlineScore, signInScore, assignmentScore } = weightInfo || {};
            this.weightForm = {
                topicScore,
                courseScore,
                onlineScore,
                signInScore,
                assignmentScore
            };
            this.addWeightDialogVisible = true;
            this.curCheckedId = id;
        },
        addWeight() {
            this.$refs['weightForm'].validate(valid => {
                if (valid) {
                    const { topicScore, courseScore, onlineScore, signInScore, assignmentScore } = this.weightForm;
                    const num = topicScore + courseScore + onlineScore + signInScore + assignmentScore;
                    if (num !== 100) {
                        this.$message.error('各项之和必须为100');
                        return;
                    }
                    this.$http.classesService.addClassesWeight({ id: this.curCheckedId, weightInfo: this.weightForm }).then(() => {
                        this.addWeightDialogVisible = false;
                        this.$message({
                            message: '设置成功',
                            type: 'success'
                        });
                        this.getData();
                    });
                }
            });
        },
        resetClassesForm() {
            this.addClassesForm = {
                name: '',
                time: [],
                projectType: ''
                // expertName: '',
                // instructorName: ''
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
                expertName: '',
                time: [],
                instructorName: '',
                pageSize: this.form.pageSize,
                current: 0
            };
            this.getData();
        }
    }
};
</script>
<style scoped></style>
