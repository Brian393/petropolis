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
  name: 'MapWalkaboutit',
  extends: Map,
  data: function () {
    return {
      centerPoints: {
        sites: {
          center: [-87.67, 41.84],
          resolution: 240
        },
        previous: {
          center: [-87.74, 41.88],
          resolution: 5000
        }
      }
    }
  },
  computed: {
    walkaboutitLayers: function () {
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
        this.makeGeoJSONPointVectorLayerWithStyle('geojson/Walks.geojson', null, 0.5, 400),
        this.makeGeoJSONFillVectorLayer('geojson/BldgsGHG-2017.geojson', 1, 4, 'rgba(60, 20, 20, 0.0)', 2, 'rgba(255, 255, 0, 0.0)')
      ]
    },
    walkaboutitBaseLayers: function () {
      return [
        new Tile({
          source: new XYZ({
            url: 'https://{a-d}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 0.25
        }),
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://deeptimechicago.org/Drivearound/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 80,
          maxResolution: 32000
        }),
        this.makeGeoJSONPointVectorLayerWithStyle('geojson/EventGalleries.geojson', null, 0.5, 16000),
        this.makeGeoJSONPointVectorLayerWithStyle('geojson/Events.geojson', null, 0.5, 16000),
        this.makeGeoJSONPointVectorLayerWithStyle('geojson/PopupWalks.geojson', null, 0.5, 16000)
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
        case 'walkaboutit2020':
          this.initWalkaboutit2020()
          break
        case 'walkaboutitPrevious':
          this.initWalkaboutitPrevious()
          break
        default:
          this.initWalkaboutit2020()
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
    initWalkaboutit2020: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.walkaboutitLayers
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
    initWalkaboutitPrevious: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.walkaboutitBaseLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.previous.center),
        resolution: this.centerPoints.previous.resolution,
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
