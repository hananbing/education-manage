<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#2E3331"
            text-color="#fff"
            active-text-color="#fff"
            unique-opened
            router
        >
            <template v-for="item in routes">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">{{
                                    threeItem.title
                                }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
// import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            items: [
                {
                    icon: 'iconfont iconshouye',
                    index: '/dashboard',
                    title: '系统首页'
                },
                {
                    icon: 'iconfont iconyonghuguanli',
                    index: '/user-management',
                    title: '用户管理',
                    auth: ['ROLE_ADMIN', 'ROLE_INSTRUCTOR']
                },
                {
                    icon: 'iconfont iconbanjiguanli',
                    index: '/class-management',
                    title: '班级管理',
                    auth: ['ROLE_ADMIN']
                },
                {
                    icon: 'iconfont iconkechengguanli',
                    index: '/course-management',
                    title: '课程管理',
                    auth: ['ROLE_INSTRUCTOR']
                },
                // {
                //     icon: 'iconfont iconzuoyeguanli',
                //     index: '/homework-management',
                //     title: '作业管理',
                //     auth: ['ROLE_INSTRUCTOR', 'ROLE_EXPERT']
                // },
                // {
                //     icon: 'iconfont iconhuatitaolun',
                //     index: '/topic-management',
                //     title: '话题讨论',
                //     auth: ['ROLE_INSTRUCTOR', 'ROLE_EXPERT']
                // },
                // {
                //     icon: 'iconfont iconziyuanguanli',
                //     index: '/resources-management',
                //     title: '资源管理',
                //     auth: ['ROLE_INSTRUCTOR', 'ROLE_EXPERT']
                // },
                // {
                //     icon: 'iconfont iconxueqingtongji',
                //     index: '/statistics-management',
                //     title: '学情统计',
                //     auth: ['ROLE_ADMIN']
                // }
            ]
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path;
        },
        routes() {
            const roles = JSON.parse(sessionStorage.userInfo).authorities || [];
            return this.items.filter(item => {
                return roles.some(role => {
                    return !item.auth ? true : item.auth.includes(role);
                });
            });
        }
    },
    created() {}
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 60px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
