<script>
import Map from './Map.vue'

import {View} from 'ol'
import {Tile, Group} from 'ol/layer'
import {XYZ} from 'ol/source'
import {fromLonLat} from 'ol/proj'

import {eventBus} from '../main'

export default {
  name: 'MapWatershed',
  extends: Map,
  data: function () {
    return {
      centerPoints: {
        // #TODO: these probably could have better names like watershedIntroduction, watershedHanford, watershedHanfordLegacy to be a bit more semantically obvious
        introductionwater: {
          center: [-120.4, 46.1],
          resolution: 700
        },
        introductionbio: {
          center: [-121.2, 51.0],
          resolution: 4500
        },
        terminals: {
          center: [-122.9, 45.8],
          resolution: 220
        },
        hanford1: {
          center: [-119.54, 46.692],
          resolution: 4
        },
        legacy: {
          center: [-119.529, 46.555],
          resolution: 6
        },
        floods: {
          center: [-119.51, 46.607574],
          resolution: 50
        },
        plumes: {
          center: [-119.51, 46.607574],
          resolution: 50
        },
        stopit: {
          center: [-122.68, 45.84],
          resolution: 220
        },
        dams: {
          center: [-119.9, 46.9],
          resolution: 700
        },
        transformation: {
          center: [-119.9, 46.9],
          resolution: 700
        }
      } // end centerPoints
    }
  },
  computed: {
    watershedBaseLayers: function () {
      return [
        new Tile({
          source: new XYZ({
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}'
          }),
          opacity: 0.9,
          minResolution: 2,
          maxResolution: 16000
        }),
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://ecotopia.today/cascadia/Tiles/Columbia/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 2,
          maxResolution: 16000
        }),
        new Tile({
          source: new XYZ({
            url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}'
          }),
          opacity: 0.7,
          minResolution: 2,
          maxResolution: 8
        })
      ]
    },
    watershedTerminalsLayers: function () {
      return [
        ...this.watershedBaseLayers,
        this.makeGeoJSONPointVectorLayer('geojson/stopped.geojson', 'icons/stop.png', null, 2, 32000),
        this.makeGeoJSONPointVectorLayer('geojson/planned.geojson', 'icons/stopit.png', null, 2, 32000)
      ]
    },
    watershedDamsLayers: function () {
      return [
        ...this.watershedBaseLayers,
        this.makeGeoJSONPointVectorLayer('geojson/Rapids.geojson', 'icons/Tsagaglalal.png', null, 2, 32000)
      ]
    },
    watershedDamsTransformationLayers: function () {
      return [
        ...this.watershedBaseLayers,
        this.makeGeoJSONPointVectorLayer('geojson/MajorHydroCRB.geojson', 'icons/damOther.png', null, 2, 32000),
        this.makeGeoJSONPointVectorLayer('geojson/Bureau.geojson', 'icons/damBR.png', null, 2, 32000),
        this.makeGeoJSONPointVectorLayer('geojson/ArmyCorps.geojson', 'icons/damAC.png', null, 2, 32000)
      ]
    },
    watershedHanfordLayers: function () {
      return [
        ...this.watershedBaseLayers,
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://ecotopia.today/cascadia/Tiles/Hanford/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 1,
          maxResolution: 160
        })
      ]
    },
    watershedHandfordLegacyLayers: function () {
      return [
        // ...this.watershedBaseLayers,
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://ecotopia.today/cascadia/Tiles/Hanford/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 1,
          maxResolution: 80
        }),
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://ecotopia.today/cascadia/Tiles/Leaks/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 1,
          maxResolution: 80
        }),
        this.makeGeoJSONFillVectorLayer('geojson/HanfordLabels.geojson', 1, 80, 'rgba(60, 20, 20, 0.0)', 2, 'rgba(255, 255, 0, 0.0)')
      ]
    },
    watershedHanfordPlumesLayers: function () {
      return [
        ...this.watershedBaseLayers,
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://ecotopia.today/cascadia/Tiles/Hanford/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 1,
          maxResolution: 80
        }),
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://ecotopia.today/cascadia/Tiles/Leaks/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 1,
          maxResolution: 80
        }),
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://ecotopia.today/cascadia/Tiles/HanfordPlumes/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 1,
          maxResolution: 80
        })
      ]
    },
    watershedHanfordFloodsLayers: function () {
      return [
        ...this.watershedBaseLayers,
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://ecotopia.today/cascadia/Tiles/Floods/{z}/{x}/{y}.png'
          }),
          opacity: 0.7,
          minResolution: 2,
          maxResolution: 16000
        })
      ]
    }
  },
  created: function () {
    eventBus.$on('route-click', this.initMap)
  },
  beforeDestroy: function () {
    eventBus.$off('route-click', this.initMap)
  },
  mounted: function () {
    this.initMap()
  },
  methods: {
    initMap: function () {
      switch (this.$route.name) {
        case 'watershedIntroduction':
          this.initWatershedIntro()
          break
        case 'watershedTerminals':
          this.initWatershedTerminals()
          break
        case 'watershedDams':
          this.initWatershedDams()
          break
        case 'watershedDamsTransformation':
          this.initWatershedDamsTransformation()
          break
        case 'watershedHanford':
          this.initWatershedHanford()
          break
        case 'watershedHanfordLegacy':
          this.initWatershedHanfordLegacy()
          break
        case 'watershedHanfordPlumes':
          this.initWatershedHanfordPlumes()
          break
        case 'watershedHanfordFloods':
          this.initWatershedHanfordFloods()
          break
        default:
          this.initWatershedIntro()
      }
      this.olmap.on('pointermove', (e) => {
        const feature = this.olmap.forEachFeatureAtPixel(e.pixel, (feature) => { return feature })
        if (feature) {
          const props = feature.getProperties()
          if (props.key) {
            this.$refs.titletipContent.innerHTML = props.key
            this.titletip.setPosition(e.coordinate)
          }
        } else {
          this.closeTitletip()
          this.closeTooltip()
        }
      })
    },
    initWatershedIntro: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.watershedBaseLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.introductionwater.center),
        resolution: this.centerPoints.introductionwater.resolution,
        minResolution: 2
      }))
    },
    initWatershedTerminals: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.watershedTerminalsLayers
      }))
      this.olmap.setView(
        new View({
          center: fromLonLat(this.centerPoints.terminals.center),
          resolution: this.centerPoints.terminals.resolution,
          minResolution: 2
        })
      )
    },
    initWatershedDams: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.watershedDamsLayers
      }))
      this.olmap.setView(
        new View({
          center: fromLonLat(this.centerPoints.dams.center),
          resolution: this.centerPoints.dams.resolution,
          minResolution: 2
        })
      )
    },
    initWatershedDamsTransformation: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.watershedDamsTransformationLayers
      }))
      this.olmap.setView(
        new View({
          center: fromLonLat(this.centerPoints.transformation.center),
          resolution: this.centerPoints.transformation.resolution,
          minResolution: 2
        })
      )
    },
    initWatershedHanford: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.watershedHanfordLayers
      }))
      this.olmap.setView(
        new View({
          center: fromLonLat(this.centerPoints.hanford1.center),
          resolution: this.centerPoints.hanford1.resolution,
          minResolution: 1
        })
      )
    },
    initWatershedHanfordLegacy: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.watershedHandfordLegacyLayers
      }))
      this.olmap.setView(
        new View({
          center: fromLonLat(this.centerPoints.legacy.center),
          resolution: this.centerPoints.legacy.resolution,
          minResolution: 1
        })
      )
    },
    initWatershedHanfordPlumes: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.watershedHanfordPlumesLayers
      }))
      this.olmap.setView(
        new View({
          center: fromLonLat(this.centerPoints.plumes.center),
          resolution: this.centerPoints.plumes.resolution,
          minResolution: 1
        })
      )
    },
    initWatershedHanfordFloods: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.watershedHanfordFloodsLayers
      }))
      this.olmap.setView(
        new View({
          center: fromLonLat(this.centerPoints.floods.center),
          resolution: this.centerPoints.floods.resolution,
          minResolution: 2
        })
      )
    }
  }
}
</script>
