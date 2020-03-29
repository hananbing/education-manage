<template>
    <div class="header">
        <div class="header-left">
            <div class="logo">体检后台管理中心</div>
        </div>
        <div class="header-right">
            <div class="title">体检后台管理中心</div>
            <div class="header-user-con">
                <!-- 用户头像 -->
                <div class="user-avator">
                    <el-avatar size="small" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
                    <span class="user-name">欢迎你, {{ username }}</span>
                </div>
                <!-- 退出系统 -->
                <i class="login-out iconfont icontuichuxitong" @click="loginOut" title="退出"></i>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            name: 'xxxxx'
        };
    },
    computed: {
        username() {
            let username = this.$store.state.Jurisdiction.userInfo.name || this.name;
            return username;
        }
    },
    methods: {
        loginOut() {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('userInfo');
            this.$router.push('/login');
        }
    }
};
</script>
<style scoped lang="scss">
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 60px;
    font-size: 22px;
    color: #fff;
    background-color: #276e51;
    display: flex;
    .header-left {
        width: 250px;
        background-color: #2e3331;
    }
    .header-right {
        display: flex;
        flex-grow: 1;
        justify-content: space-between;
        align-items: center;
        padding: 0 50px 0 20px;
        .header-user-con {
            display: flex;
            height: 60px;
            align-items: center;
            .user-avator {
                display: flex;
                align-items: center;
                font-size: 14px;
                .user-name {
                    margin-left: 8px;
                }
            }
            .login-out {
                margin-left: 25px;
                cursor: pointer;
            }
        }
    }
}
.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
}
.header .logo {
    float: left;
    width: 250px;
    line-height: 60px;
}
.header-right {
    float: right;
    padding-right: 50px;
}
</style>
