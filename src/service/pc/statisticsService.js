import { doGet, doPost, doPut, doDelete } from '../../axiosconfig/index.js';
const statisticsService = {
    // 获取学情列表
    getStudyList: params => doGet('/homework1', params),
    // 获取考情列表
    getStatisticList: params => doGet('/attendance', params),
    // 获取已签到，未签到人数列表
    getStudentList: params => doGet('/sign-users', params)
};
export default { statisticsService };
