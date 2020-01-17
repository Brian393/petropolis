import Vue from 'vue'
import Router from 'vue-router'
import WatershedAcknowledgement from './views/watershed/WatershedAcknowledgement.vue'
import MapWatershed from './components/MapWatershed.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/watershed/acknowledgement'
    },
    {
      path: '/watershed/acknowledgement',
      name: 'watershedAcknowledgement',
      components: {
        default: WatershedAcknowledgement,
        map: MapWatershed
      }
    },
    {
      path: '/watershed/introduction',
      name: 'watershedIntroduction',
      components: {
        default: () => import('./views/watershed/WatershedIntroduction.vue'),
        map: MapWatershed
      }
    }
  ]
})
