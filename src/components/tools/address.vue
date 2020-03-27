<template>
    <el-cascader :props="props" v-model="data" filterable separator="-" style="width:100%" ></el-cascader>
</template>
<script>
let id = 0;
export default {
    data() {
        return {
            data: [],
            props: {
                lazy: true,
                lazyLoad: this.lazyLoad
            }
        };
    },
    props: ['value'],
    watch: {
        value(val) {
            this.data = val
        },
        data(val) {
            // const d = val.map(item => item);
            // console.log(d)
            this.$emit('input', val);
        }
    },
    methods: {
        lazyLoad(node, resolve) {
            const { level, data } = node;
            setTimeout(() => {
                const nodes = Array.from({ length: level + 1 }).map(item => ({
                    value: ++id,
                    label: `选项${id}`,
                    leaf: level >= 2
                }));
                // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                resolve(nodes);
            }, 10);
            // this.$http.commonService.getChildrenAddress({ parentId: !level ? 'ZONE' : data.value }).then(res => {
            //     // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            //     const nodes = res.data.map(item => ({ label: item.codeId, value: item.name, leaf: level >= 2 }));
            //     resolve(nodes);
            // });
        },
    }
};
</script>
<style scoped></style>
