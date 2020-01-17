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

export default {
  name: 'MapWatershed',
  extends: Map,
  data: function () {
    return {
      centerPoints: {
        // #TODO: these probably could have better names like watershedIntroduction, watershedHanford, watershedHanfordLegacy to be a bit more semantically obvious
        acknowledgement: {
          center: [-121.36, 47.7],
          resolution: 2000
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
            url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}.png'
          }),
          opacity: 1,
          minResolution: 5
        }),
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://ecotopia.today/cascadia/Tiles/Cascadia-new/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 2
        }),
        new Tile({
          source: new XYZ({
            url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
          }),
          opacity: 0.7,
          minResolution: 2,
          maxResolution: 8
        }),
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://ecotopia.today/cascadia/Tiles/Languages/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 2,
          maxResolution: 16000
        })
      ]
    },
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
        center: fromLonLat(this.centerPoints.acknowledgement.center),
        resolution: this.centerPoints.acknowledgement.resolution,
        minResolution: 40,
        maxResolution: 32000
      }))
    },
    initWatershedIntroduction: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.watershedBaseLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.introductionwater.center),
        resolution: this.centerPoints.introductionwater.resolution,
        minResolution: 2,
        maxResolution: 2000
      }))
    },
  }
}
</script>
