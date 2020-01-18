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
import VideoLightBox from './VideoLightBox.vue'
import MediaLightBox from './MediaLightBox.js'

export default {
  name: 'MapWatershed',
  extends: Map,
  data: function () {
    return {
      centerPoints: {
        // #TODO: these probably could have better names like watershedIntroduction, watershedHanford, watershedHanfordLegacy to be a bit more semantically obvious
        sites: {
          center: [-87.95, 41.84],
          resolution: 230
        },
        previous: {
          center: [-87.74, 41.88],
          resolution: 80
        }
      }, // end centerPoints
      WatershedDamsIsAnimating: true,
      didSetSingleclickEvent: false,
      listenerKeys: [],
      animTimeouts: []
    }
  },
  computed: {
    acknowledgementLayers: function () {
      return [
        new Tile({
          source: new XYZ({
            url: 'https://{a-d}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 0.25
        }),
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://deeptimechicago.org/Walkaboutit/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 0.25
        }),
        this.makeGeoJSONPointVectorLayerWithStyle('geojson/Walks.geojson', null, 4, 400),
      ]
    },
    watershedBaseLayers: function () {
      return [
        new Tile({
          source: new XYZ({
            url: 'https://{a-d}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 0.25
        }),
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://deeptimechicago.org/Walkaboutit/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 0.25
        }),
        this.makeGeoJSONPointVectorLayerWithStyle('geojson/Events.geojson', null, 2, 2000),
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
      this.WatershedDamsIsAnimating = true
      switch (this.$route.name) {
        case 'watershedAcknowledgement':
          this.initWatershedAcknowledgement()
          break
        case 'watershedIntroduction':
          this.initWatershedIntroduction()
          break
        default:
          this.initWatershedAcknowledgement()
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
    initWatershedAcknowledgement: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.acknowledgementLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.sites.center),
        resolution: this.centerPoints.sites.resolution,
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
    initWatershedIntroduction: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.watershedBaseLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.previous.center),
        resolution: this.centerPoints.previous.resolution,
        minResolution: 1,
        maxResolution: 16000
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
      }
    }
  }
</script>
