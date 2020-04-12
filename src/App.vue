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
    mounted() {
        let winHeight;
        if (window.innerHeight) {
            winHeight = window.innerHeight;
        } else if (document.body && document.body.clientHeight) {
            winHeight = document.body.clientHeight;
        }
        this.$store.commit({ type: 'setwinHeight', val: winHeight });
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
/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
    transition: all 0.3s;
}

.fade-transform-enter {
    opacity: 0;
    transform: translateX(-20px);
}

.fade-transform-leave-to {
    opacity: 0;
    transform: translateX(20px);
}
.search-box .el-date-editor--daterange.el-input__inner {
    width: 240px !important;
}
.el-message {
    min-width: initial !important;
    background: #fff !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 10px 16px;
    border-radius: 4px;
    border:none !important;
    pointer-events: all;
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
 
.course-name,.classes-name {
    color: #333;
    font-family: Microsoft YaHei;
    font-weight: bold;
    margin-bottom: 7px;
}
.ms-login .el-button i{
    margin-right: 0;
    font-size: 15px;
    color: #2E8661;
}
</style>
