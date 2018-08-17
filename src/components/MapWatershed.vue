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
import {Tile, Vector as VectorLayer, Group} from 'ol/layer' // TileLayer Group
import {XYZ, Vector as VectorSource} from 'ol/source' // OSM
import {GeoJSON} from 'ol/format'
import {Style, Stroke, Fill, Icon} from 'ol/style'
import {fromLonLat} from 'ol/proj'
import {ScaleLine} from 'ol/control'

export default {
  name: 'Map',
  data: function () {
    return {
      olmap: undefined,
      centerPoints: {
        // #TODO: these probably could have better names like watershedIntroduction, watershedHanford, watershedHanfordLegacy to be a bit more semantically obvious
        introductionwater: {
          center: [-118.8, 46.1],
          resolution: 700
        },
        introductionbio: {
          center: [-121.2, 51.0],
          resolution: 4500
        },
        terminals: {
          center: [-122.68, 45.84],
          resolution: 220
        },
        hanford1: {
          center: [-119.46, 46.637574],
          resolution: 70
        },
        legacy: {
          center: [-119.5199, 46.555],
          resolution: 6
        },
        floods: {
          center: [-119.46, 46.607574],
          resolution: 50
        },
        plumes: {
          center: [-119.46, 46.607574],
          resolution: 50
        },
        stopit: {
          center: [-122.68, 45.84],
          resolution: 220
        },
        dams: {
          center: [-117.9, 46.9],
          resolution: 700
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
    initMap: function () {
      switch (this.$route.name) {
        case 'watershedIntroduction':
          this.initWatershedIntro()
          break
        case 'watershedTerminals':
          this.initWatershedTerminals()
          break
        case 'watershedDams':
          this.initWatershedDams()
          break
        case 'watershedHanford':
          this.initWatershedHanford()
          break
        case 'watershedHanfordLegacy':
          this.initWatershedHanfordLegacy()
          break
        case 'watershedHanfordPlumes':
          this.initWatershedHanfordPlumes()
          break
        case 'watershedHanfordFloods':
          this.initWatershedHanfordFloods()
          break
        default:
          this.initWatershedIntro()
      }
    },
    makeGeoJSONPointVectorLayer: function (url, iconPath, minResolution, maxResolution) {
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
        })
      })
    },
    makeGeoJSONLineVectorLayer: function (url, minResolution, maxResolution, strokeColor, width) {
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
          })
        }),
        strokeColor: strokeColor
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
    },
    watershedBaseLayers: function () {
      // #TODO: this could be a computed property.
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
          opacity: 0.9,
          minResolution: 1,
          maxResolution: 8
        })
      ]
    },
    initBaseWatershedMap: function () {
      if (!this.olmap) {
        this.olmap = new Map({
          target: 'map',
          layers: this.watershedBaseLayers(),
          overlays: [this.popup],
          controls: [
            new ScaleLine({
              units: "us",
              minWidth: 150
            })
          ]
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
    initWatershedIntro: function () {
      this.initBaseWatershedMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.watershedBaseLayers()
      }))
      this.olmap.setView(new View({
        center: fromLonLat(this.centerPoints.introductionwater.center),
        resolution: this.centerPoints.introductionwater.resolution,
        zoom: 0
      }))
    },
    initWatershedTerminals: function () {
      this.initBaseWatershedMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.watershedBaseLayers().concat([
          this.makeGeoJSONPointVectorLayer('geojson/stopped.geojson', 'icons/stop.png', 2, 32000),
          this.makeGeoJSONPointVectorLayer('geojson/planned.geojson', 'icons/stopit.png', 2, 32000)
        ])
      }))
      this.olmap.setView(
        new View({
          center: fromLonLat(this.centerPoints.terminals.center),
          resolution: this.centerPoints.terminals.resolution,
          zoom: 0
        })
      )
    },
    initWatershedDams: function () {
      this.initBaseWatershedMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.watershedBaseLayers().concat([
          this.makeGeoJSONPointVectorLayer('geojson/Rapids.geojson', 'icons/waterfall.png', 2, 32000),
          this.makeGeoJSONPointVectorLayer('geojson/MajorHydroCRB.geojson', 'icons/damOther.png', 2, 32000),
          this.makeGeoJSONPointVectorLayer('geojson/Bureau.geojson', 'icons/damBR.png', 2, 32000),
          this.makeGeoJSONPointVectorLayer('geojson/ArmyCorps.geojson', 'icons/damAC.png', 2, 32000)
        ])
      }))
      this.olmap.setView(
        new View({
          center: fromLonLat(this.centerPoints.dams.center),
          resolution: this.centerPoints.dams.resolution,
          zoom: 0
        })
      )
    },
    initWatershedHanford: function () {
      this.initBaseWatershedMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.watershedBaseLayers().concat([
          new Tile({
            preload: Infinity,
            source: new XYZ({
              url: 'http://ecotopia.today/cascadia/Tiles/Hanford/{z}/{x}/{y}.png'
            }),
            opacity: 1,
            minResolution: 1,
            maxResolution: 160
          })
        ])
      }))
      this.olmap.setView(
        new View({
          center: fromLonLat(this.centerPoints.hanford1.center),
          resolution: this.centerPoints.hanford1.resolution,
          zoom: 0
        })
      )
    },
    initWatershedHanfordLegacy: function () {
      this.initBaseWatershedMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.watershedBaseLayers().concat([
          new Tile({
            preload: Infinity,
            source: new XYZ({
              url: 'http://ecotopia.today/cascadia/Tiles/Hanford/{z}/{x}/{y}.png'
            }),
            opacity: 1,
            minResolution: 2,
            maxResolution: 80
          }),
          new Tile({
            preload: Infinity,
            source: new XYZ({
              url: 'http://ecotopia.today/cascadia/Tiles/Leaks/{z}/{x}/{y}.png'
            }),
            opacity: 1,
            minResolution: 2,
            maxResolution: 80
          }),
          this.makeGeoJSONFillVectorLayer('geojsons/HanfordLabels.geojson', 1, 80, 'rgba(60, 20, 20, 0.0)', 2, 'rgba(255, 255, 0, 0.0)')
        ])
      }))
      this.olmap.setView(
        new View({
          center: fromLonLat(this.centerPoints.legacy.center),
          resolution: this.centerPoints.legacy.resolution,
          zoom: 0
        })
      )
    },
    initWatershedHanfordPlumes: function () {
      this.initBaseWatershedMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.watershedBaseLayers().concat([
          new Tile({
            preload: Infinity,
            source: new XYZ({
              url: 'http://ecotopia.today/cascadia/Tiles/Hanford/{z}/{x}/{y}.png'
            }),
            opacity: 1,
            minResolution: 2,
            maxResolution: 80
          }),
          new Tile({
            preload: Infinity,
            source: new XYZ({
              url: 'http://ecotopia.today/cascadia/Tiles/Leaks/{z}/{x}/{y}.png'
            }),
            opacity: 1,
            minResolution: 2,
            maxResolution: 80
          }),
          new Tile({
            preload: Infinity,
            source: new XYZ({
              url: 'http://ecotopia.today/cascadia/Tiles/HanfordPlumes/{z}/{x}/{y}.png'
            }),
            opacity: 1,
            minResolution: 2,
            maxResolution: 80
          })
        ])
      }))
      this.olmap.setView(
        new View({
          center: fromLonLat(this.centerPoints.plumes.center),
          resolution: this.centerPoints.plumes.resolution,
          zoom: 0
        })
      )
    },
    initWatershedHanfordFloods: function () {
      this.initBaseWatershedMap()
      this.olmap.setLayerGroup(new Group({
        layers: this.watershedBaseLayers().concat([
          new Tile({
            preload: Infinity,
            source: new XYZ({
              url: 'http://ecotopia.today/cascadia/Tiles/Floods/{z}/{x}/{y}.png'
            }),
            opacity: 0.7,
            minResolution: 2,
            maxResolution: 16000
          })
        ])
      }))
      this.olmap.setView(
        new View({
          center: fromLonLat(this.centerPoints.floods.center),
          resolution: this.centerPoints.floods.resolution,
          zoom: 0
        })
      )
    },
    closePopup: function () {
      this.popup.setPosition(undefined)
      this.$refs.popupCloser.blur()
      return false
    }
  }
}
</script>
