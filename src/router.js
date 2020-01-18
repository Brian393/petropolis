import Vue from 'vue'
import Router from 'vue-router'
import WatershedAcknowledgement from './views/watershed/WatershedAcknowledgement.vue'
import MapWatershed from './components/MapWatershed.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/walkaboutit/2020'
    },
    {
      path: '/walkaboutit/2020',
      name: 'watershedAcknowledgement',
      components: {
        default: WatershedAcknowledgement,
        map: MapWatershed
      }
    },
    {
      path: '/walkabout/previous',
      name: 'watershedIntroduction',
      components: {
        default: () => import('./views/watershed/WatershedIntroduction.vue'),
        map: MapWatershed
      }
    }
  ]
})
