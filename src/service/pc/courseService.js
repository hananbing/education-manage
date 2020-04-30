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
    deleteCourse: id => doDelete('/courses/' + id),
    // 获取课程下面的所有学生
    getCourseStudents: (id, params) => doGet(`/courses/${id}/students`, params),
    // 上传视频/链接/附件
    updateCourseAnnex: params => doPut(`/courses/annex`, params),
    // 老师对学生打分
    updateStudentScore: (courseId, studentId, params) => doPut(`/courses/${courseId}/user/${studentId}`, params)
};
export default { courseService };
