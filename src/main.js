import './assets/reset.css'
import 'material-design-icons/iconfont/material-icons.css'
import 'vue-image-lightbox/dist/vue-image-lightbox.min.css'
import './assets/styles.css'
import VueCookies from 'vue-cookies'
import InfoPopUp, {infoPopUpName} from './components/InfoPopUp'

import Vue from 'vue'
import VueLazyLoad from 'vue-lazyload'
import App from './App.vue'
import router from './router'
import store from './store'
import VModal from 'vue-js-modal'

const appSelector = '#app'

Vue.use(VueLazyLoad)
Vue.use(VueLazyLoad)
Vue.use(VModal, { dialog: true,
  dynamic: true,
  dynamicDefaults: { clickToClose: false }
})

Vue.component(infoPopUpName, InfoPopUp)

Vue.use(VueCookies)

Vue.use(VueLazyLoad)

Vue.config.productionTip = false

export const eventBus = new Vue()

// App Configuration
fetch('./static/app-conf.json')
  .then(function (response) {
    if (response.status !== 200) {
      console.log(
        'Looks like there was a problem. Status Code: ' + response.status
      )
      return
    }

    // Examine the text in the response
    response.json().then(function (data) {
    // Make app config accessible for all components
      Vue.prototype.$appConfig = data
    })
  })
  .catch(function (err) {
    console.log('Fetch Error :-S', err)
  })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

export {appSelector}
