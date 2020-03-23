<template>
    <div class="search-box box-style_common">
        <div>
            <h4 class="title">{{title}}</h4>
            <!-- <i class="el-icon-arrow-down el-icon--right icon-14px">展开搜索条件</i> -->
            <!-- <i>展开搜索条件<i class="el-icon-arrow-down el-icon--right icon-14px"></i></i> -->
            <el-button type="text" class="collapse-btn" @click="collapse"
                >{{ show ? '收起' : '展开搜索条件' }}<i class="el-icon-arrow-down el-icon--right icon-14px"></i
            ></el-button>
        </div>
        <el-collapse-transition>
           
          <div   v-show="show">
            <el-form ref="form" :model="form"  :label-width="labelWidth" @submit.native.prevent>
                <div class="paddingBox">
                    <div class="flexBox">
                        <slot name="input"></slot>
                    </div>
                </div>
                <div class="buttonBox" :style="{ 'padding-left': labelWidth }">
                    <slot name="button"></slot>
                </div>
            </el-form>
          </div>
             
        </el-collapse-transition>
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
        title:String
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
    margin-bottom: 12px;
}
</style>
<style scoped lang="scss">
.search-box {
    background: #e8e8e8;
    padding: 0 15px 12px;
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
.paddingBox {
    /* padding: 15px 15px 10px; */
    // margin-top: 7px;
}
.flexBox {
    display: flex;
    position: relative;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
}
</style>
