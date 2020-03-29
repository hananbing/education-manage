<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<script>
export default {
    created() {
        if (sessionStorage.getItem('token')) {
            this.getAccountInfo();
        }
    },
    methods: {
        // 获取账户信息
        getAccountInfo() {
            this.$http.userService.getAccount().then(res => {
                this.$store.commit({ type: 'setUserInfo', data: res });
            });
        }
    }
};
</script>
<style>
@import './style/icon/iconfont.css'; /*iconfont字体图标*/
@import './style/main.css';
.search-box .el-date-editor--daterange.el-input__inner {
    width: 240px !important;
}
/* 弹框中的表单样式 */
.dialog-form-box {
    padding: 15px 15px 0;
}
.dialog-form-view {
    list-style: none;
    line-height: 40px;
}
.dialog-form-view .item {
    display: flex;
    color: #333333;
    justify-content: flex-start;
}
.dialog-form-view .item .label {
    width: 100px;
    margin-right: 20px;
    text-align: right;
    font-size: 14px;
    color: #666666;
}
/* 菜单样式修改 */
.el-menu-item.is-active {
    background-color: #276e51 !important;
}
/* vxe-table 样式修改 */
.vxe-table.size--small .vxe-body--column:not(.col--ellipsis) {
    padding: 4px 0 !important;
}
.vxe-table.size--medium .vxe-body--column:not(.col--ellipsis) {
    padding: 8px 0 !important;
}

.course-name {
    color: #333;
    font-family: Microsoft YaHei;
    font-weight: bold;
    margin-bottom: 7px;
}
</style>
