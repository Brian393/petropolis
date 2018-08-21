<template>
  <div id="map" ref="map">
    <div ref="popup" class="ol-popup">
      <div ref="popupCloser" class="ol-popup-closer" v-on:click="closePopup"></div>
      <div class="ol-popup-content" ref="popupContent"></div>
      <div class="ol-popup-twitter-content"><div ref="loadingTweets" class="hidden">Loading Tweets...</div><div ref="twitterContent"></div></div>
    </div>
    <div ref="titletip" class="titletip">
      <div class="titletip-content" ref="titletipContent"></div>
    </div>
    <div ref="tooltip" class="ol-tooltip">
    </div>
  </div>
</template>

<script>
/* Map base component
 * common logic shared by other Map components
 * do not use this component directly
*/

import {mapGetters} from 'vuex'
import 'ol/ol.css'
import {Map, Overlay, View} from 'ol'
import {Vector as VectorLayer} from 'ol/layer'
import {Vector as VectorSource} from 'ol/source' // OSM
import {GeoJSON} from 'ol/format'
import {Style, Stroke, Fill, Icon} from 'ol/style'
import {ScaleLine, defaults as defaultControls} from 'ol/control'
import {fromLonLat} from 'ol/proj'

import {eventBus} from '../main'

export default {
  name: 'Map',
  data: function () {
    return {
      olmap: undefined
    }
  },
  created: function () {
    eventBus.$on('set-map-view', this.setMapView)
  },
  beforeDestroy: function () {
    eventBus.$off('set-map-view', this.setMapView)
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
    titletip: function () {
      return new Overlay({
        element: this.$refs.titletip,
        offset: [10, 0],
        positioning: 'center-left'
      })
    },
    tooltip: function () {
      return new Overlay({
        element: this.$refs.tooltip,
        offset: [10, 0],
        positioning: 'center-left'
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
      this.toggleScaleLine()
    }
  },
  methods: {
    initMap: function () {
      // NOTE: the extended class needs to implement initMap()
    },
    initBaseMap: function () {
      if (!this.olmap) {
        this.olmap = new Map({
          target: 'map',
          overlays: [this.popup, this.titletip, this.tooltip],
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
        this.toggleScaleLine()
        this.olmap.on('singleclick', (e) => {
          const feature = this.olmap.forEachFeatureAtPixel(e.pixel, (feature) => { return feature })
          if (feature) {
            const props = feature.getProperties()
            console.log('has feature! props:', props)
            // #TODO: use better property names in .geojson files for if/else logic
            if (props.title && props.image && props.text1) {
              this.$refs.popupContent.classList.remove('hidden')
              this.$refs.twitterContent.classList.add('hidden')
              this.$refs.popupContent.innerHTML = '<h4>' + props.title + '</h4>'
              this.$refs.popupContent.innerHTML += props.image ? props.image.replace('cascadia/', '') : ''
              this.$refs.popupContent.innerHTML += props.text1 + '<br>'
              this.$refs.popupContent.innerHTML += props.text2 ? props.text2 + '<br>' : ''
              this.$refs.popupContent.innerHTML += props.text3 ? props.text3 + '<br>' : ''
              this.popup.setPosition(e.coordinate)
              this.closeTooltip()
            } else if (props.key2) {
              this.$refs.popupContent.classList.remove('hidden')
              this.$refs.twitterContent.classList.add('hidden')
              this.$refs.popupContent.innerHTML = props.key2.replace('cascadia/', '')
              this.popup.setPosition(e.coordinate)
            } else if (props.title) {
              this.$refs.popupContent.classList.remove('hidden')
              this.$refs.twitterContent.classList.add('hidden')
              this.$refs.popupContent.innerHTML = props.title
              this.popup.setPosition(e.coordinate)
            } else if (props.key) {
              this.$refs.popupContent.classList.remove('hidden')
              this.$refs.twitterContent.classList.add('hidden')
              this.$refs.popupContent.innerHTML = props.key
              this.popup.setPosition(e.coordinate)
            } else if (props.timeline) {
              if (window.twttr) {
                this.$refs.popupContent.classList.add('hidden')
                this.$refs.twitterContent.classList.remove('hidden')
                this.$refs.loadingTweets.classList.remove('hidden')
                this.$refs.twitterContent.innerHTML = ''
                window.twttr.widgets.createTimeline(
                  {
                    sourceType: 'url',
                    url: props.timeline
                  },
                  this.$refs.twitterContent
                ).then(() => {
                  this.$refs.loadingTweets.classList.add('hidden')
                })
                this.popup.setPosition(e.coordinate)
              }
            }
          } else {
            this.closePopup()
          }
        })
        window.addEventListener('keydown', (e) => {
          // close popup if esc key pressed
          if (e.keyCode === 27) {
            this.closePopup()
          }
        })
        window.addEventListener('resize', (e) => {
          this.toggleScaleLine()
        })
        this.olmap.on('pointermove', (e) => {
          const pixel = this.olmap.getEventPixel(e.originalEvent)
          const hit = this.olmap.hasFeatureAtPixel(pixel)
          this.$refs.map.style.cursor = hit ? 'pointer' : ''
        })
      }
    },
    closePopup: function () {
      this.popup.setPosition(undefined)
      this.$refs.popupCloser.blur()
      return false
    },
    closeTitletip: function () {
      this.titletip.setPosition(undefined)
      return false
    },
    closeTooltip: function () {
      this.tooltip.setPosition(undefined)
      return false
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
    toggleScaleLine: function () {
      if (this.asideHidden || window.innerWidth < 850) {
        document.querySelector('.ol-scale-line').classList.remove('hidden')
      } else {
        document.querySelector('.ol-scale-line').classList.add('hidden')
      }
    },
    setMapView: function (optz = {}) {
      let viewOptz = {}
      if (optz.center) {
        viewOptz['center'] = fromLonLat(optz['center'])
      }
      if (optz.resolution) {
        viewOptz['resolution'] = optz.resolution
      }
      if (optz.minResolution) {
        viewOptz['minResolution'] = optz.minResolution
      } else {
        viewOptz['minResolution'] = 1
      }
      if (optz.maxResolution) {
        viewOptz['maxResolution'] = optz.maxResolution
      } else {
        viewOptz['maxResolution'] = 16000
      }
      this.olmap.setView(new View(viewOptz))
    }
  }
}
</script>
