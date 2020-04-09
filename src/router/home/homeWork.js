// 班级管理
export default [
    {
        path: 'homework-management',
        name: 'homeWork',
        component: () => import(/* webpackChunkName: "homeWork" */ '@/views/homeWork/index.vue'),
        meta: { title: '作业管理' }
    }
];
