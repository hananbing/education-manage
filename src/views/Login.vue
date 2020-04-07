<template>
    <div class="login-wrap">
        <div class="header">
            <div class="header-left">
                <!-- <img src="../assets/img/logo.png" alt="logo" /> -->
                <!-- <div class="header-title">注册</div> -->
            </div>
            <div class="header-right">没有账号？ <router-link to="/register" style="color:#2693FF">去注册</router-link></div>
        </div>
        <div class="ms-login">
            <!-- <div class="ms-title">继续教育平台</div> -->
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="手机号" size="medium">
                        <el-button slot="prepend" icon="iconfont iconshoujihao"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="param.password" size="medium" @keyup.enter.native="submitForm()">
                        <el-button slot="prepend" icon="iconfont iconmima"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <div class="code-box">
                        <el-input placeholder="验证码" v-model="param.code" size="medium" @keyup.enter.native="submitForm()"> </el-input>
                        <div class="code-img"><s-identify :code.sync="identifyCode"></s-identify></div>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-model="rememberP">记住用户</el-checkbox>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()" size="medium" :loading="submitLoading">登录</el-button>
                </div>
                <p class="login-tips"><el-link @click="$router.push('/resetPassword')">忘记密码</el-link></p>
            </el-form>
        </div>
        <!-- <div class="footer">ICP备案号 &nbsp;Copyright ©2020 &nbsp; 四川师范大学版权所有</div> -->
    </div>
</template>

<script>
import CryptoJS from 'crypto-js';
import SIdentify from '@/components/identify.vue';
export default {
    data() {
        var validateCode = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入验证码'));
            } else if (value !== this.identifyCode) {
                callback(new Error('验证码错误'));
            } else {
                callback();
            }
        };
        return {
            param: {
                username: '13812345678',
                password: 'admin',
                code: ''
            },
            identifyCode: '',
            submitLoading: false,
            rememberP: false,
            rules: {
                username: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                code: { validator: validateCode, trigger: 'blur' }
            }
        };
    },
    created() {
        if (localStorage._userInfo) {
            if (new Date().getTime() - JSON.parse(localStorage._userInfo).createdTime > 86400 * 7 * 1000) {
                localStorage.removeItem('_userInfo');
            } else {
                this.param.username = JSON.parse(localStorage._userInfo)._u;
                this.param.password = CryptoJS.AES.decrypt(JSON.parse(localStorage._userInfo)._p, 'sichuanshifandaxue').toString(
                    CryptoJS.enc.Utf8
                );
                this.rememberP = true;
            }
        }
    },
    components: { SIdentify },
    methods: {
        submitForm() {
            this.$refs.login.validate(valid => {
                if (valid) {
                    this.submitLoading = true;
                    this.$http.loginService
                        .login(this.param)
                        .then(res => {
                            this.$message.success('登录成功');
                            sessionStorage.setItem('token', res.id_token);
                            this.getAccountInfo();
                            this.RememberUserMesg();
                            this.$router.push('/');
                        })
                        .finally(() => {
                            this.submitLoading = false;
                        });
                }
            });
        },
        // 获取账户信息
        getAccountInfo() {
            this.$http.userService.getAccount().then(res => {
                this.$store.commit({ type: 'setUserInfo', data: res.data });

            });
        },
        RememberUserMesg() {
            //七天过期
            if (!this.rememberP && localStorage._userInfo) {
                localStorage.removeItem('_userInfo');
            } else if (this.rememberP) {
                if (localStorage._userInfo) {
                    localStorage._userInfo = JSON.stringify({
                        _u: this.param.username,
                        _p: CryptoJS.AES.encrypt(this.param.password, 'sichuanshifandaxue').toString()
                    });
                } else {
                    localStorage._userInfo = JSON.stringify({
                        _u: this.param.username,
                        _p: CryptoJS.AES.encrypt(this.param.password, 'sichuanshifandaxue').toString(),
                        createdTime: new Date().getTime()
                    });
                }
            }
        }
    }
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100vh;
    background: url('../assets/img/login-bg.jpg') no-repeat center;
    background-size: cover;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    color: #fff;
    font-size: 32px;
    font-family: FZCuHeiSongS-B-GB;
    font-weight: 400;
    color: rgba(77, 77, 77, 1);
}
.header {
    height: 94px;
    padding: 20px;
    display: flex;
    width: 100%;
    overflow: hidden;
    box-sizing: border-box;
    align-items: center;
    justify-content: space-between;
}
.header-left {
    display: flex;
    align-items: center;
}

.header-left {
    font-size: 16px;
}
.header-right {
    color: #666666;
}
.footer {
    position: absolute;
    bottom: 30px;
    width: 100%;
    color: #666666;
    font-size: 13px;
    text-align: center;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 440px;
    margin: -215px 0 0 -175px;
    border-radius: 5px;
    overflow: hidden;
}
.code-box {
    display: flex;
    justify-content: space-between;
}
.code-img {
    width: 133px;
    text-align: center;
    margin-left: 10px;
    background: #fff;
    border-radius: 3px;
    line-height: 36px;
    height: 36px;
}
.ms-content {
    padding: 30px 70px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    margin-top: 15px;
    text-align: center;
}
</style>
