// 班级管理
export default [
    {
        path: 'user-management',
        component: () => import(/* webpackChunkName: "userManagement" */ '@/views/userManagement/index.vue'),
        meta: { title: '用户管理' }
    },
    {
        path: 'class-management',
        component: () => import(/* webpackChunkName: "classManagement" */ '@/views/classManagement/index.vue'),
        meta: { title: '班级管理' }
    }
];
