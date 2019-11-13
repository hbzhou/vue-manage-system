module.exports = {
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        port: 3000,
        open: true,
        host: 'localhost',
        https: false,
        proxy: {//配置跨域
            [process.env.VUE_APP_BASE_API]: {
                target: 'http://localhost:8011/',
                changeOrigin: true,
                pathRewrite: {
                    ['^' + process.env.VUE_APP_BASE_API]: ''
                }
            }
        }
    }

}
