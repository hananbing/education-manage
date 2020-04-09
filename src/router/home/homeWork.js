// 班级管理
export default [
    {
        path: 'homework-management',
        name: 'homeWork',
        component: () => import(/* webpackChunkName: "homeWork" */ '@/views/homeWork/index.vue'),
        meta: { title: '作业管理', auth: ['ROLE_EXPERT', 'ROLE_INSTRUCTOR'] }
    },
    {
        path: 'homework-correcting/:id',
        name: 'homeworkCorrecting',
        component: () => import(/* webpackChunkName: "homeworkCorrecting" */ '@/views/homeWork/homeworkCorrecting.vue'),
        meta: { title: '批改作业', auth: ['ROLE_EXPERT', 'ROLE_INSTRUCTOR'] }
    }
];
