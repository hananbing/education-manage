<template>
    <div class="page-box">
        <div class="title-box">
            <p class="welcome">欢迎使用</p>
            <p class="title">中小学教师继续教育培训平台</p>
        </div>
    </div>
</template>
<script>
export default {};
</script>
<style scoped lang="scss">
.page-box {
    height: 100%;
    width: 100%;
    background-image: url(../assets/img/login-bg.jpg);
    background-size: cover;
    overflow: hidden;
    .title-box {
        margin-top: 200px;
        text-align: center;
        color: #999999;
        font-family: SimSun;
        font-weight: bold;
        line-height: 72px;
        font-size: 28px;
        .title {
            color: #333;
            font-size: 36px;
            font-family: SimSun;
        }
    }
}
</style>
