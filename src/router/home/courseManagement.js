// 课程管理
export default [
    {
        path: 'course-management',
        component: () => import(/* webpackChunkName: "courseManagement" */ '@/views/courseManagement/index.vue'),
        meta: { title: '课程管理' }
    }
];
