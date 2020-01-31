import Vue from 'vue'
import Router from 'vue-router'
import PetropolisPipelines from './views/petropolis/PetropolisPipelines.vue'
import MapPetropolis from './components/MapPetropolis.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/petropolis/Pipelines'
    },
    {
      path: '/petropolis/Pipelines',
      name: 'petropolisPipelines',
      components: {
        default: PetropolisPipelines,
        map: MapPetropolis
      }
    },
    {
      path: '/petropolis/tarsands',
      name: 'petropolisTarSands',
      components: {
        default: () => import('./views/petropolis/PetropolisTarSands.vue'),
        map: MapPetropolis
      }
    },
    {
      path: '/petropolis/tarsands/bakken',
      name: 'petropolisTarSandsBakken',
      components: {
        default: () => import('./views/petropolis/PetropolisTarSandsBakken.vue'),
        map: MapPetropolis
      }
    },
    {
      path: '/petropolis/tarsands/gulf',
      name: 'petropolisTarSandsGulf',
      components: {
        default: () => import('./views/petropolis/PetropolisTarSandsGulf.vue'),
        map: MapPetropolis
      }
    },
    {
      path: '/petropolis/chicago',
      name: 'petropolisChicago',
      components: {
        default: () => import('./views/petropolis/PetropolisChicago.vue'),
        map: MapPetropolis
      }
    }
  ]
})
