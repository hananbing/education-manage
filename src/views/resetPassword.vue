<template>
    <div class="login-wrap">
        <div class="header">
            <div class="header-left">
                <!-- <img src="../assets/img/logo.png" alt="logo" /> -->
                <div class="header-title">重置密码</div>
            </div>
            <div class="header-right">有账号？ <router-link to="/login" style="color:#2693FF">去登录</router-link></div>
        </div>
        <div class="ms-login">
            <!-- <div class="ms-title">继续教育平台</div> -->
            <el-form :model="param" :rules="rules" ref="resetPasswordForm" label-width="0px" class="ms-content">
                <!-- <template v-if="type === 'A'"> -->
                <el-form-item prop="phone">
                    <el-input v-model.trim="param.phone" placeholder="手机号" size="medium">
                        <el-button slot="prepend" icon="iconfont iconshoujihao"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <div class="code-box">
                        <el-input v-model.trim="param.code" size="medium"> </el-input>
                        <div class="code-img"><s-identify :code.sync="identifyCode"></s-identify></div>
                    </div>
                </el-form-item>
                <el-form-item prop="captcha">
                    <div class="captcha-box">
                        <el-input v-model.trim="param.captcha" placeholder="验证码" size="medium" style="width:199px">
                            <el-button slot="prepend" icon="iconfont iconyanzhengma"></el-button>
                        </el-input>
                        <el-button type="primary" plain :disabled="disabled" class="getCodeBtn" @click="getCode">{{
                            timer ? stepTime + 's' : '获取验证码'
                        }}</el-button>
                    </div>
                </el-form-item>
                <!-- <div class="login-btn">
                        <el-button type="primary" @click="nextStep" size="medium">下一步</el-button>
                    </div> -->
                <!-- </template> -->
                <!-- <template v-else> -->
                <el-form-item prop="newPassword">
                    <el-input v-model.trim="param.newPassword" type="password" placeholder="输入密码" size="medium">
                        <el-button slot="prepend" icon="iconfont iconmima"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="confirmNewPassword">
                    <el-input v-model.trim="param.confirmNewPassword" type="password" placeholder="再次输入密码" size="medium">
                        <el-button slot="prepend" icon="iconfont iconmima"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submit" size="medium" :loading="submitLoading">重 置</el-button>
                </div>
                <!-- </template> -->
            </el-form>
        </div>
        <!-- <div class="footer">ICP备案号 &nbsp;Copyright ©2020 &nbsp; 四川师范大学版权所有</div> -->
    </div>
</template>

<script>
import SIdentify from '@/components/identify.vue';
import { validatePhone } from '@/utils/utils.js';
export default {
    data() {
        var validateCode = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入右侧字符验证码'));
            } else if (value !== this.identifyCode) {
                callback(new Error('验证码错误'));
            } else {
                callback();
            }
        };
        var validatePassword = (rule, value, callback) => {
            if (value.length < 6) {
                callback(new Error('密码长度必须大于6位'));
            } else if (!/^[a-zA-Z0-9_]{6,}$/.test(value)) {
                callback(new Error('密码只能为数字、字母、下划线'));
            } else if (!/^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,16}$/.test(value)) {
                callback(new Error('密码必须包含数字和字母'));
            } else {
                callback();
            }
        };
        var confirmNewPassword = (rule, value, callback) => {
            if (value !== this.param.newPassword) {
                callback(new Error('两次密码输入不一致'));
            } else {
                callback();
            }
        };
        return {
            param: {
                phone: '',
                captcha: '',
                code: '',
                newPassword: '',
                confirmNewPassword: ''
            },
            type: 'A', // A 填写验证信息  B 设置密码
            identifyCode: '',
            submitLoading: false,
            rememberP: false,
            timer: null,
            disabled: false,
            stepTime: 120,
            rules: {
                phone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: validatePhone, trigger: 'blur' }
                ],
                captcha: [{ required: true, message: '请输入手机验证码', trigger: 'blur' }],
                code: { validator: validateCode, trigger: 'blur' },
                newPassword: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { validator: validatePassword, trigger: 'blur' }
                ],
                confirmNewPassword: [
                    { required: true, message: '请再次输入密码', trigger: 'blur' },
                    { validator: confirmNewPassword, trigger: 'blur' }
                ]
            }
        };
    },
    components: { SIdentify },
    methods: {
        // nextStep() {
        //     this.$refs.resetPasswordForm.validate(valid => {
        //         if (valid) {
        //             this.type = 'B';
        //         }
        //     });
        // },
        // 计时器
        countDown() {
            this.disabled = true;
            clearInterval(this.timer);
            this.timer = setInterval(() => {
                this.stepTime--;
                if (this.stepTime <= 0) {
                    this.disabled = false;
                    clearInterval(this.timer);
                    this.stepTime = 120;
                }
            }, 1000);
        },
        validateField(fields = []) {
            let errorCount = 0;
            this.$refs.resetPasswordForm.validateField(fields, valid => {
                valid && errorCount++;
            });
            return !errorCount;
        },
        getCode() {
            if (this.disabled) return;
            if (this.validateField(['phone', 'code'])) {
                this.$http.userService.getCodeByphone({ phone: this.param.phone }).then(res => {
                    this.$message({
                        message: '验证码已发送，请注意查收！',
                        type: 'success'
                    });
                    this.countDown();
                });
            }
        },
        submit() {
            this.$refs.resetPasswordForm.validate(valid => {
                if (valid) {
                    const params = {
                        login: this.param.phone,
                        captcha: this.param.captcha,
                        newPassword: this.param.newPassword
                    };
                    this.$http.userService.resetAccountPassword(params).then(() => {
                        this.$message({
                            type: 'success',
                            message: '密码重置成功'
                        });
                        this.$router.push('/login');
                    });
                }
            });
        },
        // 获取账户信息
        getAccountInfo() {
            this.$http.userService.getAccount().then(res => {
                this.$store.commit({ type: 'setUserInfo', data: res });
            });
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
    font-size: 14px;
}
.header-title {
    font-size: 30px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    height: 36px;
    color: rgba(51, 51, 51, 1);
    padding-left: 20px;
    border-left: 1px solid #d8d8d8;
    line-height: 35px;
    margin-left: 20px;
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
.captcha-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
.getCodeBtn {
    width: 92px;
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
