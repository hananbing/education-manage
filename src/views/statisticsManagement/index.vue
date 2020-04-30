<template>
    <div>
        <search-box :form="form">
            <template slot="tabs">
                <el-tabs v-model="form.type" @tab-click="searchData">
                    <el-tab-pane label="成绩统计" name="study"></el-tab-pane>
                    <el-tab-pane label="考勤统计" name="attendance"></el-tab-pane>
                    <el-tab-pane label="学情统计" name="learningEmotion"></el-tab-pane>
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
                <el-col :span="4" v-show="form.type === 'attendance'">
                    <el-form-item>
                        <el-date-picker v-model.number="form.time" type="date" value-format="timestamp" placeholder="选择日期" style="width:100%">
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
            <vxe-table stripe highlight-hover-row size="medium" show-header-overflow show-overflow :data="tableData" :max-height="tableMaxHeight">
                <template v-if="form.type === 'study'">
                    <vxe-table-column field="studentName" title="姓名" key="study1"> </vxe-table-column>
                    <vxe-table-column field="totalScore" title="总分" key="study2"> </vxe-table-column>
                    <vxe-table-column field="signScore" title="签到得分" key="study3"> </vxe-table-column>
                    <vxe-table-column field="onlineScore" title="在线学习得分" key="study4"> </vxe-table-column>
                    <vxe-table-column field="courseScore" title="课程学习得分" key="study5"> </vxe-table-column>
                    <vxe-table-column field="homeworkScore" title="作业得分" key="study6"> </vxe-table-column>
                    <vxe-table-column field="topicScore" title="话题得分" key="study7"> </vxe-table-column>
                </template>
                <template v-else-if="form.type === 'attendance'">
                    <vxe-table-column title="日期" key="attendance1">
                        <template slot-scope="scope">{{ scope.row.date | formatDate }}</template>
                    </vxe-table-column>
                    <vxe-table-column title="已签到人数" key="attendance2">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="点击查看详情" placement="top">
                                <span @click="checkDetails(scope.row, true)" class="tips">{{ scope.row.signedCount }}</span>
                            </el-tooltip>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column title="未签到人数" key="attendance3">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="点击查看详情" placement="top">
                                <span @click="checkDetails(scope.row, false)" class="tips">{{ scope.row.noSignCount }}</span>
                            </el-tooltip>
                        </template>
                    </vxe-table-column>
                </template>
                <template v-else>
                    <vxe-table-column title="姓名">
                        <template slot-scope="scope">{{ scope.row.studentName }}</template>
                    </vxe-table-column>
                    <vxe-table-column title="签到">
                        <template slot-scope="scope">
                            <span class="red">{{ scope.row.SIGN }}</span>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column title="在线学习">
                        <template slot-scope="scope"
                            ><span class="red">{{ scope.row.ONLINE }}</span>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column title="课程学习">
                        <template slot-scope="scope"
                            ><span class="red">{{ scope.row.COURSE }}</span>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column title="作业">
                        <template slot-scope="scope"
                            ><span class="red">{{ scope.row.JOB }}</span>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column title="话题">
                        <template slot-scope="scope"
                            ><span class="red">{{ scope.row.TOPIC }}</span>
                        </template>
                    </vxe-table-column>
                </template>
            </vxe-table>
            <!-- <pagniation
                :currentPage="form.current"
                v-show="form.type === 'study'"
                :totalPage="totalPage"
                :totalNum="totalNum"
                @changePage="handleChangePage"
            ></pagniation> -->
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
                    v-show="form.type === 'attendance'"
                >
                    <vxe-table-column field="" title="签到时间">
                        <template slot-scope="scope">{{ scope.row.date | formatDate('yyyy-MM-dd hh:mm') }}</template>
                    </vxe-table-column>
                    <vxe-table-column field="name" title="姓名"></vxe-table-column>
                </vxe-table>
                <!-- <pagniation
                    :currentPage="dialogForm.current"
                    :totalPage="dialogDto.totalPage"
                    :totalNum="dialogDto.totalNum"
                    @changePage="handleDialogChangePage"
                ></pagniation> -->
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
                // current: 0,
                // pageSize: 30,
                classesId: '',
                time: '',
                type: 'study' // study,  attendance,  learningEmotion
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
                date: 0,
                classesId: null,
                signed: false
                // pageSize: 30,
                // current: 0
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
                    // this.totalPage = res.data.totalPages;
                    // this.totalNum = res.data.totalElements;
                    this.dialogData = Object.freeze(res.data || []);
                })
                .finally(() => {
                    this.dialogDto.loading = false;
                });
        },
        getData() {
            const serviceFn = {
                study: this.getStudyList,
                attendance: this.getStatisticList,
                learningEmotion: this.getLearningEmotion
            };
            serviceFn[this.form.type].call(this);
        },
        // 获取学习成绩列表
        getStudyList() {
            const { current, pageSize, type, time, classesId } = this.form;
            // 学习列表
            const params = {
                classesId
                // current,
                // pageSize
            };
            this.tableLoading = true;
            this.$http.statisticsService
                .getStudyList(params)
                .then(res => {
                    this.tableData = res.data || [];
                })
                .finally(() => {
                    this.tableLoading = false;
                });
        },
        // 获取考勤列表
        getStatisticList() {
            const { current, pageSize, type, time, classesId } = this.form;
            // 考情列表
            const params = {
                classesId,
                date: time
            };
            this.tableLoading = true;
            this.$http.statisticsService
                .getStatisticList(params)
                .then(res => {
                    this.tableData = res.data || [];
                })
                .finally(() => {
                    this.tableLoading = false;
                });
        },
        // 学情列表
        getLearningEmotion() {
            const { current, pageSize, type, time, classesId } = this.form;
            const params = {
                classesId
            };
            this.tableLoading = true;
            this.$http.statisticsService
                .getLearningEmotion(params)
                .then(res => {
                    this.tableData = (res.data || []).map(item => {
                        item.moduleInfo.forEach(ele => {
                            item[ele.moduleType] = ele.molecular + '/' + ele.denominator;
                        });
                        return item;
                    });
                })
                .finally(() => {
                    this.tableLoading = false;
                });
        },
        // 点击查看详情  signed = true / false
        checkDetails({ date }, signed = false) {
            this.dialogDto = {
                title: signed ? '已签到人数列表' : '未签到人数列表',
                visible: true,
                loading: false,
                totalPage: 0,
                totalNum: 0
            };
            this.dialogForm.date = date;
            this.dialogForm.signed = signed;
            this.dialogForm.classesId = this.form.classesId;
            this.resetDialogForm();
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
            this.dialogForm.name = '';
            // this.dialogForm.current = 0;
            this.getDialogData();
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
.tips {
    color: #2693ff;
    cursor: pointer;
}
.tips:hover {
    text-decoration: underline;
}
.red {
    color: #ef3f3f;
}
</style>
