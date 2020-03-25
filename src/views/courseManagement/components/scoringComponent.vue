<template>
    <el-dialog title="打分列表" :visible.sync="visible" @close="closeDialog" :close-on-click-modal="false" width="600px">
        <p class="course-name">课程名称:&nbsp;{{ courseName }}</p>
        <vxe-table :data="tableData" stripe highlight-hover-row size="small" :loading="tableLoading" ref="courseTable">
            <vxe-table-column field="name" title="学员姓名" width="140"></vxe-table-column>
            <vxe-table-column field="name" title="得分">
                <template v-slot="{ row }">
                    <el-slider v-model="row.score"></el-slider>
                </template>
            </vxe-table-column>
            <vxe-table-column field="name" width="80">
                <template v-slot="{ row }">
                    <div class="score-box">
                        <span class="score">{{ row.score }}</span>
                        <el-button type="text">保存</el-button>
                    </div>
                </template>
            </vxe-table-column>
        </vxe-table>
        <pagniation :currentPage="form.current" :totalPage="totalPage" :totalNum="totalNum" @changePage="handleChangePage"></pagniation>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">关 闭</el-button>
            <!-- <el-button type="primary" @click="saveData">确 定</el-button> -->
        </span>
    </el-dialog>
</template>
<script>
export default {
    data() {
        return {
            form: {
                current: 0,
                pageSize: 30
            },
            visible: false,
            courseName: null,
            courseId: null,
            totalPage: 0,
            totalNum: 0,
            tableData: [
                { name: '张三', score: 0 },
                { name: '张三', score: 6 },
                { name: '张三', score: 6 }
            ],
            tableLoading: false
        };
    },
    methods: {
        openDialog(id, courseName) {
            this.courseName = courseName;
            this.courseId = id;
            this.visible = true;
            this.getData();
        },
        saveData() {},
        closeDialog() {
            this.tableData = [];
        },
        getData() {},
        handleChangePage(page) {
            this.form.pageSize = page.pageSize;
            this.form.current = page.currentPage - 1;
            this.getData();
        }
    }
};
</script>
<style scoped lang="scss">
.score-box {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .score {
        display: block;
        width: 50px;
        color: #4d4d4d;
    }
}
</style>
