<template>
    <div class="box">
        <el-form label-position="right" label-width="75px" v-model="auditForm">
            <el-form-item label="订单编号">
                <!-- <el-input v-model="data.orderNo" disabled></el-input> -->
                <div class="list">{{ data.orderNo }}</div>
                <el-button type="text" class="check-btn">查看预约信息</el-button>
            </el-form-item>
            <el-form-item label="下单时间">
                <div class="list">{{ data.orderNo }}</div>
            </el-form-item>
            <el-form-item label="订单状态">
                <div class="list">{{ data.orderNo }}</div>
            </el-form-item>
            <el-form-item label="用户ID">
                <div class="list">{{ data.orderNo }}</div>
            </el-form-item>
            <el-form-item label="商品列表"> </el-form-item>
            <el-form-item label="支付时间">
                <div class="list">{{ data.orderNo }}</div>
            </el-form-item>
            <el-form-item label="优惠券">
                <div class="list">{{ data.orderNo }}</div>
            </el-form-item>
            <el-form-item label="订单金额">
                <div class="list">{{ data.orderNo }}</div>
            </el-form-item>
            <!-- 已付款 -->
            <template>
                <el-form-item label="支付金额">
                    <div class="list">{{ data.orderNo }}</div>
                </el-form-item>
                <el-form-item label="支付编号">
                    <div class="list">{{ data.orderNo }}</div>
                </el-form-item>
            </template>
            <!-- 已取消 -->
            <template>
                <el-form-item label="取消时间">
                    <div class="list">{{ data.orderNo }}</div>
                </el-form-item>
                <el-form-item label="取消原因">
                    <div class="list">{{ data.orderNo }}</div>
                </el-form-item>
            </template>
            <!-- 已取消 -->
            <template>
                <el-form-item label="申请退款时间">
                    <div class="list">{{ data.orderNo }}</div>
                </el-form-item>
                <el-form-item label="退款原因">
                    <div class="list">{{ data.orderNo }}</div>
                </el-form-item>
                <el-form-item label="退款审核结果">
                    <div class="list">{{ data.orderNo }}</div>
                </el-form-item>
                <el-form-item label="审核备注">
                    <div class="list">{{ data.orderNo }}</div>
                </el-form-item>
                <el-form-item label="退款金额">
                    <div class="list">{{ data.orderNo }}</div>
                </el-form-item>
            </template>
            <!-- 审核 -->
            <template>
                <el-form-item label="申请退款时间">
                    <div class="list">{{ data.orderNo }}</div>
                </el-form-item>
                <el-form-item label="退款原因">
                    <div class="list">{{ data.orderNo }}</div>
                </el-form-item>
                <el-form-item label="退款审核结果">
                    <el-button-group>
                        <el-radio-group v-model="auditForm.auditState">
                            <el-radio-button label="1">通过</el-radio-button>
                            <el-radio-button label="2">不通过</el-radio-button>
                        </el-radio-group>
                    </el-button-group>
                </el-form-item>
                <el-form-item label="退款金额" >
                    <el-input-number v-model="auditForm.moeny" :min="0" :controls="false"></el-input-number>
                </el-form-item>
                <el-form-item label="审核备注">
                    <el-input
                        v-model="auditForm.remark"
                        type="textarea"
                        placeholder="请输入内容"
                        :autosize="{ minRows: 2, maxRows: 4 }"
                    ></el-input>
                </el-form-item>
            </template>
            <!-- 已关闭 -->
            <template>
                <el-form-item label="关闭时间">
                    <div class="list">{{ data.orderNo }}</div>
                </el-form-item>
                <el-form-item label="关闭原因">
                    <div class="list">{{ data.orderNo }}</div>
                </el-form-item>
            </template>
        </el-form>
    </div>
</template>
<script>
export default {
    data() {
        return {
            data: {
                orderNo: 'e2342342342435242'
            },
            auditForm: {
                auditState: '1', // 是否通过不通过
                remark: '', //备注
                moeny: undefined // 退款金额
            },

            orderState: '' // 订单状态
        };
    },

    methods: {}
};
</script>
<style>
.check-btn {
    position: absolute;
    left: 400px;
    top: 0px;
}
</style>
<style scoped lang="scss">
.list {
    height: 30px;
    line-height: 30px;
    background: #f5f5f5;
    border: 1px solid #e0e0e0;
    padding: 0 15px;
    border-radius: 5px;
    font-size: 13px;
    width: 360px;
}
</style>
