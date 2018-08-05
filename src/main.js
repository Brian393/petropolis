import Vue from 'vue'
import App from './App.vue'
import router from './router'

require('material-design-icons/iconfont/material-icons.css')
require('./assets/reset.css')

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
