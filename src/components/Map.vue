<template>
  <div id="map" ref="map">
    <div ref="popup" class="ol-popup">
      <div ref="popupCloser" class="ol-popup-closer" v-on:click="closePopup"></div>
      <div class="ol-popup-content" ref="popupContent"></div>
      <div class="ol-popup-twitter-content"><div ref="twitterContent"></div></div>
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
import Vue from 'vue'
import Timeline from 'vue-tweet-embed/timeline'
import 'ol/ol.css'
import {Map, Overlay} from 'ol'
import {Vector as VectorLayer} from 'ol/layer'
import {Vector as VectorSource} from 'ol/source' // OSM
import {GeoJSON} from 'ol/format'
import {Style, Stroke, Fill, Icon} from 'ol/style'
import {ScaleLine, defaults as defaultControls} from 'ol/control'

export default {
  name: 'Map',
  data: function () {
    return {
      olmap: undefined
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
            } else if (props) { // #TODO: fix geoJSON properties, use props.timeline key instead of props.title  for iframe & html file
              this.$refs.popupContent.classList.add('hidden')
              this.$refs.twitterContent.classList.remove('hidden')
              const TimelineCtor = Vue.extend(Timeline)
              new TimelineCtor({
                propsData: {
                  id: 'NoMethanol', // #TODO: use this.props.timeline,
                  sourceType: 'profile'
                }
              }).$mount(this.$refs.twitterContent)
              this.popup.setPosition(e.coordinate)
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
        this.olmap.on('pointermove', (e) => {
          var pixel = this.olmap.getEventPixel(e.originalEvent)
          var hit = this.olmap.hasFeatureAtPixel(pixel)
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
    }
  }
}
</script>
