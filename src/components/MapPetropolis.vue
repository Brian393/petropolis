<script>
import Map from './Map.vue'

import {View} from 'ol'
import {Tile, Group} from 'ol/layer'
import {XYZ, Vector as VectorSource, BingMaps} from 'ol/source'
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
          center: [-95.9, 41.0],
          resolution: 7000
        },
        tarsands: {
          center: [-111.439654, 56.9275],
          resolution: 180
        },
        chicago: {
          center: [-87.75, 41.767832],
          resolution: 150
        }
      }, // end centerPoints
      radius: 600,
      mousePosition: undefined
    }
  },
  computed: {
    baseLayers: function () {
      let bingMapTile = new Tile({
        source: new BingMaps({
          key: 'Asxv26hh6HvBjw5idX-d8QS5vaJH1krMPBfZKjNmLjaQyr0Sc-BrHBoatyjwzc_k',
          imagerySet: 'Aerial'
        }),
        minResolution: 0.25,
        maxResolution: 4
      })
      bingMapTile.on('precompose', (e) => {
        this.spyglass(e)
      })
      bingMapTile.on('postcompose', function (e) {
        e.context.restore()
      })

      return [
        new Tile({
          source: new XYZ({
            url: 'https://stamen-tiles-{a-d}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 0.25
        }),
        this.makeGeoJSONFillVectorLayer('geojson/Crude_Terminals.geojson', 0.25, 40, 'rgba(134, 40, 26, 0.7)', 3, 'rgba(134, 40, 26, 0.1)'),
        this.makeGeoJSONFillVectorLayer('geojson/OilFields-NA.geojson', 80, 6000, 'rgba(102,	51,	51, 0.6)', 2, 'rgba(242,207,207, 0.2)'),
        this.makeGeoJSONFillVectorLayer('geojson/OilFields_outsideNA.geojson', 80, 6000, 'rgba(102,	51,	51, 0.6)', 2, 'rgba(242,207,207, 0.2)'),
        this.makeGeoJSONLineVectorLayer('geojson/NA-RR.geojson', 16, 8000, 'dimgray', 1),
        this.makeGeoJSONPointVectorLayer('geojson/CoalPlants.geojson', 'icons/Coal.png', null, 1, 2000),
        this.makeGeoJSONLineVectorLayer('geojson/Crude_Pipelines1.geojson', 1, 16000, '#c21313', 3.5),
        this.makeGeoJSONLineVectorLayer('geojson/GlobalPipelines-sm.geojson', 16000, 1300000, '#c21313', 1.5),
        this.makeGeoJSONLineVectorLayer('geojson/GlobalPipelines.geojson', 200, 16000, '#c21313', 3.5),
        this.makeGeoJSONPointVectorLayer('geojson/Refineries-outsideNA.geojson', 'icons/OilIcon2.png', null, 1, 16000),
        this.makeGeoJSONPointVectorLayer('geojson/Refineries-outsideNA-sm.geojson', 'icons/refinery-red-sm.gif', null, 16000, 1300000),
        this.makeGeoJSONPointVectorLayer('geojson/NA_Refineries.geojson', 'icons/OilIcon2.png', null, 1, 16000),
        this.makeGeoJSONPointVectorLayer('geojson/NA_Refineries-sm.geojson', 'icons/refinery-red-sm.gif', null, 16000, 1300000),
        this.makeGeoJSONPointVectorLayer('geojson/Leaks-fullfile-edited.geojson', 'icons/OilSpill.gif', null, 1, 8000),
        this.makeGeoJSONPointVectorLayer('geojson/LargeLeaks.geojson', 'icons/LargeSpill.gif', null, 1, 2000),
        this.makeGeoJSONPointVectorLayer('geojson/XLspills.geojson', 'icons/XLspill.gif', null, 1, 8000),
        this.makeGeoJSONPointVectorLayer('geojson/CrudeDerailments.geojson', 'icons/Explosion.gif', null, 1, 16000),
        this.makeGeoJSONPointVectorLayer('geojson/Anthroquakes.geojson', 'icons/Anthroquake.png', null, 1, 16000),
        this.makeGeoJSONPointVectorLayer('geojson/StandingRock.geojson', 'icons/StandingRock.png', null, 1, 8000),
        this.makeGeoJSONPointVectorLayer('geojson/BreakFreeProtests.geojson', 'icons/Break.gif', null, 40, 16000),
        this.makeGeoJSONPointVectorLayer('geojson/Gasland.geojson', 'icons/Gasland2.gif', null, 4, 8000),
        // bingMapsAerial
        bingMapTile
      ]
    },
    petropolisTarSandsLayers: function () {
      let bingMapTile = new Tile({
        source: new BingMaps({
          key: 'Asxv26hh6HvBjw5idX-d8QS5vaJH1krMPBfZKjNmLjaQyr0Sc-BrHBoatyjwzc_k',
          imagerySet: 'Aerial'
        }),
        minResolution: 0.25,
        maxResolution: 2
      })
      bingMapTile.on('precompose', (e) => {
        this.spyglass(e)
      })
      bingMapTile.on('postcompose', function (e) {
        e.context.restore()
      })

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
        this.makeGeoJSONPointVectorLayer('geojson/Petropolis.geojson', 'icons/Petropolis.png', null, 40, 400),
        // bingMapsAerial
        bingMapTile
      ]
    },
    petropolisChicagoLayers: function () {
      let bingMapTile = new Tile({
        source: new BingMaps({
          key: 'Asxv26hh6HvBjw5idX-d8QS5vaJH1krMPBfZKjNmLjaQyr0Sc-BrHBoatyjwzc_k',
          imagerySet: 'Aerial'
        }),
        minResolution: 0.25,
        maxResolution: 2
      })
      bingMapTile.on('precompose', (e) => {
        this.spyglass(e)
      })
      bingMapTile.on('postcompose', function (e) {
        e.context.restore()
      })

      return [
        new Tile({
          source: new XYZ({
            url: 'https://stamen-tiles-{a-d}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 0.25
        }),
        new Tile({
          source: new XYZ({
            url: 'http://environmentalobservatory.net/Petropolis/tiles/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 0.25,
	        updateWhileAnimating: true
        }),
        this.makeGeoJSONFillVectorLayer('geojson/Crude_Terminals.geojson', 0.25, 40, 'rgba(134, 40, 26, 0.7)', 3, 'rgba(134, 40, 26, 0.1)'),
        this.makeGeoJSONLineVectorLayer('geojson/NA-RR.geojson', 16, 8000, 'dimgray', 1),
        this.makeGeoJSONLineVectorLayer('geojson/Crude_Pipelines1.geojson', 1, 16000, '#c21313', 3.5),
        this.makeGeoJSONPointVectorLayer('geojson/Title.geojson', 'icons/Title3.png', null, 140, 180),
        this.makeGeoJSONPointVectorLayer('geojson/NA_Refineries.geojson', 'icons/refinery-red.gif', null, 1, 8000),
        // bingMapsAerial
        bingMapTile
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
    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 38) { // up arrow key
        this.radius = Math.min(this.radius + 5, 800)
        this.olmap.render()
      } else if (e.keyCode === 40) { // down arrow key
        this.radius = Math.max(this.radius - 5, 0)
        this.olmap.render()
      }
    })
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
      this.mousePosition = this.olmap.getEventPixel(e.originalEvent)
      this.olmap.render()
    })
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
        case 'petropolisChicago':
          this.initPetropolisChicago()
          break
        default:
          this.initPetropolisPipelines()
      }
    },
    initPetropolisPipelines: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.baseLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.pipelines.center),
        resolution: this.centerPoints.pipelines.resolution,
        minResolution: 0.25,
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
        minResolution: 0.25,
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
    },
    initPetropolisChicago: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.petropolisChicagoLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.chicago.center),
        resolution: this.centerPoints.chicago.resolution,
        minResolution: 0.5,
        maxResolution: 16000
      }))
      // Had to change props to vimeoSrc3 - here and in geojson - or else it doesn't close
      if (this.olmap) {
        this.olmap.on('singleclick', (e) => {
          const feature = this.olmap.forEachFeatureAtPixel(e.pixel, (feature) => { return feature })
          if (feature) {
            const props = feature.getProperties()
            if (props.vimeoSrc3) {
              const mediabox = new MediaLightBox(props.vimeoSrc3)
              mediabox.open()
            }
          }
        })
      }
    },
    spyglass: function (e) {
      let ctx = e.context
      const pixelRatio = e.frameState.pixelRatio
      ctx.save()
      ctx.beginPath()
      if (this.mousePosition) {
        // Only show a circle around the mouse --
        ctx.arc(this.mousePosition[0] * pixelRatio, this.mousePosition[1] * pixelRatio,
          this.radius * pixelRatio, 0, 2 * Math.PI)
        ctx.lineWidth = 5 * pixelRatio
        ctx.strokeStyle = 'rgba(0,0,0,0.5)'
        ctx.stroke()
      }
      ctx.clip()
    }
  }
}
</script>
