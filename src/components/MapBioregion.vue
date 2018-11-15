<script>
import Map from './Map.vue'

import {View} from 'ol'
import {Tile, Vector as VectorLayer, Group} from 'ol/layer'
import {XYZ, Vector as VectorSource, BingMaps} from 'ol/source'
import {GeoJSON} from 'ol/format'
import {Style, Stroke, Fill} from 'ol/style'
import {fromLonLat} from 'ol/proj'

import {eventBus} from '../main'
import VideoLightBox from './VideoLightBox.vue'
import MediaLightBox from './MediaLightBox.js'

export default {
  name: 'MapBioregion',
  extends: Map,
  data: function () {
    return {
      centerPoints: {
        // #TODO: these probably could have better names like watershedIntroduction, watershedHanford, watershedHanfordLegacy to be a bit more semantically obvious
        introductionbio: {
          center: [-125.8, 51.0],
          resolution: 4500
        },
        salmon: {
          center: [-119.9, 45.9],
          resolution: 1000
        },
        chinook: {
          center: [-115.5, 44.529633],
          resolution: 560
        },
        coho: {
          center: [-122.28, 45.55],
          resolution: 300
        },
        chum: {
          center: [-122.9, 47.8],
          resolution: 400
        },
        sockeye: {
          center: [-122.1, 47.3],
          resolution: 700
        },
        transformation: {
          center: [-118.0, 45.6],
          resolution: 1200
        },
        pink: {
          center: [-122.9, 47.8],
          resolution: 450
        },
        restoration: {
          center: [-123.561, 48.095],
          resolution: 4
        },
        wallowa: {
          center: [-117.344, 45.4415],
          resolution: 1.9
        }
      }, // end centerPoints
      radius: 150,
      mousePosition: undefined
    }
  },
  computed: {
    bioregionBaseLayers: function () {
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
            url: 'http://ecotopia.today/cascadia/Tiles/Cascadia/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 5
        }),
        new Tile({
          source: new XYZ({
            url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
          }),
          opacity: 0.7,
          minResolution: 1,
          maxResolution: 16
        })
      ]
    },
    salmonLayers: function () {
      return [
        ...this.bioregionBaseLayers,
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://ecotopia.today/cascadia/Tiles/CriticalHabitat/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 2,
          maxResolution: 1200
        })
      ]
    },
    chinookLayers: function () {
      return [
        ...this.bioregionBaseLayers,
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://ecotopia.today/cascadia/Tiles/CascadiaRivers/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 8,
          maxResolution: 700
        }),
        this.makeGeoJSONLineVectorLayer('geojson/Chinook.geojson', 10, 4000, 'rgba(0,0,240, 0.01)', 12)
      ]
    },
    cohoLayers: function () {
      return [
        ...this.bioregionBaseLayers,
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://ecotopia.today/cascadia/Tiles/CascadiaRivers/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 2,
          maxResolution: 700
        }),
        this.makeGeoJSONLineVectorLayer('geojson/Coho.geojson', 10, 4000, 'rgba(0,0,240, 0.01)', 12)
      ]
    },
    chumLayers: function () {
      return [
        ...this.bioregionBaseLayers,
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://ecotopia.today/cascadia/Tiles/CascadiaRivers/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 2,
          maxResolution: 700
        }),
        this.makeGeoJSONLineVectorLayer('geojson/Chum.geojson', 10, 4000, 'rgba(0,0,240, 0.01)', 12)
      ]
    },
    sockeyeLayers: function () {
      return [
        ...this.bioregionBaseLayers,
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://ecotopia.today/cascadia/Tiles/CascadiaRivers/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 2,
          maxResolution: 900
        }),
        this.makeGeoJSONLineVectorLayer('geojson/Sockeye.geojson', 10, 4000, 'rgba(0,0,240, 0.01)', 12)
      ]
    },
    pinkLayers: function () {
      return [
        ...this.bioregionBaseLayers,
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://ecotopia.today/cascadia/Tiles/CascadiaRivers/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 2,
          maxResolution: 700
        }),
        this.makeGeoJSONLineVectorLayer('geojson/Pink.geojson', 10, 4000, 'rgba(0,0,240, 0.01)', 12)
      ]
    },
    restorationLayers: function () {
      return [
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://tile.stamen.com/toposm-color-relief/{z}/{x}/{y}.jpg'
          }),
          opacity: 1,
          minResolution: 1,
          maxResolution: 10
        }),
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://tile.stamen.com/toposm-contours/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 1,
          maxResolution: 10
        }),
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://tile.stamen.com/toposm-features/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 1,
          maxResolution: 10
        }),
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png'
          }),
          opacity: 0.1,
          minResolution: 1,
          maxResolution: 10
        }),
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://ecotopia.today/cascadia/Tiles/Cascadia/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 5
        })
      ]
    },
    wallowaLayers: function () {
      let USGStopoTile = new Tile({
        preload: Infinity,
        source: new XYZ({
          url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSHydroCached/MapServer/tile/{z}/{y}/{x}'
        }),
        minResolution: 1,
        maxResolution: 4
      })

      USGStopoTile.on('precompose', (e) => {
        this.spyglass(e)
      })
      USGStopoTile.on('postcompose', function (e) {
        e.context.restore()
      })

      return [
        ...this.bioregionBaseLayers,
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://ecotopia.today/cascadia/Tiles/Wallowa/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 0.125,
          maxResolution: 80
        }),
        // bingMapsAerial3
        USGStopoTile
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
        if (props.CropGroup && props.key) {
          this.$refs.titletipContent.innerHTML = props.key
          this.titletip.setPosition(e.coordinate)
        } else if (props.title && props.image) {
          this.$refs.tooltip.innerHTML = props.image.replace('cascadia/', '')
          this.$refs.tooltip.innerHTML += '<div>' + props.title + '</div>'
          this.tooltip.setPosition(e.coordinate)
        } else if (props.key3) {
          this.$refs.textitletipContent.innerHTML = props.key3
          this.textitletip.setPosition(e.coordinate)
        }
      } else {
        this.closeTitletip()
        this.closeTooltip()
        this.closeTextitletip()
      }
      this.mousePosition = this.olmap.getEventPixel(e.originalEvent)
      this.olmap.render()
    })
  },
  methods: {
    initMap: function () {
      switch (this.$route.name) {
        case 'bioregionIntroduction':
          this.initBioregionIntro()
          break
        case 'bioregionSalmon':
          this.initBioregionSalmon()
          break
        case 'bioregionSalmonChinook':
          this.initBioregionSalmonChinook()
          break
        case 'bioregionSalmonCoho':
          this.initBioregionSalmonCoho()
          break
        case 'bioregionSalmonChum':
          this.initBioregionSalmonChum()
          break
        case 'bioregionSalmonSockeye':
          this.initBioregionSalmonSockeye()
          break
        case 'bioregionSalmonPink':
          this.initBioregionSalmonPink()
          break
        case 'bioregionRestoration':
          this.initBioregionRestoration()
          break
        case 'bioregionRestorationWallowa':
          this.initBioregionRestorationWallowa()
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
    initBioregionSalmon: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.salmonLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.salmon.center),
        resolution: this.centerPoints.salmon.resolution,
        minResolution: 11,
        maxResolution: 8000
      }))
    },
    initBioregionSalmonChinook: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.chinookLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.chinook.center),
        resolution: this.centerPoints.chinook.resolution,
        minResolution: 10,
        maxResolution: 8000
      }))
    },
    initBioregionSalmonCoho: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.cohoLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.coho.center),
        resolution: this.centerPoints.coho.resolution,
        minResolution: 10,
        maxResolution: 8000
      }))
    },
    initBioregionSalmonChum: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.chumLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.chum.center),
        resolution: this.centerPoints.chum.resolution,
        minResolution: 10,
        maxResolution: 8000
      }))
    },
    initBioregionSalmonSockeye: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.sockeyeLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.sockeye.center),
        resolution: this.centerPoints.sockeye.resolution,
        minResolution: 10,
        maxResolution: 8000
      }))
    },
    initBioregionSalmonPink: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.pinkLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.pink.center),
        resolution: this.centerPoints.pink.resolution,
        minResolution: 10,
        maxResolution: 8000
      }))
    },
    initBioregionRestoration: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.restorationLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.restoration.center),
        resolution: this.centerPoints.restoration.resolution,
        minResolution: 2,
        maxResolution: 8000
      }))
    },
    initBioregionRestorationWallowa: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.wallowaLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.wallowa.center),
        resolution: this.centerPoints.wallowa.resolution,
        minResolution: 0.125,
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
    }
  }
}
</script>
