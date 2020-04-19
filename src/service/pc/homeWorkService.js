import { doGet, doPost, doPut, doDelete } from '../../axiosconfig/index.js';
const homeWorkService = {
    // 获取作业列表 分页
    getHomeWorkList: params => doGet('/homework', params),
    // 获取作业
    getHomeWorkById: id => doGet('/homework/' + id),
    // 新增作业
    createhomeWork: params => doPost('/homework', params),
    // 修改作业
    updatehomeWork: params => doPut('/homework', params),
    // 修改作业
    removehomeWork: id => doDelete('/homework/' + id),
    // 查询作业下面的所有学员
    getStudentByhomeWork: params => doGet('/student-homeworks', params),
    // 批改作业
    homeworkCorrecting: params => doPut('/student-homeworks', params)
};
export default { homeWorkService };
