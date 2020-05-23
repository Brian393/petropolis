module.exports = {
  transpileDependencies: ['vuetify'],
  devServer: {
    port: 3000,
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {
      '/geoserver': {
        target: process.env.GEOSERVER_BASEURL,
        changeOrigin: true
      }
    }
  }
};
