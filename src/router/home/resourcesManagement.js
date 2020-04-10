// 课程管理
export default [
    {
        path: '/resources-management',
        name:'resourcesManagement',
        component: () => import(/* webpackChunkName: "resourcesManagement" */ '@/views/resourcesManagement/index.vue'),
        meta: { title: '资源管理' }
    },
    {
        path: '/statistics-management',
        name:'statisticsManagement',
        component: () => import(/* webpackChunkName: "resourcesManagement" */ '@/views/statisticsManagement/index.vue'),
        meta: { title: '学情统计' }
    },
    
];
