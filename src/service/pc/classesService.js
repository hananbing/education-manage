import { doGet, doPost, doPut, doDelete } from '../../axiosconfig/index.js';
const classesService = {
    // 获取班级列表 分页
    getClasses: params => doGet('/classes', params),
    // 获取所有班级列表
    getAllClasses: () => doGet('/classes/list'),
    // 通过id查询班级
    getClassesById: id => doGet('/classes/' + id),
    // 新增班级
    createClasses: params => doPost('/classes', params),
    // 修改班级
    updateClasses: params => doPut('/classes', params),
    // 删除班级
    deleteClasses: id => doDelete('/classes/' + id),
    // 添加权重
    addClassesWeight: params => doPut('/classes/weight', params)
};
export default { classesService };
