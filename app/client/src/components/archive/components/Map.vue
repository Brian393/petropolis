<template>
  <div id="map" ref="map">
    <div class="spotlightControls" ref="spotlightControls">
      press ↑ or ↓ to change spotlight size
    </div>
    <div class="ol-control locateMe-control">
      <button class="locateMe" title="Locate me">◎</button>
    </div>
    <div ref="vimeoPopup" class="ol-popup ol-vimeopopup">
      <div
        ref="vimeoPopupCloser"
        class="ol-popup-closer"
        v-on:click="closePopup"
      ></div>
      <div class="ol-popup-content" ref="vimeoPopupContent"></div>
    </div>
    <div ref="popup" class="ol-popup">
      <div
        ref="popupCloser"
        class="ol-popup-closer"
        v-on:click="closePopup"
      ></div>
      <div class="ol-popup-content" ref="popupContent"></div>
      <div v-if="activeFeature" class="zoomToFeature">
        <a
          v-if="
            !popupConfig.hiddenLayerNames.includes(getLayerName(activeLayer))
          "
          href="javascript:void(0)"
          @click="zoomToFeature()"
        >
          <strong>{{
            activeFeature.getGeometry().getType() === 'Point'
              ? 'DIVE'
              : 'VIEW WHOLE FEATURE'
          }}</strong>
        </a>
      </div>
    </div>
    <div ref="titletip" class="titletip">
      <div class="titletip-content" ref="titletipContent"></div>
    </div>
    <div ref="tooltip" class="ol-tooltip"></div>
    <app-lightbox ref="lightbox" :images="lightBoxImages"></app-lightbox>
  </div>
</template>

<script>
/* Map base component
 * common logic shared by other Map components
 * do not use this component directly
 */

import { mapGetters } from 'vuex'

import 'ol/ol.css'
import { Map, Overlay, View } from 'ol'
import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source' // OSM
import VectorTileLayer from 'ol/layer/VectorTile'
import MVT from 'ol/format/MVT'
import VectorTileSource from 'ol/source/VectorTile'

import { popupInfoStyle, baseStyle } from '../style/OlStyleDefs'

import { GeoJSON } from 'ol/format'
import { Style, Stroke, Fill, Icon, Circle } from 'ol/style'
import { ScaleLine, defaults as defaultControls, Control } from 'ol/control'
import { fromLonLat } from 'ol/proj'
import { circular } from 'ol/geom/Polygon'
import { eventBus } from '../main'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import AppLightBox from './AppLightBox'

import UrlUtil from '../utils/Url'
import { getLayerName } from '../utils/MapUtils'

export default {
  name: 'Map',
  components: {
    'app-lightbox': AppLightBox
  },
  data: function() {
    return {
      olmap: undefined,
      activeFeature: null,
      popupInfoLayerSource: null,
      lightBoxImages: [],
      popupConfig: null // Data is fetched on load but we store it here when the user click the map
    }
  },
  created: function() {
    eventBus.$on('set-map-view', this.setMapView)
  },
  beforeDestroy: function() {
    eventBus.$off('set-map-view', this.setMapView)
  },
  computed: {
    // mix the getters from vuex store into computed with object spread operator
   ...mapGetters("app",{
     asideHidden: 'asideHidden'
   }),
    vimeoPopup: function() {
      return new Overlay({
        element: this.$refs.vimeoPopup,
        offset: [10, 0],
        positioning: 'center-right',
        autoPan: true,
        autoPanAnimation: {
          duration: 250
        }
      })
    },
    popup: function() {
      return new Overlay({
        element: this.$refs.popup,
        autoPan: true,
        autoPanMargin: 40,
        autoPanAnimation: {
          duration: 250
        }
      })
    },
    titletip: function() {
      return new Overlay({
        element: this.$refs.titletip,
        offset: [10, 0],
        positioning: 'center-left'
      })
    },
    tooltip: function() {
      return new Overlay({
        element: this.$refs.tooltip,
        offset: [10, 0],
        positioning: 'center-left'
      })
    }
  },
  watch: {
    $route(to, from) {
      // react to route changes...
      this.closePopup()
      this.initMap()
    },
    asideHidden() {
      // update map size when aside content is toggled
      this.olmap.updateSize()
      this.toggleScaleLine()
    }
  },
  methods: {
    getLayerName,
    initMap: function() {
      // NOTE: the extended class needs to implement initMap()
    },
    initBaseMap: function() {
      if (!this.olmap) {
        this.olmap = new Map({
          target: 'map',
          overlays: [this.popup, this.titletip, this.tooltip, this.vimeoPopup],
          controls: defaultControls({
            attributionOptions: {
              collapsible: true
            }
          }).extend([
            new ScaleLine({
              units: 'us',
              minWidth: 150
            }),
            new Control({
              element: document.querySelector('.spotlightControls')
            })
          ])
        })
        this.toggleScaleLine()
        this.olmap.on('singleclick', e => {
          let feature, layer
          this.olmap.forEachFeatureAtPixel(e.pixel, (f, l) => {
            // Order of features is based is based on zIndex. 
            // First feature is on top, last feature is on bottom.
            if (!feature) {
              feature = f
              layer = l
            }
          })
          // Check if layer is interactive
          if (layer && layer.get('isInteractive') === false) return
          this.activeLayer = layer
          if (!this.popupConfig) {
            this.popupConfig = this.$appConfig.map.popup
          }
          /**
           * MAJK: Applightbox and popup placement in sidepanel logic
           */
          // Clear popupInfo layer
          if (this.popupInfoLayerSource) {
            this.popupInfoLayerSource.clear()
          }
          // Clear lightbox images array
          if (this.lightBoxImages) {
            this.lightBoxImages = []
          }
          // Reset sidepanel html state
          if (this.sidePanelInitialHtmlState) {
            document.getElementById(
              'feature-content'
            ).innerHTML = this.sidePanelInitialHtmlState
            this.sidePanelInitialHtmlState = ''
          }

          // Reset sidepanel legend image if it's changed
          if (this.sidePanelInitialImageSrc) {
            document.getElementById(
              'sidepanel-image'
            ).src = this.sidePanelInitialImageSrc
            this.sidePanelInitialImageSrc = ''
          }

          if (feature) {
            const props = feature.getProperties()
            // Check if feature has lightbox array of images
            if (Array.isArray(props.lightbox)) {
              props.lightbox.forEach(image => {
                let imageUrl
                let caption = ''
                if (typeof image === 'object') {
                  // Image is stored as object. Get imageUrl and caption values
                  imageUrl = image.imageUrl
                  caption = image.caption
                } else {
                  // Image is stored as a string
                  imageUrl = image
                }
                const url = UrlUtil.parseUrl(imageUrl)
                this.lightBoxImages.push({
                  src: url,
                  thumb: url,
                  caption: caption
                })
              })
              // Open lightbox
              this.$refs.lightbox.open()
              // Popup will not be opened if there are lightbox images
              return
            }
  
            // Correct popup position (used feature coordinates insteaad of mouse)

            let closestPoint
            // Closest point doesn't work with vector tile layers.
            if (feature.getGeometry && feature.getGeometry().getClosestPoint) {
              closestPoint = feature.getGeometry().getClosestPoint(e.coordinate)
            } else {
              closestPoint = e.coordinate
            }

            // ===///// ===

            // #TODO: use better property names in .geojson files for if/else logic
            if (props.title && props.image) {
              this.$refs.popupContent.innerHTML = '<h4>' + props.title + '</h4>'
              this.$refs.popupContent.innerHTML += props.image
                ? props.image.replace('cascadia/', '')
                : ''
              this.$refs.popupContent.innerHTML += props.text1 + '<br>'
              this.$refs.popupContent.innerHTML += props.text2
                ? props.text2 + '<br>'
                : ''
              this.$refs.popupContent.innerHTML += props.text3
                ? props.text3 + '<br>'
                : ''
              this.popup.setPosition(closestPoint)
              this.closeTooltip()
            } else if (props.type && props.corporation && props.name) {
              this.$refs.popupContent.innerHTML =
                '<h2>' + props.type + '</h2><br>'
              this.$refs.popupContent.innerHTML +=
                '<strong>NAME:</strong> ' + props.name + '<br>'
              this.$refs.popupContent.innerHTML +=
                '<strong>OWNER:</strong> ' + props.corporation + '<br>'
              this.$refs.popupContent.innerHTML +=
                '<strong>DESCRIPTION:</strong> ' + props.description + '<br>'
              this.$refs.popupContent.innerHTML +=
                '<strong>CAPACITY:</strong> ' + props.capacity + '<br>'
              this.$refs.popupContent.innerHTML +=
                "<strong>CORPORATE WEBSITE:</strong> <a href='" +
                props.link1 +
                "' target='_blank'>here</a><br>"
              this.$refs.popupContent.innerHTML +=
                "<strong>More information:</strong>  <a href='" +
                props.link2 +
                "' target='_blank'>here</a> and "
              this.$refs.popupContent.innerHTML +=
                "<a href='" + props.link3 + "' target='_blank'>here</a>"
              this.popup.setPosition(closestPoint)
              this.closeTooltip()
            } else if (props.type && props.description && props.Operator) {
              this.$refs.popupContent.innerHTML =
                '<h2>' + props.type + 'line</h4><br>'
              this.$refs.popupContent.innerHTML +=
                '<strong>Operator:</strong> ' + props.Operator + '<br>'
              this.$refs.popupContent.innerHTML +=
                '<strong>Description:</strong> ' +
                props.description +
                ' pipeline <br>'
              this.popup.setPosition(closestPoint)
              this.closeTooltip()
            } else if (props.type && props.name && props.location) {
              this.$refs.popupContent.innerHTML = props.type + '<br>'
              this.$refs.popupContent.innerHTML +=
                '<strong>Name:</strong> ' + props.name + '<br>'
              this.$refs.popupContent.innerHTML += props.location + '<br>'
              this.$refs.popupContent.innerHTML += props.date + '<br>'
              this.$refs.popupContent.innerHTML += props.size
              this.popup.setPosition(closestPoint)
            } else if (props.key) {
              this.$refs.popupContent.innerHTML = props.key
              this.popup.setPosition(closestPoint)
            } else if (props.images) {
              this.$refs.popupContent.innerHTML = props.images
              this.popup.setPosition(closestPoint)

              // starting here I took out a lot of stuff which can be found in Cascadia maps
            } else if (props.vimeoSrc) {
            }
            // MAJK: Sets the active feature to access it in the zoomToFeature method.
            this.activeFeature = feature
          } else {
            this.closePopup()
          }
        })
        window.addEventListener('keydown', e => {
          // close popup if esc key pressed
          if (e.keyCode === 27) {
            this.closePopup()
          }
        })
        window.addEventListener('resize', e => {
          this.toggleScaleLine()
        })
        this.olmap.on('pointermove', e => {
          const pixel = this.olmap.getEventPixel(e.originalEvent)
          const hit = this.olmap.hasFeatureAtPixel(pixel, {
            layerFilter: layerCandidate => {
              if (layerCandidate.get('isInteractive') === false) {
                return false
              }
              return true
            }
          })
          this.$refs.map.style.cursor = hit ? 'pointer' : ''
        })
        // Adding zoom to my location functionality as button control.
        this.userLocSource = this.makeUserLocationLayer(this.olmap)
        const locateMe = document.querySelector('.locateMe')
        /**
         * Return the curried event handler function, that is, pass all the following objects into the scope of the event handler. This is an
         * IIFE so it's called immediately.
         *
         * @param {Object}: {handler: map.methods.handleGetUserLocation, source: VectorSource, map: Map}
         * @return {function}: the event handler that is called when zoom to location
         * is clicked.
         */
        locateMe.getLocateArgs = (function(
          map,
          userLocSource,
          handleGetUserLocation
        ) {
          // Here, we return the eventhandler.
          return function() {
            return {
              map: map,
              source: userLocSource,
              handler: handleGetUserLocation
            }
          }
        })(this.olmap, this.userLocSource, this.handleGetUserLocation)
        locateMe.addEventListener('click', this.handleZoomToMe)
        // Add the new Locate Me button to the controls.
        this.olmap.addControl(
          new Control({
            element: document.querySelector('.locateMe-control')
          })
        )
        // Trigger the modal requesting zoom-to-location.
        if (!this.$cookies.get('locationRequested')) {
          this.$modal.show('dialog', {
            title: 'Zoom to my location?',
            buttons: [
              {
                title: 'Share my location',
                handler: e => {
                  this.handleGetUserLocation(this.userLocSource, this.olmap)
                  this.$modal.hide('dialog')
                  // Adds a browser cookie so we only show popup one time.
                  this.$cookies.set('locationRequested', true, '7d')
                }
              },
              {
                title: 'Close',
                default: true,
                handler: () => {
                  this.$cookies.set('locationRequested', true, '7d')
                  this.$modal.hide('dialog')
                }
              }
            ]
          })
        }
        // After the map moveend event fires, determine if the instructions
        // for using the spotlights should be shown based on zoom level.
        this.olmap.on('moveend', function(e) {
          const resolutionLevel = this.getView().getResolution()
          const spotlightControls = document.querySelector('.spotlightControls')
          if (resolutionLevel <= 20) {
            spotlightControls.style.display = 'block'
          } else {
            spotlightControls.style.display = 'none'
          }
        })
      }

      // MAJK: Create popupInfo layer
      if (this.olmap) {
        setTimeout(() => {
          this.makePopupInfoLayer()
        }, 1000)
      }
    },
    closePopup: function() {
      this.popup.setPosition(undefined)
      this.$refs.popupCloser.blur()
      this.vimeoPopup.setPosition(undefined)
      this.$refs.vimeoPopupCloser.blur()
      this.$refs.vimeoPopupContent.innerHTML = ''
      return false
    },
    closeTitletip: function() {
      this.titletip.setPosition(undefined)
      return false
    },
    closeTooltip: function() {
      this.tooltip.setPosition(undefined)
      return false
    },
    zoomToFeature() {
      /**
       * MAJK: Zooms to feature, add a cloned feature to the highlight layer and set the position of popup undefined
       * move the popup content to sidepanel and replace legend with feature image if exist.
       *
       */
      const geometry = this.activeFeature.getGeometry()
      const props = this.activeFeature.getProperties()

      // Add popup content in sidepanel
      const sidePanelFeatureContentEl = document.getElementById(
        'feature-content'
      )
      this.sidePanelInitialHtmlState = sidePanelFeatureContentEl.innerHTML
      sidePanelFeatureContentEl.innerHTML = this.$refs.popupContent.innerHTML

      // Change legend image with feature image if exist
      if (props.imageUrl) {
        const sidePanelImageEl = document.getElementById('sidepanel-image')
        // Copy initial image src
        this.sidePanelInitialImageSrc = sidePanelImageEl.src
        // Change default image with feature image
        sidePanelImageEl.src = UrlUtil.parseUrl(props.imageUrl)
      }

      if (geometry.getType() === 'Point') {
        this.olmap.getView().animate({
          center: geometry.getCoordinates(),
          zoom: 13,
          duration: 800
        })
      } else {
        // Zoom to extent adding a padding to the extent
        this.olmap
          .getView()
          .fit(geometry.getExtent(), { padding: [10, 10, 10, 10] })

        // Highlight feature
        this.popupInfoLayerSource.addFeature(this.activeFeature.clone())
      }
      // Close popup
      this.popup.setPosition(undefined)
    },
    makePopupInfoLayer() {
      // MAJK: PopupInfo layer (used for highlight)
      const source = new VectorSource({
        wrapX: false
      })
      const vector = new VectorLayer({
        name: 'Popinfo Info Layer',
        zIndex: 100,
        source: source,
        style: popupInfoStyle()
      })
      this.popupInfoLayerSource = source
      // Workaround if map view is changed.
      this.olmap.removeLayer(vector)
      this.olmap.addLayer(vector)
    },
    
    // These are standard layer styles, not based on properties. Each includes a zIndex:
    makeGeoJSONPointVectorLayer: function(
      url,
      zIndex,
      iconPath,
      label,
      minResolution,
      maxResolution,
      opacity,
      otherProps
    ) {
      let config = {
        source: new VectorSource({
          url: url,
          format: new GeoJSON()
        }),
        minResolution: minResolution,
        maxResolution: maxResolution,
        zIndex: zIndex,
        style: new Style({
          image: new Icon({
            src: iconPath,
            opacity: opacity === undefined ? 1 : opacity
          })
        }),
        label: label
      }
      if (otherProps && typeof otherProps === 'object') {
        config = { ...config, ...otherProps }
      }
      return new VectorLayer(config)
    },
    makeGeoJSONFillVectorLayer: function(
      url,
      zIndex,
      minResolution,
      maxResolution,
      strokeColor,
      width,
      fillColor,
      otherProps
    ) {
      let config = {
        source: new VectorSource({
          format: new GeoJSON(),
          url: url
        }),
        minResolution: minResolution,
        maxResolution: maxResolution,
        zIndex: zIndex,
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
      }
      if (otherProps && typeof otherProps === 'object') {
        config = { ...config, ...otherProps }
      }
      return new VectorLayer(config)
    },
    makeGeoJSONLineVectorLayer: function(
      url,
      zIndex,
      minResolution,
      maxResolution,
      strokeColor,
      width,
      otherProps
    ) {
      let config = {
        source: new VectorSource({
          format: new GeoJSON(),
          url: url
        }),
        minResolution: minResolution,
        maxResolution: maxResolution,
        zIndex: zIndex,
        style: new Style({
          stroke: new Stroke({
            color: strokeColor,
            width: width
          })
        }),
        strokeColor: strokeColor
      }

      if (otherProps && typeof otherProps === 'object') {
        config = { ...config, ...otherProps }
      }
      return new VectorLayer(config)
    },

    makeGeoJSONPointVectorLayerWithCircleStyle: function(
      url,
      zIndex,
      label,
      minResolution,
      maxResolution,
      strokeColor,
      width,
      fillColor
    ) {
      return new VectorLayer({
        source: new VectorSource({
          url: url,
          format: new GeoJSON()
        }),
        minResolution: minResolution,
        maxResolution: maxResolution,
        zIndex: zIndex,
        style: baseStyle('rad', {
          strokeColor: 'rgba(134, 40, 26, 0.5)',
          fillColor: 'rgba(134, 40, 26, 0.3)',
          circleRadiusFn: propertyValue => {
            return Math.sqrt(propertyValue)
          }
        }),
        label: label
      })
    },
    makeGeoJSONPointVectorLayerWithCircleStyle1: function(
      url,
      zIndex,
      label,
      minResolution,
      maxResolution
    ) {
      return new VectorLayer({
        source: new VectorSource({
          url: url,
          format: new GeoJSON()
        }),
        minResolution: minResolution,
        maxResolution: maxResolution,
        zIndex: zIndex,
        style: baseStyle('production', {
          strokeColor: 'rgba(255, 255, 255, 1)',
          fillColor: 'rgba(129, 56, 17, 0.7)',
          circleRadiusFn: propertyValue => {
            return Math.sqrt(propertyValue) / 150
          }
        }),
        label: label
      })
    },
    makeGeoJSONPointVectorLayerWithCircleStyle2: function(
      url,
      zIndex,
      label,
      minResolution,
      maxResolution
    ) {
      return new VectorLayer({
        source: new VectorSource({
          url: url,
          format: new GeoJSON()
        }),
        minResolution: minResolution,
        maxResolution: maxResolution,
        zIndex: zIndex,
        style: baseStyle('EUR_MMBOE', {
          strokeColor: 'rgba(255, 255, 255, 0.7)',
          fillColor: 'rgba(195, 72, 28, 0.4)',
          circleRadiusFn: propertyValue => {
            return Math.sqrt(propertyValue) * 0.3
          }
        }),
        label: label
      })
    },
    makeGeoJSONPointVectorLayerWithCircleStyle3: function(
      url,
      zIndex,
      label,
      minResolution,
      maxResolution
    ) {
      return new VectorLayer({
        source: new VectorSource({
          url: url,
          format: new GeoJSON()
        }),
        minResolution: minResolution,
        maxResolution: maxResolution,
        zIndex: zIndex,
        style: baseStyle('max_ptl_release_gallons', {
          strokeColor: 'rgba(134, 40, 26, 0.9)',
          fillColor: 'rgba(134, 40, 26, 0.6)',
          circleRadiusFn: propertyValue => {
            return Math.sqrt(propertyValue) / 70
          }
        }),
        label: label
      })
    },
    makeGeoJSONLineVectorLayerWithStyle1: function(
      url,
      zIndex,
      minResolution,
      maxResolution,
      width
    ) {
      return new VectorLayer({
        source: new VectorSource({
          format: new GeoJSON(),
          url: url
        }),
        minResolution: minResolution,
        maxResolution: maxResolution,
        zIndex: zIndex,
        style: baseStyle('color', {
          strokeColor: propertyValue => propertyValue,
          strokeWidth: 4,
          lineDash: [6]
        })
      })
    },
    /**
     * Zoom to my location. Utilizes a function getLocateArgs
     * that is curried with an object containing map, source, and handler
     * passed through from the scope of this object into the event handler
     * scope, whose "this" scope is the event and the clicked button.
     *
     */
    handleZoomToMe: function(e) {
      const { map, source, handler } = e.target.getLocateArgs()
      handler(source, map)
    },
    handleGetUserLocation: function(source, map) {
      const watchId = navigator.geolocation.watchPosition(
        function(pos) {
          const coords = [pos.coords.longitude, pos.coords.latitude]
          const accuracy = circular(coords, pos.coords.accuracy)
          source.clear(true)
          source.addFeatures([
            new Feature(
              accuracy.transform('EPSG:4326', map.getView().getProjection())
            ),
            new Feature(new Point(fromLonLat(coords)))
          ])
          if (!source.isEmpty()) {
            map.getView().fit(source.getExtent(), {
              maxZoom: 7,
              duration: 500
            })
            navigator.geolocation.clearWatch(watchId)
          }
        },
        function(error) {
          alert(`ERROR: ${error.message}`)
        },
        {
          enableHighAccuracy: true
        }
      )
    },
    /*
     * Creates a new layer for the user's location that will be used for getting
     * the user's location.
     *
     * @param {Object} map: this vueJS map object
     * @return {VectorSource}: The created user layer VectorSource
     */
    makeUserLocationLayer: function(map) {
      const source = new VectorSource()
      const layer = new VectorLayer({
        source: source
      })
      this.olmap.addLayer(layer)
      return source
    },
    toggleScaleLine: function() {
      if (this.asideHidden || window.innerWidth < 850) {
        document.querySelector('.ol-scale-line').classList.remove('hidden')
      } else {
        document.querySelector('.ol-scale-line').classList.add('hidden')
      }
    },
    setMapView: function(optz = {}) {
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
<style lang="css" scoped>
.zoomToFeature {
  position: relative;
  top: -25px;
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 450px;
  max-width: 330px;
  width: calc(100% - 1em);
  padding: 0em;
  margin-left: 0.5em;
}
</style>
