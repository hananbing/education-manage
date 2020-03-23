module.exports = {
    publicPath: '/',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        open: true, //是否自动弹出浏览器页面
        // proxy: {
        //     '/api':{
        //         target:'http://192.168.1.200:7077/backend/api/',
        //         changeOrigin:true,
        //         pathRewrite:{
        //             '^/api':''
        //         }
        //     }
        // }
    }
};

