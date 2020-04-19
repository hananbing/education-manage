<template>
    <div>
        <search-box :form="form">
            <template slot="tabs">
                <el-tabs v-model="form.type" @tab-click="searchData">
                    <el-tab-pane label="学习统计" name="unFinished"></el-tab-pane>
                    <el-tab-pane label="考勤统计" name="finished"></el-tab-pane>
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
                <el-col :span="4">
                    <el-form-item>
                        <el-date-picker
                            v-model.number="form.time"
                            type="date"
                            value-format="timestamp"
                            placeholder="选择日期"
                            style="width:100%"
                        >
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </template>
            <template slot="button">
                <el-button type="primary" icon="el-icon-search" @click="searchData">搜索</el-button>
                <el-button icon="el-icon-refresh" @click="resetForm">重置</el-button>
            </template>
        </search-box>
        <div class="container" v-loading="tableLoading">
            <vxe-table
                stripe
                highlight-hover-row
                size="medium"
                show-header-overflow
                show-overflow
                :data="tableData"
                :max-height="tableMaxHeight"
            >
                <template v-if="form.type === 'finished'">
                    <vxe-table-column field="name" title="姓名"> </vxe-table-column>
                    <vxe-table-column field="name" title="总分"> </vxe-table-column>
                    <vxe-table-column field="name" title="签到得分"> </vxe-table-column>
                    <vxe-table-column field="name" title="在线学习得分"> </vxe-table-column>
                    <vxe-table-column field="name" title="作业得分"> </vxe-table-column>
                    <vxe-table-column field="name" title="话题得分"> </vxe-table-column>
                </template>
                <template v-else>
                    <vxe-table-column field="日期" title="课程名称">
                        <template slot-scope="scope">{{ scope.row.startDate | formatDate }}</template>
                    </vxe-table-column>
                    <vxe-table-column title="已签到人数">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="点击查看详情" placement="top">
                                <span @click="checkDetails(true)">{{ scope.row.num }}</span>
                            </el-tooltip>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column title="未签到人数">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="点击查看详情" placement="top">
                                <span @click="checkDetails(false)">{{ scope.row.num }}</span>
                            </el-tooltip>
                        </template>
                    </vxe-table-column>
                </template>
            </vxe-table>
            <pagniation :currentPage="form.current" :totalPage="totalPage" :totalNum="totalNum" @changePage="handleChangePage"></pagniation>
        </div>
        <el-dialog :title="dialogDto.title" width="700px" :visible.sync="dialogDto.visible" :close-on-click-modal="false">
            <div class="dialog-search-box">
                <el-input
                    v-model="dialogForm.name"
                    placeholder="请输入姓名"
                    clearable
                    style="width:300px;margin-right:20px;"
                    @keyup.enter.native="searchDialogData"
                ></el-input>
                <div>
                    <el-button type="primary" icon="el-icon-search" @click="searchDialogData">搜索</el-button>
                    <el-button icon="el-icon-refresh" @click="resetDialogForm">重置</el-button>
                </div>
            </div>
            <div v-loading="dialogDto.loading">
                <vxe-table
                    stripe
                    highlight-hover-row
                    size="medium"
                    show-header-overflow
                    show-overflow
                    :data="dialogData"
                    max-height="300px"
                    style="width:100%"
                    v-show="form.type === 'unFinished'"
                >
                    <vxe-table-column field="" title="签到时间">
                        <template slot-scope="scope">{{ scope.row.startDate | formatDate('yyyy-MM-dd hh:mm') }}</template>
                    </vxe-table-column>
                    <vxe-table-column field="name" title="姓名"></vxe-table-column>
                </vxe-table>
                <pagniation
                    :currentPage="dialogForm.current"
                    :totalPage="dialogDto.totalPage"
                    :totalNum="dialogDto.totalNum"
                    @changePage="handleDialogChangePage"
                ></pagniation>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogDto.visible = false">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            form: {
                current: 0,
                pageSize: 30,
                classesId: '',
                time: '',
                type: 'unFinished'
            },
            dialogDto: {
                title: '已签到列表',
                visible: false,
                loading: false,
                totalPage: 0,
                totalNum: 0
            },
            tableLoading: false,
            dialogForm: {
                name: '',
                pageSize: 30,
                current: 0
            },
            tableData: [],
            dialogData: [],
            curCheckId: null,
            totalPage: 0,
            totalNum: 0
        };
    },
    computed: {
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
        getDialogData() {
            this.dialogDto.loading = true;
            this.$http.statisticsService
                .getStudentList(this.dialogForm)
                .then(res => {
                    this.totalPage = res.data.totalPages;
                    this.totalNum = res.data.totalElements;
                    this.dialogData = Object.freeze(res.data.content);
                })
                .finally(() => {
                    this.dialogDto.loading = false;
                });
        },
        getData() {
            this.tableLoading = true;
            const params = Object.assign({}, this.form);
            params.type = params.type !== 'unFinished';
            this.$http.statisticsService
                .getStatisticList(params)
                .then(res => {
                    this.totalPage = res.data.totalPages;
                    this.totalNum = res.data.totalElements;
                    this.tableData = Object.freeze(res.data.content);
                })
                .finally(() => {
                    this.tableLoading = false;
                });
        },
        // 点击查看详情
        checkDetails(row, type = 'signed') {
            // signed 已签到  unsign 未签到
            this.dialogDto = {
                title: type === 'signed' ? '已签到列表' : '未签到列表',
                visible: true,
                loading: false,
                totalPage: 0,
                totalNum: 0,
                type
            };
            this.getDialogData();
        },
        resetForm() {
            this.form = {
                type: this.form.type,
                classesId: this.form.classesId,
                time: '',
                pageSize: this.form.pageSize,
                current: 0
            };
            this.getData();
        },
        getClassesById() {
            return this.classesOptions.find(item => item.id === this.form.classesId);
        },
        searchDialogData() {
            this.dialogForm.current = 0;
            this.getDialogData();
        },
        resetDialogForm() {
            this.dialogForm = {
                name: '',
                current: 0
            };
        },
        handleDialogChangePage(page) {
            this.dialogForm.pageSize = page.pageSize;
            this.dialogForm.current = page.currentPage - 1;
            this.getDialogData();
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
.dialog-search-box {
    display: flex;
    justify-content: flex-start;
    margin: 8px 0 15px;
}
</style>
