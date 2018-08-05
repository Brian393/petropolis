import Vue from 'vue'
import Router from 'vue-router'
import Watershed from './views/Watershed.vue'
import Map from './components/Map.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/watershed'
    },
    {
      path: '/watershed',
      name: 'watershed',
      components: {
        default: Watershed,
        map: Map
      }
    },
    {
      path: '/megaregion',
      name: 'megaregion',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      components: {
        default: () => import('./views/Megaregion.vue'),
        map: Map
      } 
    },
    {
      path: '/bioregion',
      name: 'bioregion',
      components: {
        default: () => import('./views/Bioregion.vue'),
        map: Map
      } 
    }
  ]
})
