module.exports = {
    publicPath: '/',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        open: true, //是否自动弹出浏览器页面
        proxy: {
            '/api':{
                target:'http://39.107.205.183:8080/api',
                changeOrigin:true,
                pathRewrite:{
                    '^/api':''
                }
            }
        }
    }
};

