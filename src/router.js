import Vue from 'vue'
import Router from 'vue-router'
import PetropolisOil from './views/petropolis/PetropolisOil.vue'
import MapPetropolis from './components/MapPetropolis.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/petropolis/oil'
    },
    {
      path: '/petropolis/oil',
      name: 'petropolisOil',
      components: {
        default: PetropolisOil,
        map: MapPetropolis
      }
    },
//    {
//      path: '/petropolis/oil/contested',
//      name: 'petropolisOilContested',
//      components: {
//        default: () => import('./views/petropolis/PetropolisOil.vue'),
//        map: MapPetropolis
//      }
//    },
    // added
    {
      path: '/petropolis/oil/world',
      name: 'petropolisOilAll',
      components: {
        default: () => import('./views/petropolis/PetropolisOil.vue'),
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
