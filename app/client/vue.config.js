module.exports = {
  transpileDependencies: ['vuetify'],
  devServer: {
    port: 3001,
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {
      '/geoserver': {
        target: process.env.GEOSERVER_BASEURL,
        changeOrigin: true
      },
      '/api': {
        target: process.env.API_URL,
        changeOrigin: true
      }
    }
  }
};
