import { doGet, doPost, doPut, doDelete } from '../../axiosconfig/index.js';
const courseService = {
    // 获取所有课程列表
    getAllCourses: params => doGet('/courses', params),
    // 通过id查询课程
    getCourseById: id => doGet('/courses/' + id),
    // 新增课程
    createCourse: params => doPost('/courses', params),
    // 修改课程
    updateCourse: params => doPut('/courses', params),
    // 删除课程
    deleteCourse: id => doDelete('/courses/' + id)
};
export default { courseService };