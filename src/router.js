import Vue from 'vue'
import Router from 'vue-router'
import WatershedIntroduction from './views/watershed/WatershedIntroduction.vue'
import MapWatershed from './components/MapWatershed.vue'
import MapMegaregion from './components/MapMegaregion.vue'
import MapBioregion from './components/MapBioregion.vue'

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
        map: MapWatershed
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
        map: MapWatershed
      }
    },
    {
      path: '/watershed/falls',
      name: 'watershedFalls',
      components: {
        default: () => import('./views/watershed/WatershedFalls.vue'),
        map: MapWatershed
      }
    },
    {
      path: '/watershed/dams/transformation',
      name: 'watershedDamsTransformation',
      components: {
        default: () => import('./views/watershed/WatershedDamsTransformation.vue'),
        map: MapWatershed
      }
    },
    {
      path: '/watershed/hanford',
      name: 'watershedHanford',
      components: {
        default: () => import('./views/watershed/WatershedHanford.vue'),
        map: MapWatershed
      }
    },
    {
      path: '/watershed/hanford/legacy',
      name: 'watershedHanfordLegacy',
      components: {
        default: () => import('./views/watershed/WatershedHanfordLegacy.vue'),
        map: MapWatershed
      }
    },
    {
      path: '/watershed/hanford/plumes',
      name: 'watershedHanfordPlumes',
      components: {
        default: () => import('./views/watershed/WatershedHanfordPlumes.vue'),
        map: MapWatershed
      }
    },
    {
      path: '/watershed/hanford/floods',
      name: 'watershedHanfordFloods',
      components: {
        default: () => import('./views/watershed/WatershedHanfordFloods.vue'),
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
    },
    {
      path: '/bioregion/salmon',
      name: 'bioregionSalmon',
      components: {
        default: () => import('./views/bioregion/BioregionSalmon.vue'),
        map: MapBioregion
      }
    },
    {
      path: '/bioregion/salmon/chinook',
      name: 'bioregionSalmonChinook',
      components: {
        default: () => import('./views/bioregion/BioregionSalmonChinook.vue'),
        map: MapBioregion
      }
    },
    {
      path: '/bioregion/salmon/coho',
      name: 'bioregionSalmonCoho',
      components: {
        default: () => import('./views/bioregion/BioregionSalmonCoho.vue'),
        map: MapBioregion
      }
    },
    {
      path: '/bioregion/salmon/chum',
      name: 'bioregionSalmonChum',
      components: {
        default: () => import('./views/bioregion/BioregionSalmonChum.vue'),
        map: MapBioregion
      }
    },
    {
      path: '/bioregion/salmon/sockeye',
      name: 'bioregionSalmonSockeye',
      components: {
        default: () => import('./views/bioregion/BioregionSalmonSockeye.vue'),
        map: MapBioregion
      }
    },
    {
      path: '/bioregion/salmon/pink',
      name: 'bioregionSalmonPink',
      components: {
        default: () => import('./views/bioregion/BioregionSalmonPink.vue'),
        map: MapBioregion
      }
    },
    {
      path: '/bioregion/restoration',
      name: 'bioregionRestoration',
      components: {
        default: () => import('./views/bioregion/BioregionRestoration.vue'),
        map: MapBioregion
      }
    },
    {
      path: '/bioregion/awakening',
      name: 'bioregionAwakening',
      components: {
        default: () => import('./views/bioregion/BioregionAwakening.vue'),
        map: MapBioregion
      }
    },
    {
      path: '/bioregion/awakening/caps',
      name: 'bioregionAwakeningCaps',
      components: {
        default: () => import('./views/bioregion/BioregionAwakeningCaps.vue'),
        map: MapBioregion
      }
    },
    {
      path: '/bioregion/awakening/deconstruction',
      name: 'bioregionAwakeningDeconstruction',
      components: {
        default: () => import('./views/bioregion/BioregionAwakeningDeconstruction.vue'),
        map: MapBioregion
      }
    }
  ]
})
