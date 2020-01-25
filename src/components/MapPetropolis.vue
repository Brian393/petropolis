<script>
import Map from './Map.vue'

import {View} from 'ol'
import {Tile, Group} from 'ol/layer'
import {XYZ} from 'ol/source'
import {fromLonLat} from 'ol/proj'

import {easeOut} from 'ol/easing.js'
import {Style, Icon, Text, Fill, Stroke} from 'ol/style'
import {unByKey} from 'ol/Observable.js'

import {eventBus} from '../main'
import MediaLightBox from './MediaLightBox.js'
import AppLightBox from './AppLightBox.vue'

export default {
  name: 'MapPetropolis',
  extends: Map,
  data: function () {
    return {
      centerPoints: {
        pipelines: {
          center: [-95.2128, 42.8],
          resolution: 6000
        },
        tarsands: {
          center: [-111.439654, 56.9275],
          resolution: 180
        }
      }
    }
  },
  computed: {
    petropolisLayers: function () {
      return [
        new Tile({
          source: new XYZ({
            url: 'https://stamen-tiles-{a-d}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 0.25
        }),
        this.makeGeoJSONFillVectorLayer('geojson/Crude_Terminals.geojson', 0.25, 40, 'rgba(134, 40, 26, 0.7)', 3, 'rgba(134, 40, 26, 0.1)'),
        this.makeGeoJSONLineVectorLayer('geojson/NA-RR.geojson', 16, 8000, 'dimgray', 1),
        this.makeGeoJSONLineVectorLayer('geojson/Crude_Pipelines1.geojson', 1, 16000, '#c21313', 3.5),
        this.makeGeoJSONLineVectorLayer('geojson/Enbridge_Pipe***lines.geojson', 1, 16000, '#000000', 3.5),
        this.makeGeoJSONPointVectorLayer('geojson/NA_Refineries.geojson', 'icons/OilIcon2.png', null, 1, 16000),
        this.makeGeoJSONPointVectorLayer('geojson/CrudeDerailments.geojson', 'icons/Explosion.gif', null, 1, 16000),
        this.makeGeoJSONPointVectorLayer('geojson/Anthroquakes.geojson', 'icons/Earthquake.gif', null, 1, 16000),
        this.makeGeoJSONPointVectorLayer('geojson/BreakFreeProtests.geojson', 'icons/Break.gif', null, 40, 16000)
      ]
    },
    petropolisTarSandsLayers: function () {
      return [
        new Tile({
          source: new XYZ({
            url: 'https://stamen-tiles-{a-d}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 0.25
        }),
        this.makeGeoJSONFillVectorLayer('geojson/TarSandsFootprints2.geojson', 0.25, 4000, 'black', 0.6, 'rgba(244, 164, 96, 0.6)'),
        this.makeGeoJSONFillVectorLayer('geojson/Crude_Terminals.geojson', 0.25, 40, 'rgba(134, 40, 26, 0.7)', 3, 'rgba(134, 40, 26, 0.1)'),
        this.makeGeoJSONLineVectorLayer('geojson/NA-RR.geojson', 16, 8000, 'dimgray', 1),
        this.makeGeoJSONLineVectorLayer('geojson/Crude_Pipelines1.geojson', 1, 16000, '#c21313', 3.5),
        this.makeGeoJSONLineVectorLayer('geojson/Enbridge_Pipe****lines.geojson', 1, 16000, '#000000', 3.5),
        this.makeGeoJSONPointVectorLayer('geojson/NA_Refineries.geojson', 'icons/refinery-red.gif', null, 1, 8000),
        this.makeGeoJSONPointVectorLayer('geojson/Question.geojson','icons/Question.gif', null, 40, 4000),
        this.makeGeoJSONPointVectorLayer('geojson/ShylePierce.geojson', 'icons/ShylePierce.png', null, 40, 400),
        this.makeGeoJSONPointVectorLayer('geojson/Escape.geojson', 'icons/Escape.png', null, 40, 400),
        this.makeGeoJSONPointVectorLayer('geojson/Petropolis.geojson', 'icons/Petropolis.png', null, 40, 400)
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
        case 'petropolisPipelines':
          this.initPetropolisPipelines()
          break
        case 'petropolisTarSands':
          this.initPetropolisTarSands()
          break
        default:
          this.initPetropolisPipelines()
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
    initPetropolisPipelines: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.petropolisLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.pipelines.center),
        resolution: this.centerPoints.pipelines.resolution,
        minResolution: 1,
        maxResolution: 32000
      }))
      if (this.olmap) {
        this.olmap.on('singleclick', (e) => {
          const feature = this.olmap.forEachFeatureAtPixel(e.pixel, (feature) => { return feature })
          if (feature) {
            const props = feature.getProperties()
            if (props.vimeoSrc) {
              const mediabox = new MediaLightBox(props.vimeoSrc)
              mediabox.open()
            }
          }
        })
      }
    },
    initPetropolisTarSands: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.petropolisTarSandsLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.tarsands.center),
        resolution: this.centerPoints.tarsands.resolution,
        minResolution: 1,
        maxResolution: 16000
      }))
      // Had to change props to vimeoSrc2 - here and in geojson - or else it doesn't close
      if (this.olmap) {
        this.olmap.on('singleclick', (e) => {
          const feature = this.olmap.forEachFeatureAtPixel(e.pixel, (feature) => { return feature })
          if (feature) {
            const props = feature.getProperties()
            if (props.vimeoSrc2) {
              const mediabox = new MediaLightBox(props.vimeoSrc2)
              mediabox.open()
            }
          }
        })
      }
    }
  }
}
</script>
