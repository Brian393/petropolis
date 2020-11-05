import Vue from 'vue';
import vuetify from '@/plugins/vuetify';
import './plugins/vuescroll';

import App from './App.vue';
import appStore from './store/modules/app';
import VueCookies from 'vue-cookies';
import InfoPopUp, { infoPopUpName } from './components/core/InfoPopUp.vue';
import VueLazyLoad from 'vue-lazyload';
import router from './router';
import store from './store/index';
import axios from 'axios';

require('../node_modules/ol/ol.css');
require('./assets/scss/app.scss');
require('material-design-icons/iconfont/material-icons.css');
require('vue-image-lightbox/dist/vue-image-lightbox.min.css');

Vue.config.productionTip = false;

const appSelector = '#app';
const appEl = document.querySelector('#app');
Vue.prototype.$isEmbedded = appEl.hasAttribute('embedded');

Vue.use(VueLazyLoad);
Vue.use(VueCookies);
Vue.component(infoPopUpName, InfoPopUp);

const getIcons = axios.get('./api/icons');
const getSidebarHtml = axios.get('./api/html');
axios
  .all([getSidebarHtml, getIcons])
  .then(
    axios.spread((...responses) => {
      const sidebarHtml = responses[0];
      const postIcons = responses[1];
      if (sidebarHtml.data) {
        appStore.state.sidebarHtml = sidebarHtml.data;
      }
      if (postIcons.data) {
        appStore.state.postIcons = postIcons.data;
      }
    })
  )
  .catch(() => {
    // react on errors.
  });

// App Configuration
// eslint-disable-next-line no-undef
fetch('./static/app-conf.json')
  .then(function(response) {
    if (response.status !== 200) {
      console.log(
        'Looks like there was a problem. Status Code: ' + response.status
      );
      return;
    }

    // Examine the text in the response
    response.json().then(function(data) {
      // Make app config accessible for all components
      Vue.prototype.$appConfig = data;
      new Vue({
        router,
        store,
        vuetify,
        render: h => h(App)
      }).$mount('#app');
    });
  })
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });

export { appSelector };
