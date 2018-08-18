<script>
import Map from './Map.vue'

import {View} from 'ol'
import {Tile, Vector as VectorLayer, Group} from 'ol/layer'
import {XYZ, Vector as VectorSource, BingMaps} from 'ol/source'
import {GeoJSON} from 'ol/format'
import {Style, Stroke, Fill} from 'ol/style'
import {fromLonLat} from 'ol/proj'

export default {
  name: 'MapMegaregion',
  extends: Map,
  data: function () {
    return {
      centerPoints: {
        introductionmetro: {
          center: [-122.112002, 45.564222],
          resolution: 180
        },
        energy: {
          center: [-119.023311, 46.864322],
          resolution: 798
        },
        crops: {
          center: [-117.6, 46.5],
          resolution: 900
        },
        coulee: {
          center: [-118.989, 47.948],
          resolution: 6
        },
        basin: {
          center: [-118.989, 46.9],
          resolution: 300
        }
      }, // end centerPoints
      radius: 300,
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
        minResolution: 2,
        maxResolution: 10
      })
      bingMapTile.on('precompose', (e) => {
        this.spyglass(e)
      })
      bingMapTile.on('postcompose', function (e) {
        e.context.restore()
      })

      return [
        // layer
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_CityLights_2012/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg'
          }),
          minResolution: 800
        }),
        // tiles[6]
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://{a-d}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 2,
          maxResolution: 40,
          loadTilesWhileAnimating: true,
          loadTilesWhileInteracting: true
        }),
        // tiles[7]
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://{a-d}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 20,
          maxResolution: 799,
          loadTilesWhileAnimating: true,
          loadTilesWhileInteracting: true
        }),
        // coastlines
        new Tile({
          source: new XYZ({
            url: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/Coastlines/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png'
          }),
          minResolution: 200
        }),
        // tiles[5]
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://ecotopia.today/cascadia/Tiles/PDX-new/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 2,
          maxResolution: 1600
        }),
        // openrailwaymap
        new Tile({
          title: 'OpenRailwayMap',
          visible: true,
          minResolution: 40,
          opacity: 1,
          source: new XYZ({
            url: 'http://{a-c}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png',
            crossOrigin: null, // make it work inside canvas
            tilePixelRatio: 2, // server returns 512px img for 256 tiles
            maxZoom: 19, // XYZ's default is 18
            opaque: false,
            loadTilesWhileAnimating: true,
            loadTilesWhileInteracting: true
          })
        }),
        // quadKeyLayer
        new Tile({
          minResolution: 20,
          opacity: 1,
          source: new XYZ({
            tileUrlFunction: (tileCoord, pixelRatio, projection) => {
              const z = tileCoord[0]
              const x = tileCoord[1]
              const y = -tileCoord[2] - 1
              return 'http://t0.tiles.virtualearth.net/tiles/t' + this.computeQuadKey(x, y, z) + '.jpg'
            }
          }),
          loadTilesWhileAnimating: true,
          loadTilesWhileInteracting: true
        }),
        // mega[5]
        new VectorLayer({
          source: new VectorSource({
            format: new GeoJSON(),
            url: 'geojson/USmegaregions2.geojson'
          }),
          minResolution: 1600,
          maxResolution: 8000,
          style: new Style({
            stroke: new Stroke({
              width: 0.5,
              color: 'rgba(255, 255, 255, 0.8)'
            }),
            fill: new Fill({
              color: 'rgba(255, 255, 255, 0.3)'
            })
          })
        }),
        // bingMapsAerial
        bingMapTile
      ]
    },
    energyLayers: function () {
      return [
        ...this.baseLayers, // three dots = "spread operator" does the same as "concat"
        // mega[6]
        this.makeGeoJSONPointVectorLayer('geojson/CascadiaHydro2.geojson', 'icons/dam.png', 'Hydro power', 2, 2000),
        // mega[7]
        this.makeGeoJSONPointVectorLayer('geojson/CascadiaNuclear.geojson', 'icons/nukes.gif', 'Nuclear power', 2, 2000),
        // mega[9]
        this.makeGeoJSONPointVectorLayer('geojson/CascadiaWind.geojson', 'icons/wind.png', 'Wind Power', 2, 2000),
        // mega[10]
        this.makeGeoJSONPointVectorLayer('geojson/CascadiaNatGas.geojson', 'icons/natgas.png', 'Natural Gas', 2, 2000),
        // mega[8]
        this.makeGeoJSONPointVectorLayer('geojson/CascadiaCoal.geojson', 'icons/coal.png', 'Coal Power', 2, 2000)
      ]
    },
    cropsLayers: function () {
      return [
        // tiles[13]
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://{a-d}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 2,
          maxResolution: 16000,
          loadTilesWhileAnimating: true,
          loadTilesWhileInteracting: true
        }),
        // tiles[12]
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://ecotopia.today/cascadia/Tiles/Crops/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 2,
          maxResolution: 16000
        })
      ]
    },
    grandCouleeLayers: function () {
      let bingMapTile = new Tile({
        source: new BingMaps({
          key: 'Asxv26hh6HvBjw5idX-d8QS5vaJH1krMPBfZKjNmLjaQyr0Sc-BrHBoatyjwzc_k',
          imagerySet: 'Aerial'
        }),
        minResolution: 2,
        maxResolution: 10
      })
      bingMapTile.on('precompose', (e) => {
        this.spyglass(e)
      })
      bingMapTile.on('postcompose', function (e) {
        e.context.restore()
      })

      return [
        // tiles[19]
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://{a-d}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 2,
          maxResolution: 16000
        }),
        // tiles[18]
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://ecotopia.today/cascadia/Tiles/Crops/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 2,
          maxResolution: 16000
        }),
        // bingMapsAerial2
        bingMapTile
      ]
    },
    basinProjectLayers: function () {
      let bingMapTile = new Tile({
        source: new BingMaps({
          key: 'Asxv26hh6HvBjw5idX-d8QS5vaJH1krMPBfZKjNmLjaQyr0Sc-BrHBoatyjwzc_k',
          imagerySet: 'Aerial'
        }),
        minResolution: 2,
        maxResolution: 10
      })
      bingMapTile.on('precompose', (e) => {
        this.spyglass(e)
      })
      bingMapTile.on('postcompose', function (e) {
        e.context.restore()
      })

      return [
        // tiles[20]
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://{a-d}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'}),
          opacity: 1,
          minResolution: 2,
          maxResolution: 16000
        }),
        // tiles[22]
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://ecotopia.today/cascadia/Tiles/Crops/{z}/{x}/{y}.png'
          }),
          opacity: 0.6,
          minResolution: 2,
          maxResolution: 16000
        }),
        // tiles[21]
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://ecotopia.today/cascadia/Tiles/CBP/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 2,
          maxResolution: 16000
        }),
        // mega[11]
        this.makeGeoJSONFillVectorLayer('geojson/CBP-Crops.geojson', 2, 80, 'rgba(189, 7, 97, 0)', 0, 'rgba(189, 7, 97, 0)'),
        // bingMapsAerial3
        bingMapTile
      ]
    }

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
  },
  methods: {
    initMap: function () {
      switch (this.$route.name) {
        case 'megaregionIntroduction':
          this.initMegaregionIntroduction()
          break
        case 'megaregionEnergy':
          this.initMegaregionEnergy()
          break
        case 'megaregionCrops':
          this.initMegaregionCrops()
          break
        case 'megaregionCropsGrandCoulee':
          this.initmegaregionCropsGrandCoulee()
          break
        case 'megaregionCropsBasinProject':
          this.initmegaregionCropsBasinProject()
          break
        default:
      }
    },
    initMegaregionIntroduction: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.baseLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.introductionmetro.center),
        resolution: this.centerPoints.introductionmetro.resolution,
        zoom: 0
      }))
    },
    initMegaregionEnergy: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.energyLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.energy.center),
        resolution: this.centerPoints.energy.resolution,
        zoom: 0
      }))
    },
    initMegaregionCrops: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.cropsLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.crops.center),
        resolution: this.centerPoints.crops.resolution,
        zoom: 0
      }))
    },
    initmegaregionCropsGrandCoulee: function () {
      this.initBaseMap()
      this.olmap.on('pointermove', (e) => {
        this.mousePosition = this.olmap.getEventPixel(e.originalEvent)
        this.olmap.render()
      })
      this.olmap.setLayerGroup(new Group({
        layers: this.grandCouleeLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.coulee.center),
        resolution: this.centerPoints.coulee.resolution,
        zoom: 0
      }))
    },
    initmegaregionCropsBasinProject: function () {
      this.initBaseMap()
      this.olmap.on('pointermove', (e) => {
        const feature = this.olmap.forEachFeatureAtPixel(e.pixel, (feature) => { return feature })
        if (feature) {
          const props = feature.getProperties()
          if (props.CropGroup && props.key) {
            this.$refs.titletipContent.innerHTML = props.key
            this.titletip.setPosition(e.coordinate)
          }
        } else {
          this.closeTitletip()
        }
      })
      this.olmap.setLayerGroup(new Group({
        layers: this.basinProjectLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.basin.center),
        resolution: this.centerPoints.basin.resolution,
        zoom: 0
      }))
    },
    computeQuadKey: function (x, y, z) {
      let quadKeyDigits = []
      for (let i = z; i > 0; i--) {
        let digit = 0
        const mask = 1 << (i - 1)
        if ((x & mask) !== 0) {
          digit++
        }
        if ((y & mask) !== 0) {
          digit = digit + 2
        }
        quadKeyDigits.push(digit)
      }
      return quadKeyDigits.join('')
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
