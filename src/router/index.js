import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
let homeRouter = {
    path: '/',
    component: () => import(/* webpackChunkName: "home" */ '@/views/common/Home.vue'),
    redirect: '/dashboard',
    children: [
        {
            component: () => import(/* webpackChunkName: "Dashboard" */ '@/views/Dashboard.vue'),
            path: '/dashboard',
            meta: { title: '首页' }
        }
    ]
};
let routes = [
    homeRouter,
    {
        path: '/404',
        name: '404',
        component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue'),
        meta: {
            title: '404'
        }
    }
];
// 注册一级路由
const outsideRouterContext = require.context('./outside/', true, /\.js$/);
outsideRouterContext.keys().forEach(route => {
    const routerModule = outsideRouterContext(route);
    /**
     * 兼容 import export 和 require module.export 两种规范
     */
    routes = routes.concat(routerModule.default || routerModule);
});
// 注册二级 （home里面）的路由
const homeRouterContext = require.context('./home/', true, /\.js$/);
homeRouterContext.keys().forEach(route => {
    const routerModule = homeRouterContext(route);
    /**
     * 兼容 import export 和 require module.export 两种规范
     */
    homeRouter.children = homeRouter.children.concat(routerModule.default || routerModule);
});
routes = routes.concat([
    {
        path: '*',
        redirect: '/404'
    }
]);
const routeObj = new Router({
    mode: 'history',
    routes
});
export default routeObj;
// 添加拦截器
const special = ['/login'];
// 不校验token的路由
const allPermissionRouter = ['/resetPassword', '/register'];
routeObj.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    if (special.includes(to.path)) {
        sessionStorage.token = '';
        next();
    } else {
        if (!sessionStorage.token) {
            if (allPermissionRouter.includes(to.path)) {
                next();
            } else {
                new Vue().$message({
                    type: 'info',
                    message: '您还没有登录，请登录!'
                });
                next({
                    path: '/login',
                    query: {
                        redirect: decodeURIComponent(to.path) // 解决路由可能进行了16进制转义
                    }
                });
            }
        } else {
            if (to.path === '/') {
                next({
                    path: '/index'
                });
            } else {
                // 路由权限校验
                // const menuAuth = JSON.parse(sessionStorage.getItem('auth')) || []
                // console.log(menuAuth)
                // if (to.path !== '/index' && !routerPermission(menuAuth, to.path)) {
                //   return false
                // }
                next();
            }
        }
    }
});
