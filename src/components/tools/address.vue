<template>
    <el-cascader :props="props" v-model="data" filterable separator="-" style="width:100%" ref="cascader"></el-cascader>
</template>
<script>
export default {
    data() {
        return {
            data: [],
            props: {
                value: 'label',
                lazy: true,
                lazyLoad: this.lazyLoad
            }
        };
    },
    props: ['value'],
    watch: {
        value: {
            handler(val) {
                this.data = val;
                // 编辑时设置显示值
                setTimeout(() => {
                    this.$refs.cascader.presentText = val.join('-');
                }, 50);
            },
            immediate:true,
        },
        data(val) {
            this.$emit('input', val);
        }
    },
    methods: {
        lazyLoad(node, resolve) {
            const { level, data } = node;
            this.$http.commonService.getChildrenAddress({ parentId: !level ? 'ZONE' : data.value }).then(res => {
                // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                const nodes = res.data.map(item => ({ label: item.name, value: item.codeId, leaf: level >= 2 }));
                resolve(nodes);
            });
        }
    }
};
</script>
<style scoped></style>
