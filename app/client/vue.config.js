module.exports = {
//  baseUrl: '/',
//  productionSourceMap: false,
  runtimeCompiler: true, // https://codewithhugo.com/vue-warn-runtime-only-build/
  chainWebpack: config => { // https://github.com/vuejs/vue-cli/issues/1669
    config.plugin('html').tap(args => {
      args[0].chunksSortMode = 'none'
      return args
    })
  }
}
