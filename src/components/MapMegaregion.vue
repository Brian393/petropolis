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
  name: 'MapMegaregion',
  extends: Map,
  data: function () {
    return {
      centerPoints: {
        introductionmetro: {
          center: [-122.4, 45.564222],
          resolution: 200
        },
        vanport: {
          center: [ -122.7, 45.601 ],
          resolution: 3
        },
        slough: {
          center: [ -122.73, 45.618 ],
          resolution: 11
        },
        willamette: {
          center: [ -122.718, 45.588 ],
          resolution: 22
        },
        energy: {
          center: [-120.1, 47.1],
          resolution: 798
        },
        crops: {
          center: [-119.9, 46.49],
          resolution: 700
        },
        coulee: {
          center: [-118.989, 47.948],
          resolution: 6
        },
        basin: {
          center: [-119.4, 47.0],
          resolution: 140
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
        minResolution: 1,
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
          minResolution: 800,
          maxZoom: 21
        }),
        // tiles[6]
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'https://{a-d}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 1,
          maxResolution: 40,
          loadTilesWhileAnimating: true,
          loadTilesWhileInteracting: true
        }),
        // tiles[7]
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'https://{a-d}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png'
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
          minResolution: 200,
          maxZoom: 21 // XYZ's default is 18
        }),
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://ecotopia.today/cascadia/Tiles/PDX-new/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 1,
          maxResolution: 1600
        }),
        // openrailwaymap
        new Tile({
          title: 'OpenRailwayMap',
          visible: true,
          minResolution: 40,
          opacity: 1,
          source: new XYZ({
            url: 'https://{a-c}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png',
            crossOrigin: null, // make it work inside canvas
            tilePixelRatio: 2, // server returns 512px img for 256 tiles
            maxZoom: 21, // XYZ's default is 18
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
              return 'https://t0.tiles.virtualearth.net/tiles/t' + this.computeQuadKey(x, y, z) + '.jpg'
            }
          }),
          maxZoom: 17, // XYZ's default is 18
          loadTilesWhileAnimating: true,
          loadTilesWhileInteracting: true
        }),
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
    vanportLayers: function () {
      return [
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'https://{a-d}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minZoom: 11,
          maxZoom: 20,
          loadTilesWhileAnimating: true,
          loadTilesWhileInteracting: true
        }),
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://ecotopia.today/cascadia/Tiles/Crops/{z}/{x}/{y}.png'
          }),
          opacity: 0.4,
          minZoom: 11,
          maxZoom: 20
        }),
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://ecotopia.today/cascadia/Tiles/PDX-new/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minZoom: 11,
          maxZoom: 20
        }),
        this.makeGeoJSONFillVectorLayer('geojson/VanUnderlayer.geojson', 0.25, 160, 'rgba(0,0,0, 0.99)', 1, 'rgba(0,0,0, 0.99)'),
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://ecotopia.today/cascadia/Tiles/Vanport/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minZoom: 7,
          maxZoom: 20
        }),
        this.makeGeoJSONPointVectorLayer('geojson/Breach.geojson', 'icons/Breach.png', null, 1, 2000)
      ]
    },
    mosaicLayers: function () {
      return [
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'https://{a-d}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minZoom: 11,
          maxZoom: 20,
          loadTilesWhileAnimating: true,
          loadTilesWhileInteracting: true
        }),
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://ecotopia.today/cascadia/Tiles/Crops/{z}/{x}/{y}.png'
          }),
          opacity: 0.4,
          minZoom: 11,
          maxZoom: 20
        }),
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://ecotopia.today/cascadia/Tiles/PDX-new/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minZoom: 11,
          maxZoom: 20
        }),
        this.makeGeoJSONFillVectorLayer('geojson/VanUnderlayer.geojson', 0.25, 160, 'rgba(0,0,0, 0.99)', 1, 'rgba(0,0,0, 0.99)'),
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://ecotopia.today/cascadia/Tiles/Vanport/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minZoom: 7,
          maxZoom: 20
        }),
        this.makeGeoJSONPointVectorLayer('geojson/VanportMosaic.geojson', 'icons/Mosaic.png', null, 1, 2000)
      ]
    },
    willametteLayers: function () {
      let bingMapTile = new Tile({
        source: new BingMaps({
          key: 'Asxv26hh6HvBjw5idX-d8QS5vaJH1krMPBfZKjNmLjaQyr0Sc-BrHBoatyjwzc_k',
          imagerySet: 'Aerial'
        }),
        minResolution: 0.125,
        maxResolution: 1
      })
      bingMapTile.on('precompose', (e) => {
        this.spyglass(e)
      })
      bingMapTile.on('postcompose', function (e) {
        e.context.restore()
      })

      return [
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'https://{a-d}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minZoom: 11,
          maxZoom: 20,
          loadTilesWhileAnimating: true,
          loadTilesWhileInteracting: true
        }),
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://ecotopia.today/cascadia/Tiles/Willamette2/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minZoom: 11,
          maxZoom: 20
        }),
        this.makeGeoJSONFillVectorLayer('geojson/UplandHighPriority.geojson', 0.5, 23, 'rgba(190, 141, 143, 0)', 1, 'rgba(209, 4, 4, 0)'),
        this.makeGeoJSONFillVectorLayer('geojson/UplandMedPriority.geojson', 0.5, 23, 'rgba(190, 141, 143, 0)', 1, 'rgba(209, 4, 4, 0)'),
        this.makeGeoJSONFillVectorLayer('geojson/UplandLowPriority.geojson', 0.5, 23, 'rgba(190, 141, 143, 0)', 1, 'rgba(209, 4, 4, 0'),
        this.makeGeoJSONFillVectorLayer('geojson/UplandNoPriority.geojson', 0.5, 23, 'rgba(190, 141, 143, 0)', 1, 'rgba(209, 4, 4, 0)'),
        this.makeGeoJSONFillVectorLayer('geojson/EnhancedNaturalRecovery.geojson', 0.5, 16, 'rgba(185, 12, 14, 0.0)', 0.5, 'rgba(255, 0, 0, 0.0)'),
        this.makeGeoJSONFillVectorLayer('geojson/DredgeWithCap.geojson', 0.5, 16, 'rgba(185, 12, 14, 0.0)', 0.5, 'rgba(255, 0, 0, 0.0)'),
        this.makeGeoJSONFillVectorLayer('geojson/DredgeFMD.geojson', 0.5, 16, 'rgba(185, 12, 14, 0.0)', 0.5, 'rgba(255, 0, 0, 0.0)'),
        this.makeGeoJSONFillVectorLayer('geojson/Dredge.geojson', 0.5, 16, 'rgba(185, 12, 14, 0.0)', 0.5, 'rgba(255, 0, 0, 0.0)'),
        this.makeGeoJSONFillVectorLayer('geojson/ContaminatedBanks.geojson', 0.5, 16, 'rgba(185, 12, 14, 0.0)', 0.5, 'rgba(255, 0, 0, 0.0)'),
        this.makeGeoJSONFillVectorLayer('geojson/Cap.geojson', 0.5, 16, 'rgba(185, 12, 14, 0.0)', 0.5, 'rgba(255, 0, 0, 0.0)'),
        this.makeGeoJSONFillVectorLayer('geojson/MCormick&BaxterCap2005.geojson', 0.5, 16, 'rgba(185, 12, 14, 0.0)', 0.5, 'rgba(255, 0, 0, 0.0)'),
        bingMapTile
      ]
    },
    droneLayers: function () {
      let bingMapTile = new Tile({
        source: new BingMaps({
          key: 'Asxv26hh6HvBjw5idX-d8QS5vaJH1krMPBfZKjNmLjaQyr0Sc-BrHBoatyjwzc_k',
          imagerySet: 'Aerial'
        }),
        minResolution: 0.25,
        maxResolution: 1
      })
      bingMapTile.on('precompose', (e) => {
        this.spyglass(e)
      })
      bingMapTile.on('postcompose', function (e) {
        e.context.restore()
      })

      return [
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'https://{a-d}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minZoom: 11,
          maxZoom: 20,
          loadTilesWhileAnimating: true,
          loadTilesWhileInteracting: true
        }),
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://ecotopia.today/cascadia/Tiles/Willamette/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minZoom: 11,
          maxZoom: 20
        }),
        this.makeGeoJSONFillVectorLayer('geojson/Upland_Sites.geojson', 0.5, 40, 'rgba(185, 12, 14, 0.70)', 0.5, 'rgba(185, 12, 14, 0.4)'),
        bingMapTile,
        this.makeGeoJSONPointVectorLayer('geojson/Drone.geojson', 'icons/Drone.png', null, 1, 8000)
      ]
    },
    sloughLayers: function () {
      return [
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'https://{a-d}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minZoom: 11,
          maxZoom: 20,
          loadTilesWhileAnimating: true,
          loadTilesWhileInteracting: true
        }),
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://ecotopia.today/cascadia/Tiles/Slough/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minZoom: 7,
          maxZoom: 20
        })
      ]
    },
    energyLayers: function () {
      return [
        ...this.baseLayers,
        new VectorLayer({
          source: new VectorSource({
            format: new GeoJSON(),
            url: 'geojson/BPA2.geojson'
          }),
          minResolution: 80,
          maxResolution: 8000,
          style: new Style({
            stroke: new Stroke({
              width: 4,
              color: 'rgba(0, 0, 225, 0.8)',
              lineDash: [8, 16],
              lineDashOffset: 12
            })
          })
        }),
        this.makeGeoJSONPointVectorLayer('geojson/CascadiaHydro2.geojson', 'icons/dam.png', 'Hydro power', 2, 4000),
        // mega[7]
        this.makeGeoJSONPointVectorLayer('geojson/CascadiaNuclear.geojson', 'icons/nukes.gif', 'Nuclear power', 2, 4000),
        // mega[9]
        this.makeGeoJSONPointVectorLayer('geojson/CascadiaWind.geojson', 'icons/wind.png', 'Wind Power', 2, 4000),
        // mega[10]
        this.makeGeoJSONPointVectorLayer('geojson/CascadiaNatGas.geojson', 'icons/natgas.png', 'Natural Gas', 2, 4000),
        // mega[8]
        this.makeGeoJSONPointVectorLayer('geojson/CascadiaCoal.geojson', 'icons/coal.png', 'Coal Power', 2, 4000)
      ]
    },
    cropsLayers: function () {
      return [
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'https://{a-d}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
          }),
          opacity: 1,
          minResolution: 2,
          maxResolution: 16000,
          loadTilesWhileAnimating: true,
          loadTilesWhileInteracting: true
        }),
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
    basinProjectLayers: function () {
      let bingMapTile = new Tile({
        source: new BingMaps({
          key: 'Asxv26hh6HvBjw5idX-d8QS5vaJH1krMPBfZKjNmLjaQyr0Sc-BrHBoatyjwzc_k',
          imagerySet: 'Aerial'
        }),
        minResolution: 1,
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
            url: 'https://{a-d}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'}),
          opacity: 1,
          minResolution: 1,
          maxResolution: 16000
        }),
        // tiles[22]
        new Tile({
          preload: Infinity,
          source: new XYZ({
            url: 'http://ecotopia.today/cascadia/Tiles/Crops/{z}/{x}/{y}.png'
          }),
          opacity: 0.3,
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
        this.makeGeoJSONFillVectorLayer('geojson/CBP-Crops.geojson', 2, 181, 'rgba(189, 7, 97, 0)', 0, 'rgba(189, 7, 97, 0)'),
        // bingMapsAerial3
        bingMapTile
      ]
    }

  },
  components: {
    VideoLightBox
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
        } else if (props.key6) {
          this.$refs.whitetitletipContent.innerHTML = props.key6
          this.whitetitletip.setPosition(e.coordinate)
        } else if (props.key5) {
          this.$refs.titletipContent.innerHTML = props.key5
          this.titletip.setPosition(e.coordinate)
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
      switch (this.$route.name) {
        case 'megaregionIntroduction':
          this.initMegaregionIntroduction()
          break
        case 'megaregionVanport':
          this.initMegaregionVanport()
          break
        case 'megaregionVanportMosaic':
          this.initMegaregionVanportMosaic()
          break
        case 'megaregionWillamette':
          this.initMegaregionWillamette()
          break
        case 'megaregionWillametteDrone':
          this.initMegaregionWillametteDrone()
          break
        case 'megaregionWillametteSlough':
          this.initMegaregionWillametteSlough()
          break
        case 'megaregionEnergy':
          this.initMegaregionEnergy()
          break
        case 'megaregionCrops':
          this.initMegaregionCrops()
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
        minResolution: 1,
        maxResolution: 32000
      }))
    },
    initMegaregionVanport: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.vanportLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.vanport.center),
        resolution: this.centerPoints.vanport.resolution,
        minZoom: 11,
        maxZoom: 19,
        rotation: -0.41
      }))
    },
    initMegaregionVanportMosaic: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.mosaicLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.vanport.center),
        resolution: this.centerPoints.vanport.resolution,
        minZoom: 11,
        maxZoom: 19,
        rotation: -0.41
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
    initMegaregionWillamette: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.willametteLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.willamette.center),
        resolution: this.centerPoints.willamette.resolution,
        minZoom: 9,
        maxZoom: 20
      }))
    },
    initMegaregionWillametteDrone: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.droneLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.willamette.center),
        resolution: this.centerPoints.willamette.resolution,
        minZoom: 11,
        maxZoom: 19
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
    initMegaregionWillametteSlough: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.sloughLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.slough.center),
        resolution: this.centerPoints.slough.resolution,
        minZoom: 11,
        maxZoom: 19
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
        minResolution: 1,
        maxResolution: 4000
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
        minResolution: 2,
        maxResolution: 2000
      }))
    },
    initmegaregionCropsBasinProject: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.basinProjectLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.basin.center),
        resolution: this.centerPoints.basin.resolution,
        minResolution: 2,
        maxResolution: 2000
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
