<template>
    <div>
        <p class="course-name" v-if="courseName">班级名称&nbsp;{{ courseName }}</p>
        <ul class="dialog-form-view">
            <li class="item" v-for="(item, i) of list" :key="i">
                <div class="label">{{ item.name }}</div>
                <div class="content">{{ item.value }}</div>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    data() {
        return {};
    },
    props: {
        list: {
            type: Array,
            default: () => []
        },
        courseName: String // 名称
    },
    methods: {}
};
</script>
<style scoped>
.dialog-form-view {
    list-style: none;
    line-height: 40px;
}
.dialog-form-view .item {
    display: flex;
    color: #333333;
    justify-content: flex-start;
}
.dialog-form-view .item .label {
    width: 100px;
    margin-right: 20px;
    text-align: right;
    font-size: 14px;
    color: #666666;
}
</style>
