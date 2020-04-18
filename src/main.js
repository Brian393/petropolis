import './assets/reset.css'
import 'material-design-icons/iconfont/material-icons.css'
import 'vue-image-lightbox/dist/vue-image-lightbox.min.css'
import './assets/styles.css'
import VueCookies from 'vue-cookies';

import Vue from 'vue'
import VueLazyLoad from 'vue-lazyload'
import App from './App.vue'
import router from './router'
import store from './store'
import VModal from 'vue-js-modal';

Vue.use(VueLazyLoad);
Vue.use(VModal, { dialog: true });

Vue.use(VueCookies);

Vue.config.productionTip = false

export const eventBus = new Vue()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
