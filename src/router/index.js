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
export default new Router({
    routes
});
