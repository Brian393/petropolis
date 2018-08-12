import Vue from 'vue'
import Router from 'vue-router'
import WatershedIntroduction from './views/watershed/WatershedIntroduction.vue'
import Map from './components/Map.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/watershed/introduction'
    },
    {
      path: '/watershed/introduction',
      name: 'watershedIntroduction',
      components: {
        default: WatershedIntroduction,
        map: Map
      }
    },
    {
      path: '/watershed/terminals',
      name: 'watershedTerminals',
      components: {
        // route level code-splitting
        // this generates a separate chunk (watershed.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        default: () => import('./views/watershed/WatershedTerminals.vue'),
        map: Map
      }
    },
    {
      path: '/watershed/dams',
      name: 'watershedDams',
      components: {
        default: () => import('./views/watershed/WatershedDams.vue'),
        map: Map
      }
    },
    {
      path: '/megaregion/introduction',
      name: 'megaregion',
      components: {
        default: () => import('./views/megaregion/MegaregionIntroduction.vue'),
        map: Map
      }
    },
    {
      path: '/bioregion/introduction',
      name: 'bioregion',
      components: {
        default: () => import('./views/bioregion/BioregionIntroduction.vue'),
        map: Map
      }
    }
  ]
})
