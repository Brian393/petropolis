import Vue from 'vue'
import Router from 'vue-router'
import PetropolisPipelines from './views/petropolis/PetropolisPipelines.vue'
import MapPetropolis from './components/MapPetropolis.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/petropolis/pipelines'
    },
    {
      path: '/petropolis/pipelines',
      name: 'petropolisPipelines',
      components: {
        default: PetropolisPipelines,
        map: MapPetropolis
      }
    },
    {
      path: '/petropolis/pipelines/contested',
      name: 'petropolisPipelinesContested',
      components: {
        default: () => import('./views/petropolis/PetropolisPipelines.vue'),
        map: MapPetropolis
      }
    },
    // added
    {
      path: '/petropolis/pipelines/all',
      name: 'petropolisPipelinesAll',
      components: {
        default: () => import('./views/petropolis/PetropolisPipelines.vue'),
        map: MapPetropolis
      }
    },
    {
      path: '/petropolis/coal',
      name: 'petropolisCoal',
      components: {
        default: () => import('./views/petropolis/PetropolisCoal.vue'),
        map: MapPetropolis
      }
    },
    {
      path: '/petropolis/coal/world',
      name: 'petropolisCoalWorld',
      components: {
        default: () => import('./views/petropolis/PetropolisCoal.vue'),
        map: MapPetropolis
      }
    },
    {
      path: '/petropolis/gas',
      name: 'petropolisGas',
      components: {
        default: () => import('./views/petropolis/PetropolisGas.vue'),
        map: MapPetropolis
      }
    },
    {
      path: '/petropolis/gas/world',
      name: 'petropolisGasWorld',
      components: {
        default: () => import('./views/petropolis/PetropolisGas.vue'),
        map: MapPetropolis
      }
    }
  ]
})
