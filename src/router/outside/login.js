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
    },
    {
        path: '/resetPassword',
        component: () => import(/* webpackChunkName: "resetPassword" */ '@/views/resetPassword.vue'),
        meta: { title: '重置密码' }
    },
    {
        path: '/register',
        component: () => import(/* webpackChunkName: "register" */ '@/views/register.vue'),
        meta: { title: '注册账号' }
    }
];
