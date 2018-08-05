import Vue from 'vue'
import App from './App.vue'
import router from './router'

import 'material-design-icons/iconfont/material-icons.css'
import './assets/reset.css'

import { MdButton, MdMenu, MdList } from 'vue-material/dist/components'
// import VueMaterial from 'vue-material'

import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/black-green-light.css' // This line here

// Vue.use(VueMaterial)
Vue.use(MdButton)
Vue.use(MdMenu)
Vue.use(MdList)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
