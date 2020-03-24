<template>
    <div>
        <search-box :form="form" title="订单列表">
            <template slot="input">
                <el-col :span="5">
                    <el-form-item>
                        <el-select v-model="form.name" style="width:100%" placeholder="请选择班级" @change="searchData">
                            <el-option label="全部" value="ALL"></el-option>
                            <el-option v-for="(value, key) in classesOptions" :key="key" :label="value" :value="key"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col style="width:240px;">
                    <el-form-item label="">
                        <el-date-picker
                            v-model="form.orderTime"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                        >
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="3">
                    <el-form-item>
                        <el-select v-model="form.instructorFirstName" style="width:100%" placeholder="请选择辅导员" @change="searchData">
                            <el-option label="全部" value="ALL"></el-option>
                            <el-option v-for="(value, key) in instructorOptions" :key="key" :label="value" :value="key"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="3">
                    <el-form-item>
                        <el-select v-model="form.expertFirstName" style="width:100%" placeholder="请选择专家" @change="searchData">
                            <el-option label="全部" value="ALL"></el-option>
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
        <div class="container">
            <vxe-table border stripe highlight-hover-row size="medium" :loading="tableLoading" ref="classesTable">
                <vxe-table-column field="name" title="班级名称"></vxe-table-column>
                <vxe-table-column title="开始日期">
                    <template slot-scope="scope">{{ Number(scope.row.startDate) | formatDate('yyyy-MM-dd') }}</template>
                </vxe-table-column>
                <vxe-table-column title="结束日期">
                    <template slot-scope="scope">{{ Number(scope.row.endDate) | formatDate('yyyy-MM-dd') }}</template>
                </vxe-table-column>
                <vxe-table-column field="instructorFirstName" title="辅导员名称"></vxe-table-column>
                <vxe-table-column field="expertFirstName" title="专家名称"></vxe-table-column>
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
                        <el-option v-for="(value, key) in classesOptions" :key="key" :label="value" :value="key"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="专家" prop="expertFirstName">
                    <el-select v-model="addClassesForm.expertFirstName" style="width:100%" placeholder="请输入专家名称">
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
                    <el-button @click="addClassesdialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveData">确 定</el-button>
                </template>
                <template v-else><el-button @click="addClassesdialogVisible = false">关 闭</el-button></template>
            </span>
        </el-dialog>
        <el-dialog
            title="权重配置"
            :visible.sync="addWeightDialogVisible"
            :close-on-click-modal="false"
            width="450px"
        >
            <el-form ref="weightForm" class="dialog-form-box" :model="weightForm" :rules="weightRules" label-width="150px">
                <el-form-item label="签到分数权重%" prop="name">
                    <el-input-number v-model="weightForm.name" :min="1" :max="100" label="请输入签到分数权重" style="width:100%"></el-input-number>
                </el-form-item>
                <el-form-item label="在线学习分数权重%" prop="name">
                    <el-input-number v-model="weightForm.name" :min="1" :max="100" label="请输入在线学习分数权重" style="width:100%"></el-input-number>
                </el-form-item>
                <el-form-item label="课程学习分数权重%" prop="name">
                    <el-input-number v-model="weightForm.name" :min="1" :max="100" label="请输入课程学习分数权重" style="width:100%"></el-input-number>
                </el-form-item>
                <el-form-item label="作业分数权重%" prop="name">
                    <el-input-number v-model="weightForm.name" :min="1" :max="100" label="请输入作业分数权重" style="width:100%"></el-input-number>
                </el-form-item>
                <el-form-item label="话题分数权重%" prop="name">
                    <el-input-number v-model="weightForm.name" :min="1" :max="100" label="请输入话题分数权重" style="width:100%"></el-input-number>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addWeightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addWeight">确 定</el-button>
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
                expertFirstName: '',
                instructorFirstName: '',
                pageSize: 30,
                current: 0
            },
            tableLoading: false,
            addClassesForm: {
                name: '',
                time: [],
                expertFirstName: '',
                instructorFirstName: ''
            },
            // 权重表单
            weightForm: {},
            weightRules: {},
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
                expertFirstName: { required: true, message: '请输入专家名称', trigger: 'blur' },
                instructorFirstName: { required: true, message: '请输入辅导员名称', trigger: 'blur' },
                time: { required: true, message: '请输入有效时间', trigger: 'blur' }
            }
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
    watch:{
        addWeightDialogVisible(val){
            if(!val){
                this.$refs.weightForm.resetFields();
            }
        }
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
        resetForm() {
            this.form = {
                name: '',
                expertFirstName: '',
                instructorFirstName: '',
                pageSize: 30,
                current: 0
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
            this.addClassesdialogVisible = true;
        },
        viewData(row) {
            this.splitData(row, 'view');
        },
        closeAddDialog() {
            this.resetClassesForm();
        },
        remove() {},
        weightConfig(row) {
            this.weightForm = {};
            this.addWeightDialogVisible = true;
        },
        addWeight() {
            this.$refs['weightForm'].validate(valid => {
                if (valid) {
                }
            });
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
