<template>
    <div >
        <div class="search-box-tabs">
            <slot name="tabs"></slot>
        </div>
        <!-- <el-collapse-transition> -->
        <div class="search-box box-style_common">
            <el-form ref="form" :model="form" label-width="0" @submit.native.prevent>
                <div class="paddingBox">
                    <el-row class="flexBox">
                        <slot name="input"></slot>
                        <el-col style="width:160px;">
                            <slot name="button"></slot>
                        </el-col>
                    </el-row>
                </div>
                <div class="buttonBox">
                    <slot name="rightButton"></slot>
                </div>
            </el-form>
        </div>
        <!-- </el-collapse-transition> -->
    </div>
</template>
<script>
export default {
    name: 'searchBox',
    data() {
        return {
            show: true
        };
    },
    props: {
        labelWidth: {
            type: String,
            default: '74px'
        },
        form: {
            type: Object,
            default: function() {
                return {};
            }
        },
        title: String
    },
    methods: {
        collapse() {
            this.show = !this.show;
        }
    }
};
</script>
<style>
.paddingBox .el-col {
    margin-right: 15px;
}
.paddingBox .el-form-item--small.el-form-item {
    margin-bottom: 0px;
}
.search-box-tabs .el-tabs__header{
    background: #fff;
    margin-bottom: 0;
}
.search-box-tabs{
    padding-left: 15px;
    background: #fff;
}
.search-box-tabs .el-tabs__nav-wrap::after{
    display: none
}
</style>
<style scoped lang="scss">
.search-box {
    background: #f5f5f5;
    padding: 20px 15px 20px;
    position: relative;
    .title {
        font-size: 16px;
        height: 50px;
        line-height: 50px;
        color: #262626;
        font-weight: normal;
    }
    .collapse-btn {
        position: absolute;
        right: 15px;
        bottom: 10px;
        z-index: 222;
        color: #8c8c8c;
    }
    .collapse-btn:hover {
        color: rgb(99, 97, 97);
    }
}
.flexBox {
    display: flex;
    position: relative;
    justify-content: flex-start;
    // align-items: center;
    flex-wrap: wrap;
}
.buttonBox {
    position: absolute;
    right: 15px;
    bottom: 21px;
}
</style>
