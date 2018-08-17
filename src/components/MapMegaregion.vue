<template>
  <div id="map" ref="map">
    <div ref="popup" class="ol-popup">
      <div ref="popupCloser" class="ol-popup-closer" v-on:click="closePopup"></div>
      <div class="ol-popup-content" ref="popupContent"></div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Vue from 'vue'
import Timeline from 'vue-tweet-embed/timeline'
import 'ol/ol.css'
import {Map, View, Overlay} from 'ol'
import {Tile, Vector as VectorLayer, Group} from 'ol/layer'
import {XYZ, Vector as VectorSource, BingMaps} from 'ol/source' // OSM
import {GeoJSON} from 'ol/format'
import {Style, Stroke, Fill, Icon} from 'ol/style'
import {fromLonLat} from 'ol/proj'
import {ScaleLine, defaults as defaultControls} from 'ol/control'

export default {
  name: 'MapMegaregion',
  data: function () {
    return {
      olmap: undefined,
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
      } // end centerPoints
    }
  },
  computed: {
    // mix the getters from vuex store into computed with object spread operator
    ...mapGetters([
      'asideHidden'
    ]),
    popup: function () {
      return new Overlay({
        element: this.$refs.popup,
        autoPan: true,
        autoPanAnimation: {
          duration: 250
        }
      })
    },
    baseLayers: function () {
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
        new Tile({
          source: new BingMaps({
            key: 'Asxv26hh6HvBjw5idX-d8QS5vaJH1krMPBfZKjNmLjaQyr0Sc-BrHBoatyjwzc_k',
            imagerySet: 'Aerial'
          }),
          minResolution: 2,
          maxResolution: 10
        })
      ]
    },
    energyLayers: function () {
      return [
        ...this.baseLayers,
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
        ...this.baseLayers,
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
      return [
        ...this.baseLayers,
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
        new Tile({
          source: new BingMaps({
            key: 'Asxv26hh6HvBjw5idX-d8QS5vaJH1krMPBfZKjNmLjaQyr0Sc-BrHBoatyjwzc_k',
            imagerySet: 'Aerial'
          }),
          minResolution: 2,
          maxResolution: 10
        })
      ]
    },
    basinProjectLayers: function () {
      return [
        ...this.baseLayers,
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
        new Tile({
          source: new BingMaps({
            key: 'Asxv26hh6HvBjw5idX-d8QS5vaJH1krMPBfZKjNmLjaQyr0Sc-BrHBoatyjwzc_k',
            imagerySet: 'Aerial'
          }),
          minResolution: 2,
          maxResolution: 10
        })
      ]
    }

  },
  watch: {
    '$route' (to, from) {
      // react to route changes...
      this.closePopup()
      this.initMap()
    },
    'asideHidden' () {
      // update map size when aside content is toggled
      this.olmap.updateSize()
    }
  },
  mounted: function () {
    this.initMap()
  },
  methods: {
    closePopup: function () {
      this.popup.setPosition(undefined)
      this.$refs.popupCloser.blur()
      return false
    },
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
        case 'megaregionGrandCoulee':
          this.initMegaregionGrandCoulee()
          break
        case 'megaregionBasinProject':
          this.initMegaregionBasinProject()
          break
        default:
      }
    },
    initBaseMap: function () {
      if (!this.olmap) {
        this.olmap = new Map({
          target: 'map',
          overlays: [this.popup],
          controls: defaultControls({
            attributionOptions: {
              collapsible: true
            }
          }).extend([
            new ScaleLine({
              units: 'us',
              minWidth: 150
            })
          ])
        })
        // #TODO: improve this popup logic...
        this.olmap.on('singleclick', (e) => {
          const feature = this.olmap.forEachFeatureAtPixel(e.pixel, (feature) => { return feature })
          if (feature) {
            const props = feature.getProperties()
            console.log('has feature! props:', props)
            if (props) { // #TODO: fix geoJSON properties, use props.timeline key instead of props.title  for iframe & html file
              const TimelineCtor = Vue.extend(Timeline)
              new TimelineCtor({
                propsData: {
                  id: 'NoMethanol', // #TODO: use this.props.timeline,
                  sourceType: 'profile'
                }
              }).$mount(this.$refs.popupContent)
              this.popup.setPosition(e.coordinate)
            }
          } // #NOTE: use `else { this.closePopup() }` to close popup when clicking somewhere else on the map.
        })
        window.addEventListener('keydown', (e) => {
          // close popup if esc key pressed
          if (e.keyCode === 27) {
            this.closePopup()
          }
        })

        this.olmap.on('pointermove', (e) => {
          // if (e.dragging) {
          //   this.closePopup()
          //   return
          // }
          var pixel = this.olmap.getEventPixel(e.originalEvent)
          var hit = this.olmap.hasFeatureAtPixel(pixel)
          this.$refs.map.style.cursor = hit ? 'pointer' : ''
        })
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
    initMegaregionGrandCoulee: function () {
      this.initBaseMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.grandCouleeLayers
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.coulee.center),
        resolution: this.centerPoints.coulee.resolution,
        zoom: 0
      }))
    },
    initMegaregionBasinProject: function () {
      this.initBaseMap()
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
    makeGeoJSONPointVectorLayer: function (url, iconPath, label, minResolution, maxResolution) {
      return new VectorLayer({
        source: new VectorSource({
          url: url,
          format: new GeoJSON()
        }),
        minResolution: minResolution,
        maxResolution: maxResolution,
        style: new Style({
          image: new Icon({
            src: iconPath
          })
        }),
        label: label
      })
    },
    makeGeoJSONFillVectorLayer: function (url, minResolution, maxResolution, strokeColor, width, fillColor) {
      return new VectorLayer({
        source: new VectorSource({
          format: new GeoJSON(),
          url: url
        }),
        minResolution: minResolution,
        maxResolution: maxResolution,
        style: new Style({
          stroke: new Stroke({
            color: strokeColor,
            width: width
          }),
          fill: new Fill({
            color: fillColor
          })
        }),
        fill: fillColor,
        fillColor: fillColor
      })
    }
  }
}
</script>
