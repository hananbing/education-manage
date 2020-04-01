import { doGet, doPost, doPut, doDelete } from '../../axiosconfig/index.js';
const userService = {
    // 获取所有用户列表
    getAllUsers: params => doGet('/users', params),
    // 新增用户
    createUser: params => doPost('/users', params),
    // 修改用户
    updateUser: params => doPut('/users', params),
    // 删除用户
    removeUser: phone => doDelete('/users/' + phone),
    // 获取账户信息
    getAccount: () => doGet('/account'),
    // 修改密码
    updateAccountPassword: () => doPost('/account/change-password'),
    // 重置密码
    resetAccountPassword: () => doPost('/account/reset-password'),
    // 获取验证码
    getCode: (params) => doGet('/account/captcha', params),
    // 注册账号
    createAccount: (params) => doPost('/account/register', params),
};
export default { userService };
