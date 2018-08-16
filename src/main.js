import './assets/reset.css'
import 'material-design-icons/iconfont/material-icons.css'
import './assets/styles.css'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
