<template>
    <div>
        <search-box :form="form">
            <template slot="input">
                <el-col :span="5">
                    <el-form-item>
                        <el-select
                            v-model.trim="form.classesName"
                            style="width:100%"
                            filterable
                            placeholder="请选择班级"
                            @change="searchData"
                        >
                            <el-option v-for="item in classesOptions" :key="item.id" :label="item.name" :value="item.name"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="3">
                    <el-form-item>
                        <el-select v-model.trim="form.authorities" style="width:100%" placeholder="请选择角色" @change="searchData">
                            <el-option v-for="(value, key) in roleOptions" :key="key" :label="value" :value="key"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="3">
                    <el-form-item>
                        <el-input v-model.trim="form.name" placeholder="请输入姓名" @keyup.enter.native="searchData"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="3">
                    <el-form-item>
                        <el-input v-model.trim="form.login" placeholder="请输入手机号" @keyup.enter.native="searchData"></el-input>
                    </el-form-item>
                </el-col>
            </template>
            <template slot="button">
                <el-button type="primary" icon="el-icon-search" @click="searchData">搜索</el-button>
                <el-button icon="el-icon-refresh" @click="resetForm">重置</el-button>
            </template>
            <template slot="rightButton">
                <el-button icon="iconfont icondaoru" @click="importData">导入</el-button>
                <el-button type="warning" icon="el-icon-plus" @click="openAddDialog">新增</el-button>
            </template>
        </search-box>
        <div class="container" v-loading="tableLoading">
            <vxe-table border stripe highlight-hover-row size="medium"  ref="userTable">
                <vxe-table-column field="name" title="姓名"></vxe-table-column>
                <vxe-table-column field="name" title="性别">
                    <template v-slot="{ row }">
                        <span>{{ row.sexType === 'MEN' ? '男' : '女' }}</span>
                    </template>
                </vxe-table-column>
                <vxe-table-column field="login" title="手机号"></vxe-table-column>
                <vxe-table-column title="角色">
                    <template v-slot="{ row }">
                        <span>{{ roleOptions[row.authorities[0]] }}</span>
                    </template>
                </vxe-table-column>
                <vxe-table-column fixed="right" title="操作" width="200">
                    <template slot-scope="scope">
                        <div class="operation-icon">
                            <el-button type="text" @click="viewData(scope.row)">查看</el-button>
                            <el-button type="text" @click="handleEditUser(scope.row)">编辑</el-button>
                            <el-button type="text" @click="remove(scope.row)">删除</el-button>
                        </div>
                    </template>
                </vxe-table-column>
            </vxe-table>
            <pagniation :currentPage="form.current" :totalPage="totalPage" :totalNum="totalNum" @changePage="handleChangePage"></pagniation>
        </div>
        <!-- 新增 -->
        <el-dialog
            :title="addDialogTitle"
            :visible.sync="addUserDialogVisible"
            @close="closeAddDialog"
            :close-on-click-modal="false"
            width="500px"
        >
            <p class="course-name">班级名称&nbsp;</p>
            <el-form
                ref="addUserForm"
                class="dialog-form-box"
                v-if="userDialogType !== 'view'"
                :model="addUserForm"
                :rules="addUserRules"
                label-width="80px"
            >
                <el-form-item label="角色" prop="authorities">
                    <el-select v-model="addUserForm.authorities" style="width:100%" placeholder="请选择角色">
                        <el-option v-for="(value, key) in roleOptions" :key="key" :label="value" :value="key"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="addUserForm.name" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sexType">
                    <el-select v-model="addUserForm.sexType" style="width:100%" placeholder="请输选择性别">
                        <el-option label="男" value="MEN"> </el-option>
                        <el-option label="女" value="WOMEN"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="民族" prop="nationType">
                    <el-select v-model="addUserForm.nationType" style="width:100%" placeholder="请选择民族">
                        <el-option v-for="(value, key) in nationTypes" :key="key" :label="value" :value="key"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="手机号" prop="login">
                    <el-input v-model.trim="addUserForm.login" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model.trim="addUserForm.email" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="单位">
                    <el-input v-model.trim="addUserForm.companyName" placeholder="请输入单位名称"></el-input>
                </el-form-item>
                <el-form-item label="省市县">
                    <address-component v-model="addUserForm.addressData" />
                </el-form-item>
                <el-form-item label="所教学科">
                    <el-input v-model.trim="addUserForm.subject" placeholder="请输入所教学科"></el-input>
                </el-form-item>
            </el-form>
            <view-data v-else :list="viewDataList" />
            <span slot="footer" class="dialog-footer">
                <template v-if="userDialogType !== 'view'">
                    <el-button @click="addUserDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveData">确 定</el-button>
                </template>
                <template v-else><el-button @click="addUserDialogVisible = false">关 闭</el-button></template>
            </span>
        </el-dialog>
        <!-- 其他操作 -->
        <el-dialog :title="dialogDto.title" :visible.sync="dialogDto.visible" :close-on-click-modal="false" :width="dialogDto.width">
            <component :is="dialogDto.component" />
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogDto.visible = false">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import viewData from '@/components/viewData.vue';
import importUser from './components/importUser.vue';
import addressComponent from '@/components/tools/address.vue';
import { validatePhone, validateEmail } from '@/utils/utils.js';
import { SELEECT_ROLES, NATION_TYPES } from '@/utils/config.js';
export default {
    data() {
        return {
            form: {
                classesName: '',
                authorities: '',
                name: '',
                login: '',
                pageSize: 30,
                current: 0
            },
            tableLoading: false,
            addUserForm: {
                name: '',
                authorities: '',
                sexType: '',
                nationType: '',
                login: '',
                email: '',
                companyName: '',
                subject: '',
                addressData: []
            },
            nationTypes: NATION_TYPES,
            roleOptions: SELEECT_ROLES,
            dialogDto: {
                component: null,
                visible: false,
                title: '导入学员',
                width: '500px'
            },
            // 权重表单
            userDialogType: 'add',
            totalPage: 0,
            totalNum: 0,
            addUserDialogVisible: false,
            classesOptions: [], // 班级列表
            instructorOptions: [], // 辅导员列表
            expertOptions: [], // 专家列表
            addUserRules: {
                name: { required: true, message: '请输入姓名', trigger: 'blur' },
                authorities: { required: true, message: '请选择角色', trigger: 'blur' },
                sexType: { required: true, message: '请选择性别', trigger: 'blur' },
                nationType: { required: true, message: '请选择民族', trigger: 'blur' },
                email: { validator: validateEmail, trigger:'blur' },
                login: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: validatePhone, trigger: 'blur' }
                ]
            },
            viewDataList: [] // 展示查看数据列表
        };
    },
    computed: {
        addDialogTitle() {
            return this.userDialogType === 'add' ? '新增' : this.userDialogType === 'edit' ? '编辑' : '查看';
        }
    },
    components: { viewData, importUser, addressComponent },
    created() {
        this.getData();
        this.getAllClassesData();
    },
    watch: {},
    methods: {
        searchData() {
            this.form.current = 0;
            this.getData();
        },
        getData() {
            const params = Object.assign({}, this.form);
            this.tableLoading = true;
            this.$http.userService.getAllUsers(params).then(res => {
                this.$refs.userTable.loadData(res.data.content);
                this.totalPage = res.data.totalPages;
                this.totalNum = res.data.totalElements;
            }).finally(()=>{
                this.tableLoading = false;
            });
        },
        // 获取所有的班级列表
        getAllClassesData() {
            this.$http.classesService.getAllClasses().then(res => {
                this.classesOptions = res.data;
            });
        },
        // 导入数据
        importData() {
            if (!this.form.classesName) {
                this.$message.error('请先选择班级!');
                return;
            }
        },
        openAddDialog() {
            if (!this.form.classesName) {
                this.$message.error('请先选择班级!');
                return;
            }
            this.addUserDialogVisible = true;
        },
        getClassesByName() {
            return this.classesOptions.find(item => item.name === this.form.classesName);
        },
        // 新增/编辑班级
        saveData() {
            this.$refs['addUserForm'].validate(valid => {
                if (valid) {
                    const params = Object.assign({}, this.addUserForm);
                    params.fullAddressName = params.addressData.join('-');
                    params.authorities = [params.authorities];
                    this.dialogLoading = true;
                    if (this.userDialogType === 'add') {
                        const { id, name } = this.getClassesByName();
                        params.classesId = id;
                        params.classesName = name;
                        this.$http.userService
                            .createUser(params)
                            .then(res => {
                                this.$message({
                                    type: 'success',
                                    message: '添加成功'
                                });
                                this.getData();
                                this.addUserDialogVisible = false;
                            })
                            .finally(() => {
                                this.dialogLoading = false;
                            });
                    } else {
                        params.id = this.curCheckId;
                        this.$http.userService
                            .updateUser(params)
                            .then(res => {
                                this.getData();
                                this.$message({
                                    type: 'success',
                                    message: '修改成功'
                                });
                                this.addUserDialogVisible = false;
                            })
                            .finally(() => {
                                this.dialogLoading = false;
                            });
                    }
                }
            });
        },
        handleEditUser({ id, name, authorities, sexType, nationType, login, email, companyName, subject, fullAddressName }) {
            this.addUserForm = {
                name,
                authorities: authorities[0] || '',
                sexType,
                nationType,
                login,
                email,
                companyName,
                subject,
                addressData: fullAddressName.split('-')
            };
            this.userDialogType = 'edit';
            this.curCheckId = id;
            this.addUserDialogVisible = true;
        },
        viewData({ name, authorities, sexType, nationType, login, email, companyName, subject, fullAddressName }) {
            this.viewDataList = [
                { name: '角色', value: authorities[0] },
                { name: '姓名', value: name },
                { name: '性别', value: sexType === 'MEN' ? '男' : '女' },
                { name: '民族', value: NATION_TYPES[nationType] },
                { name: '手机号', value: login },
                { name: '邮箱', value: email },
                { name: '单位', value: companyName },
                { name: '省市县', value: fullAddressName },
                { name: '所教学科', value: subject }
            ];
        },
        closeAddDialog() {
            this.resetUserForm();
        },
        remove() {},
        resetUserForm() {
            this.addUserForm = {
                name: '',
                time: [],
                expertFirstName: '',
                instructorFirstName: ''
            };
            const addUserForm = this.$refs.addUserForm;
            addUserForm && addUserForm.resetFields();
        },
        handleChangePage(page) {
            this.form.pageSize = page.pageSize;
            this.form.current = page.currentPage - 1;
            this.getData();
        },
        resetForm() {
            this.form = {
                name: '',
                authorities: '',
                name: '',
                login: '',
                pageSize: this.form.pageSize,
                current: 0
            };
            this.getData();
        }
    }
};
</script>
<style scoped></style>
