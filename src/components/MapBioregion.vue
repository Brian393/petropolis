<script>
import Map from './Map.vue'

import {View} from 'ol'
import {Tile, Vector as VectorLayer, Group} from 'ol/layer'
import {XYZ, Vector as VectorSource, BingMaps} from 'ol/source'
import {GeoJSON} from 'ol/format'
import {Style, Icon, Text, Fill, Stroke} from 'ol/style'
import {fromLonLat} from 'ol/proj'
import {unByKey} from 'ol/Observable.js'
import {easeOut} from 'ol/easing.js'
import {eventBus} from '../main'
// import VideoLightBox from './VideoLightBox.vue'
import MediaLightBox from './MediaLightBox.js'
import jQuery from 'jQuery'
let colormap = require('colormap')
let colIndex = 0

export default {
  name: 'MapBioregion',
  extends: Map,
  data: function () {
    return {
      centerPoints: {

        introductionbio: {
          center: [-125.8, 51.0],
          resolution: 4500
        }
      }, // end centerPoints
      bioregionDancingIsAnimating: true,
      didSetSingleclickEvent: false,
      listenerKeys: [],
      animTimeouts: [],
      radius: 150,
      mousePosition: undefined,
      colors: []
    }
  },
  computed: {
    baseLayers: function () {
      return [
        new Tile({
          source: new XYZ({
            url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}.png'
          }),
          opacity: 0.9,
          minResolution: 5
        }),
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://ecotopia.today/cascadia/Tiles/Cascadia-new/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 5
        }),
        new Tile({
          source: new XYZ({
            url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
          }),
          opacity: 0.7,
          minResolution: 2,
          maxResolution: 16
        })
      ]
    },
    bioregionBaseLayers: function () {
      return [
        ...this.baseLayers
      ]
    },
    capsLayers: function () {
      // Steven 1/20
      // // colIndex1 = (colIndex1+1)%32;
      // // const colorIndex = colIndex1;
      // const colorIndex = Math.ceil(Math.random()*10)
      return [
        new Tile({
          source: new XYZ({
            url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}.png'
          }),
          opacity: 0.9,
          minResolution: 10
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
          source: new BingMaps({
            key: 'Asxv26hh6HvBjw5idX-d8QS5vaJH1krMPBfZKjNmLjaQyr0Sc-BrHBoatyjwzc_k',
            imagerySet: 'Aerial'
          }),
          opacity: 0.2,
          minResolution: 2,
          maxResolution: 10
        }),
        new Tile({
          source: new XYZ({
            url: 'https://api.mapbox.com/styles/v1/bkholmes/cjr6z7svt00n82rqm1y3igze4/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmtob2xtZXMiLCJhIjoiNjlkYjI4MDUyYTRlZWEyYzkwYTdmOTgxNmMzOGYwMTUifQ.VSUo52PYOUzS60NR6jqXTw'
          }),
          opacity: 1,
          minResolution: 2,
          maxResolution: 400
        }),
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://ecotopia.today/cascadia/Tiles/Mileage2/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 12
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
    this.colors = colormap({
      colormap: 'portland',
      nshades: 32,
      format: 'hex',
      alpha: 1
    })
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
        if (props.CropGroup && props.key) {
          this.$refs.titletipContent.innerHTML = props.key
          this.titletip.setPosition(e.coordinate)
        } else if (props.image && props.icon) {
          this.$refs.whitetitletipContent.innerHTML = props.image
          this.whitetitletip.setPosition(e.coordinate)
        } else if (props.title && props.image) {
          this.$refs.tooltip.innerHTML = props.image.replace('cascadia/', '')
          this.$refs.tooltip.innerHTML += '<div>' + props.title + '</div>'
          this.tooltip.setPosition(e.coordinate)
        } else if (props.key4) {
          this.$refs.textitletipContent.innerHTML = props.key4
          this.textitletip.setPosition(e.coordinate)
        }
      } else {
        this.closeTitletip()
        this.closeTooltip()
        this.closeTextitletip()
        this.closeWhitetitletip()
      }
      this.mousePosition = this.olmap.getEventPixel(e.originalEvent)
      this.olmap.render()
    })
  },
  methods: {
    initMap: function () {
      this.bioregionDancingIsAnimating = true
      switch (this.$route.name) {
        case 'bioregionIntroduction':
          this.initBioregionIntro()
          break
        default:
          this.initBioregionIntro()
      }
    },
    initBioregionIntro: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.bioregionBaseLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.introductionbio.center),
        resolution: this.centerPoints.introductionbio.resolution,
        minResolution: 8,
        maxResolution: 8000
      }))
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
        ctx.lineWidth = 2 * pixelRatio
        ctx.strokeStyle = 'rgba(0,0,0,0.4)'
        ctx.stroke()
      }
      ctx.clip()
    },
    flash: function (feature) {
      const featureTitle = feature.values_['title'] || ''
      const featureDate = feature.values_['date'] || ''
      const featureRoute = feature.values_['route'] || ''
      const featurePurpose = feature.values_['purpose'] || ''
      const start = new Date().getTime()
      // const colorIndex = Math.ceil(Math.random()*16)
      colIndex = (colIndex + 1) % 32
      const colorIndex = colIndex
      const listenerKey = this.olmap.on('postcompose', (event) => {
        const duration = 1800
        const elapsed = event.frameState.time - start
        const elapsedRatio = elapsed / duration
        const opacity = easeOut(1.2 - elapsedRatio)
        // Steven 1/18
        jQuery('div.mapInfo-section1').text(featureTitle)
        jQuery('div.mapInfo-section2').text(featureDate)
        jQuery('div.mapInfo-section3').text(featureRoute)
        jQuery('div.mapInfo-section4').text(featurePurpose)
        feature.setStyle([
          new Style({
            stroke: new Stroke({
              // color: 'rgba(255, 0, 0, 1)',
              color: this.colors[colorIndex],
              width: 3.8
            })
          })
        ])
      })
    }
  }
}
</script>
