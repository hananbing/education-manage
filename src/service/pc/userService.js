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
    updateAccountPassword: () => doPost('/account/change-password')
};
export default { userService };