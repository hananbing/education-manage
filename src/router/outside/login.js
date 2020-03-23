export default [
    {
        path: '/dashboard',
        component: () => import(/* webpackChunkName: "Home" */ '@/views/common/Home.vue'),
        meta: { title: '首页' }
    },
    {
        path: '/login',
        component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
        meta: { title: '登录' }
    }
];
