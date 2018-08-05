import './assets/reset.css'
import Vue from 'vue'
import App from './App.vue'
import router from './router'

import 'material-design-icons/iconfont/material-icons.css'
import { MdButton, MdMenu, MdList } from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/black-green-light.css' // This line here

Vue.use(MdButton)
Vue.use(MdMenu)
Vue.use(MdList)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
