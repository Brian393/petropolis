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
      name: 'watershed',
      components: {
        default: WatershedIntroduction,
        map: Map,
        props: { subitem: 'introduction' }
      }
    },
    {
      path: '/watershed/terminals',
      name: 'watershed',
      components: {
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        default: () => import('./views/watershed/WatershedTerminals.vue'),
        map: Map,
        props: { subitem: 'terminals' }
      }
    },
    {
      path: '/watershed/dams',
      name: 'watershed',
      components: {
        default: () => import('./views/watershed/WatershedDams.vue'),
        map: Map,
        props: { subitem: 'dams' }
      }
    },
    {
      path: '/megaregion/introduction',
      name: 'megaregion',
      components: {
        default: () => import('./views/megaregion/MegaregionIntroduction.vue'),
        map: Map,
        props: { subitem: 'introduction' }
      }
    },
    {
      path: '/bioregion/:subitem',
      name: 'bioregion',
      components: {
        default: () => import('./views/bioregion/BioregionIntroduction.vue'),
        map: Map,
        props: { subitem: 'introduction' }
      }
    }
  ]
})
