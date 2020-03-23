// 商品管理
export default [
    {
        path: 'class-management',
        component: () => import(/* webpackChunkName: "classManagement" */ '@/views/classManagement/index.vue'),
        meta: { title: '班级管理' }
    }
];
