<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content-box" :class="{ 'content-collapse': collapse }">
            <!-- <v-tags></v-tags> -->
            <div class="content">
                <transition name="move" mode="out-in">
                    <keep-alive :include="tagsList">
                        <router-view></router-view>
                    </keep-alive>
                </transition>
                <el-backtop target=".content"></el-backtop>
            </div>
        </div>
    </div>
</template>

<script>
import vHead from './Header.vue';
import vSidebar from './Sidebar.vue';
// import bus from './bus';
export default {
    data() {
        return {
            tagsList: [],
            collapse: false
        };
    },
    components: {
        vHead,
        vSidebar
    },
    created() {
        // bus.$on('collapse-content', msg => {
        //     this.collapse = msg;
        // });
        // // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
        // bus.$on('tags', msg => {
        //     let arr = [];
        //     for (let i = 0, len = msg.length; i < len; i++) {
        //         msg[i].name && arr.push(msg[i].name);
        //     }
        //     this.tagsList = arr;
        // });
        // this.getAllClassesData();
    },
    methods: {
        // getAllClassesData() {
        //     this.$http.classesService.getAllClasses().then((res) => {
        //         this.$store.commit({
        //             type: 'setClassesData',
        //             val: res.data
        //         });
        //         // const first = res.data[0];
        //         // this.form.classesId = first ? first.id : '';
        //     });
        // }
    }
};
</script>
<style lang="scss" scoped>
.content-box {
    position: absolute;
    left: 250px;
    right: 0;
    top: 60px;
    bottom: 0;
    // padding: 15px;
    -webkit-transition: left 0.3s ease-in-out;
    transition: left 0.3s ease-in-out;
    background: #f5f5f5;
}

.content {
    width: auto;
    height: 100%;
    /* padding: 10px; */
    overflow-y: auto;
    box-sizing: border-box;
}
</style>
