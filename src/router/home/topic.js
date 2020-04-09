// 班级管理
export default [
    {
        path: 'topic-management',
        name: 'topicManagement',
        component: () => import(/* webpackChunkName: "homeWork" */ '@/views/topicDiscussion/index.vue'),
        meta: { title: '话题列表', auth: ['ROLE_EXPERT', 'ROLE_INSTRUCTOR'] }
    },
    {
        path: 'topic-details/:id',
        name: 'topicDetails',
        component: () => import(/* webpackChunkName: "topicDetails" */ '@/views/topicDiscussion/topicDetails.vue'),
        meta: { title: '话题详情', auth: ['ROLE_EXPERT', 'ROLE_INSTRUCTOR'] }
    }
];
