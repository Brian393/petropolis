import Vue from 'vue'
import Router from 'vue-router'
import WatershedAcknowledgement from './views/watershed/WatershedAcknowledgement.vue'
import MapWatershed from './components/MapWatershed.vue'
import MapMegaregion from './components/MapMegaregion.vue'
import MapBioregion from './components/MapBioregion.vue'

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
      path: '/megaregion/introduction',
      name: 'megaregionIntroduction',
      components: {
        default: () => import('./views/megaregion/MegaregionIntroduction.vue'),
        map: MapMegaregion
      }
    },
    {
      path: '/megaregion/vanport',
      name: 'megaregionVanport',
      components: {
        default: () => import('./views/megaregion/MegaregionVanport.vue'),
        map: MapMegaregion
      }
    },
    {
      path: '/megaregion/vanport/mosaic',
      name: 'megaregionVanportMosaic',
      components: {
        default: () => import('./views/megaregion/MegaregionVanportMosaic.vue'),
        map: MapMegaregion
      }
    },
    {
      path: '/megaregion/willamette',
      name: 'megaregionWillamette',
      components: {
        default: () => import('./views/megaregion/MegaregionWillamette.vue'),
        map: MapMegaregion
      }
    },
    {
      path: '/megaregion/willamette/drone',
      name: 'megaregionWillametteDrone',
      components: {
        default: () => import('./views/megaregion/MegaregionWillametteDrone.vue'),
        map: MapMegaregion
      }
    },
    {
      path: '/megaregion/willamette/slough',
      name: 'megaregionWillametteSlough',
      components: {
        default: () => import('./views/megaregion/MegaregionWillametteSlough.vue'),
        map: MapMegaregion
      }
    },
    {
      path: '/megaregion/energy',
      name: 'megaregionEnergy',
      components: {
        default: () => import('./views/megaregion/MegaregionEnergy.vue'),
        map: MapMegaregion
      }
    },
    {
      path: '/megaregion/crops',
      name: 'megaregionCrops',
      components: {
        default: () => import('./views/megaregion/MegaregionCrops.vue'),
        map: MapMegaregion
      }
    },
    {
      path: '/megaregion/crops/basinproject',
      name: 'megaregionCropsBasinProject',
      components: {
        default: () => import('./views/megaregion/MegaregionBasinProject.vue'),
        map: MapMegaregion
      }
    },
    {
      path: '/bioregion/introduction',
      name: 'bioregion',
      components: {
        default: () => import('./views/bioregion/BioregionIntroduction.vue'),
        map: MapBioregion
      }
    }
  ]
})
