import { doGet, doPost, doPut, doDelete } from '../../axiosconfig/index.js';
const homeWorkService = {
    // 获取班级列表 分页
    getHomeWorkList: params => doGet('/work', params),



    // 获取作业下面的所有学员
    getStudentsByWork: params => doGet('/work', params)
};
export default { homeWorkService };
