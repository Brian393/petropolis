<template>
  <div id="map" ref="map">
    <div class="spotlightControls" ref="spotlightControls">press ↑ or ↓ to change spotlight size</div>
    <div ref="vimeoPopup" class="ol-popup ol-vimeopopup">
      <div ref="vimeoPopupCloser" class="ol-popup-closer" v-on:click="closePopup"></div>
      <div class="ol-popup-content" ref="vimeoPopupContent"></div>
    </div>
    <div ref="twitterPopup" class="ol-popup ol-twitterpopup">
      <div ref="twitterpopupCloser" class="ol-popup-closer" v-on:click="closePopup"></div>
      <div class="ol-popup-twitter-content">
        <div ref="loadingTweets" class="twitter-loading hidden">Loading Tweets...</div>
        <div ref="twitterContent"></div>
      </div>
    </div>
    <div ref="popup" class="ol-popup">
      <div ref="popupCloser" class="ol-popup-closer" v-on:click="closePopup"></div>
      <div class="ol-popup-content" ref="popupContent"></div>
    </div>
    <div ref="titletip" class="titletip">
      <div class="titletip-content" ref="titletipContent"></div>
    </div>
      <div ref="textitletip" class="textitletip">
        <div class="textitletip-content" ref="textitletipContent"></div>
    </div>
      <div ref="mileagetitletip" class="mileagetitletip">
        <div class="mileagetitletip-content" ref="mileagetitletipContent"></div>
    </div>
    <div ref="whitetitletip" class="whitetitletip">
      <div class="whitetitletip-content" ref="whitetitletipContent"></div>
  </div>
      <div ref="salmontip" class="salmontip">
        <div class="salmontip-content" ref="salmontipContent"></div>
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
import {Style, Stroke, Fill, Icon, Circle} from 'ol/style'
import {ScaleLine, defaults as defaultControls, Control} from 'ol/control'
import {fromLonLat} from 'ol/proj'

import {eventBus} from '../main'

export default {
  name: 'Map',
  data: function () {
    return {
      olmap: undefined,
      styleCache: {}
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
    vimeoPopup: function () {
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
    twitterPopup: function () {
      return new Overlay({
        element: this.$refs.twitterPopup,
        autoPan: true,
        autoPanAnimation: {
          duration: 250
        },
        positioning: 'center-right'
      })
    },
    popup: function () {
      return new Overlay({
        element: this.$refs.popup,
        autoPan: true,
        autoPanMargin: 40,
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
    textitletip: function () {
      return new Overlay({
        element: this.$refs.textitletip,
        offset: [10, 0],
        positioning: 'center-left'
      })
    },
    whitetitletip: function () {
      return new Overlay({
        element: this.$refs.whitetitletip,
        offset: [10, 0],
        positioning: 'center-left'
      })
    },
    mileagetitletip: function () {
      return new Overlay({
        element: this.$refs.mileagetitletip
      })
    },
    salmontip: function () {
      return new Overlay({
        element: this.$refs.salmontip,
        offset: [10, 0],
        positioning: 'center'
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
          overlays: [this.twitterPopup, this.popup, this.titletip, this.textitletip, this.mileagetitletip, this.whitetitletip, this.salmontip, this.tooltip, this.vimeoPopup],
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
            }),
          ])
        })
        this.toggleScaleLine()
        this.olmap.on('singleclick', (e) => {
          const feature = this.olmap.forEachFeatureAtPixel(e.pixel, (feature) => { return feature })
          if (feature) {
            const props = feature.getProperties()
            // console.log('has feature! props:', props)
            // #TODO: use better property names in .geojson files for if/else logic
            if (props.title && props.image && props.text1) {
              this.$refs.popupContent.innerHTML = '<h4>' + props.title + '</h4>'
              this.$refs.popupContent.innerHTML += props.image ? props.image.replace('cascadia/', '') : ''
              this.$refs.popupContent.innerHTML += props.text1 + '<br>'
              this.$refs.popupContent.innerHTML += props.text2 ? props.text2 + '<br>' : ''
              this.$refs.popupContent.innerHTML += props.text3 ? props.text3 + '<br>' : ''
              this.popup.setPosition(e.coordinate)
              this.closeTooltip()
            } else if (props.key) {
              this.$refs.popupContent.innerHTML = props.key
              this.popup.setPosition(e.coordinate)
            } else if (props.images) {
              this.$refs.popupContent.innerHTML = props.images
              this.popup.setPosition(e.coordinate)
            // starting here I took out a lot of stuff which can be found in Cascadia maps
            } else if (props.vimeoSrc) {
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
        this.olmap.on('moveend', function(e) {
          const zoomLevel = this.getView().getZoom();
          const spotlightControls = document.querySelector('.spotlightControls');
          if (zoomLevel >= 14) {
            spotlightControls.style.display = 'block';
          } else {
            spotlightControls.style.display = 'none';
          }
        });
      }
    },
    closePopup: function () {
      this.popup.setPosition(undefined)
      this.$refs.popupCloser.blur()
      this.twitterPopup.setPosition(undefined)
      this.$refs.twitterpopupCloser.blur()
      this.vimeoPopup.setPosition(undefined)
      this.$refs.vimeoPopupCloser.blur()
      this.$refs.vimeoPopupContent.innerHTML = ''
      return false
    },
    closeTitletip: function () {
      this.titletip.setPosition(undefined)
      return false
    },
    closeTextitletip: function () {
      this.textitletip.setPosition(undefined)
      return false
    },
    closeMileagetitletip: function () {
      this.mileagetitletip.setPosition(undefined)
      return false
    },
    closeWhitetitletip: function () {
      this.whitetitletip.setPosition(undefined)
      return false
    },
    closeSalmontip: function () {
      this.salmontip.setPosition(undefined)
      return false
    },
    closeTooltip: function () {
      this.tooltip.setPosition(undefined)
      return false
    },
    geoJSONPointVectorLayerStyle: function (feature) {
      // cache styles here to prevent icon flickering/blinking!
      // second value of icon anchor is height in pixels, Y units specified accordingly
      if (feature.values_ && feature.values_['icon'] && !this.styleCache[feature.values_['icon']]) {
        this.styleCache[feature.values_['icon']] = new Style({
          image: new Icon({
            scale: 1,
            rotateWithView: false,
            anchor: [0.5, 43],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: 1,
            src: feature.values_['icon'] || 'icons/XLspill.gif'

          })
        })
      }
      return this.styleCache[feature.values_['icon']]
    },
    makeGeoJSONPointVectorLayerWithStyle: function (url, label, minResolution, maxResolution, opacity) {
      return new VectorLayer({
        source: new VectorSource({
          url: url,
          format: new GeoJSON()
        }),
        minResolution: minResolution,
        maxResolution: maxResolution,
        style: this.geoJSONPointVectorLayerStyle,
        label: label
      })
    },
    geoJSONPointVectorLayerCircleStyle: function (feature) {
      if (feature.values_ && feature.values_['rad'] && !this.styleCache[feature.values_['rad']]) {
        this.styleCache[feature.values_['rad']] = new Style({
          image: new Circle({
            stroke: new Stroke({
              color: 'rgba(134, 40, 26, 0.5)',
              width: 1
            }),
            fill: new Fill({
              color: 'rgba(134, 40, 26, 0.3)'
            }),
            radius: Math.sqrt(feature.values_['rad'])
          })
        })
      }
      return this.styleCache[feature.values_['rad']]
    },
    makeGeoJSONPointVectorLayerWithCircleStyle: function (url, label, minResolution, maxResolution, strokeColor, width, fillColor) {
      return new VectorLayer({
        source: new VectorSource({
          url: url,
          format: new GeoJSON()
        }),
        minResolution: minResolution,
        maxResolution: maxResolution,
        style: this.geoJSONPointVectorLayerCircleStyle,
        label: label
      })
    },
    geoJSONPointVectorLayerCircleStyle1: function (feature) {
      if (feature.values_ && feature.values_['BPD'] && !this.styleCache[feature.values_['BPD']]) {
        this.styleCache[feature.values_['BPD']] = new Style({
          image: new Circle({
            stroke: new Stroke({
              color: 'rgba(0, 0, 0, 1)',
              width: 1
            }),
            fill: new Fill({
              color: 'rgba(204, 0, 0, 0.7)'
            }),
            radius: Math.sqrt(feature.values_['BPD']) / 50
          })
        })
      }
      return this.styleCache[feature.values_['BPD']]
    },
    makeGeoJSONPointVectorLayerWithCircleStyle1: function (url, label, minResolution, maxResolution) {
      return new VectorLayer({
        source: new VectorSource({
          url: url,
          format: new GeoJSON()
        }),
        minResolution: minResolution,
        maxResolution: maxResolution,
        style: this.geoJSONPointVectorLayerCircleStyle1,
        label: label
      })
    },
    geoJSONPointVectorLayerCircleStyle2: function (feature) {
      if (feature.values_ && feature.values_['MW'] && !this.styleCache[feature.values_['MW']]) {
        this.styleCache[feature.values_['MW']] = new Style({
          image: new Circle({
            stroke: new Stroke({
              color: 'rgba(0, 0, 0, 0.9)',
              width: 1
            }),
            fill: new Fill({
              color: 'rgba(195, 72, 28, 0.7)'
            }),
            radius: Math.sqrt(feature.values_['MW']) * 0.4
          })
        })
      }
      return this.styleCache[feature.values_['MW']]
    },
    makeGeoJSONPointVectorLayerWithCircleStyle2: function (url, label, minResolution, maxResolution) {
      return new VectorLayer({
        source: new VectorSource({
          url: url,
          format: new GeoJSON()
        }),
        minResolution: minResolution,
        maxResolution: maxResolution,
        style: this.geoJSONPointVectorLayerCircleStyle2,
        label: label
      })
    },
    geoJSONPointVectorLayerCircleStyle3: function (feature) {
      if (feature.values_ && feature.values_['max_ptl_release_gallons'] && !this.styleCache[feature.values_['max_ptl_release_gallons']]) {
        this.styleCache[feature.values_['max_ptl_release_gallons']] = new Style({
          image: new Circle({
            stroke: new Stroke({
              color: 'rgba(134, 40, 26, 0.9)',
              width: 1
            }),
            fill: new Fill({
              color: 'rgba(134, 40, 26, 0.6)'
            }),
            radius: Math.sqrt(feature.values_['max_ptl_release_gallons']) / 70
          })
        })
      }
      return this.styleCache[feature.values_['max_ptl_release_gallons']]
    },
    makeGeoJSONPointVectorLayerWithCircleStyle3: function (url, label, minResolution, maxResolution) {
      return new VectorLayer({
        source: new VectorSource({
          url: url,
          format: new GeoJSON()
        }),
        minResolution: minResolution,
        maxResolution: maxResolution,
        style: this.geoJSONPointVectorLayerCircleStyle3,
        label: label
      })
    },
    geoJSONPointVectorLayerCircleStyle4: function (feature) {
      if (feature.values_ && feature.values_['CAP'] && !this.styleCache[feature.values_['CAP']]) {
        this.styleCache[feature.values_['CAP']] = new Style({
          image: new Circle({
            stroke: new Stroke({
              color: 'rgba(0, 0, 0, 0.9)',
              width: 1
            }),
            fill: new Fill({
              color: 'rgba(0, 200, 237, 0.8)'
            }),
            radius: Math.sqrt(feature.values_['CAP']) / 3
          })
        })
      }
      return this.styleCache[feature.values_['CAP']]
    },
    makeGeoJSONPointVectorLayerWithCircleStyle4: function (url, label, minResolution, maxResolution) {
      return new VectorLayer({
        source: new VectorSource({
          url: url,
          format: new GeoJSON()
        }),
        minResolution: minResolution,
        maxResolution: maxResolution,
        style: this.geoJSONPointVectorLayerCircleStyle4,
        label: label
      })
    },
    makeGeoJSONPointVectorLayer: function (url, iconPath, label, minResolution, maxResolution, opacity) {
      return new VectorLayer({
        source: new VectorSource({
          url: url,
          format: new GeoJSON()
        }),
        minResolution: minResolution,
        maxResolution: maxResolution,
        style: new Style({
          image: new Icon({
            src: iconPath,
            opacity: opacity === undefined ? 1 : opacity
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
    geoJSONLineVectorLayerStyle: function (feature) {
      if (feature.values_ && feature.values_['color'] && !this.styleCache[feature.values_['color']]) {
        this.styleCache[feature.values_['color']] = new Style({
          stroke: new Stroke({
            color: feature.values_['color'],
            width: 3.5 //,
        //    lineDash: [4]
          })
        })
      }
      return this.styleCache[feature.values_['color']]
    },
    makeGeoJSONLineVectorLayerWithStyle: function (url, minResolution, maxResolution, width) {
      return new VectorLayer({
        source: new VectorSource({
          format: new GeoJSON(),
          url: url
        }),
        minResolution: minResolution,
        maxResolution: maxResolution,
        style: this.geoJSONLineVectorLayerStyle
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
<<<<<<< HEAD
=======
    /**
     * Zoom to my location. Utilizes a function getLocateArgs
     * that is curried with an object containing map, source, and handler
     * passed through from the scope of this object into the event handler
     * scope, whose "this" scope is the event and the clicked button.
     *
     */
    handleZoomToMe: function(e) {
      const {map, source, handler} = e.target.getLocateArgs();
      handler(source, map);
    },
    handleGetUserLocation: function(source, map) {
      const watchId = navigator.geolocation.watchPosition(function(pos) {
        const coords = [pos.coords.longitude, pos.coords.latitude];
        const accuracy = circular(coords, pos.coords.accuracy);
        source.clear(true);
        source.addFeatures([
          new Feature(accuracy.transform('EPSG:4326', map.getView().getProjection())),
          new Feature(new Point(fromLonLat(coords)))
        ]);
        if (!source.isEmpty()) {
          map.getView().fit(source.getExtent(), {
            maxZoom: 7,
            duration: 500
          });
          navigator.geolocation.clearWatch(watchId);
        }
      }, function(error) {
        alert(`ERROR: ${error.message}`);
      }, {
        enableHighAccuracy: true
      });
    },
    /*
     * Creates a new layer for the user's location that will be used for getting
     * the user's location.
     *
     * @param {Object} map: this vueJS map object
     * @return {VectorSource}: The created user layer VectorSource
     */
    makeUserLocationLayer: function(map) {
      const source = new VectorSource();
      const layer = new VectorLayer({
        source: source
      });
      this.olmap.addLayer(layer)
      return source;
    },
>>>>>>> b7a777f74286417de2aade9d45dd9024e376a9c1
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
