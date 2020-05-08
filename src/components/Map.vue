<template>
  <div id="map" ref="map">
    <div class="spotlightControls" ref="spotlightControls">press ↑ or ↓ to change spotlight size</div>
    <div class="ol-control locateMe-control">
      <button class="locateMe" title="Locate me">◎</button>
    </div>
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
import {circular} from 'ol/geom/Polygon'
import {eventBus} from '../main'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'

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
            })
          ])
        })
        this.toggleScaleLine()
        this.olmap.on('singleclick', (e) => {
          const feature = this.olmap.forEachFeatureAtPixel(e.pixel, (feature) => { return feature })
          if (feature) {
            const props = feature.getProperties()
            // #TODO: use better property names in .geojson files for if/else logic
            if (props.title && props.image) {
              this.$refs.popupContent.innerHTML = '<h4>' + props.title + '</h4>'
              this.$refs.popupContent.innerHTML += props.image ? props.image.replace('cascadia/', '') : ''
              this.$refs.popupContent.innerHTML += props.text1 + '<br>'
              this.$refs.popupContent.innerHTML += props.text2 ? props.text2 + '<br>' : ''
              this.$refs.popupContent.innerHTML += props.text3 ? props.text3 + '<br>' : ''
              this.popup.setPosition(e.coordinate)
              this.closeTooltip()
            } else if (props.type && props.corporation && props.name) {
              this.$refs.popupContent.innerHTML = '<h2>' + props.type + '</h2><br>'
              this.$refs.popupContent.innerHTML += '<strong>NAME:</strong> ' + props.name + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>OWNER:</strong> ' + props.corporation + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>DESCRIPTION:</strong> ' + props.description + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>CAPACITY:</strong> ' + props.capacity + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>CORPORATE WEBSITE:</strong> <a href=\'' + props.link1 + '\' target=\'_blank\'>here</a><br>'
              this.$refs.popupContent.innerHTML += '<strong>More information:</strong>  <a href=\'' + props.link2 + '\' target=\'_blank\'>here</a> and '
              this.$refs.popupContent.innerHTML += '<a href=\'' + props.link3 + '\' target=\'_blank\'>here</a>'
              this.popup.setPosition(e.coordinate)
              this.closeTooltip()
            } else if (props.ProjectType && props.Company) {
              this.$refs.popupContent.innerHTML = '<h2>' + props.ProjectType + '</h2><br>'
              this.$refs.popupContent.innerHTML += '<strong>Company:</strong> ' + props.Company + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>Plant or Project:</strong> ' + props.Plant_or_Project + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>State:</strong> ' + props.State + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>County\/Parish:</strong> ' + props.County_Parish + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>Classification:</strong> ' + props.Classification + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>Sector:</strong> ' + props.Sector + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>Description:</strong> ' + props.Description + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>Type(s):</strong> ' + props.Types + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>CO2 equivalent, tons per year:</strong> ' + props.CO2e_tpy + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>PM10, tons per year:</strong> ' + props.PM10_tpy + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>PM2.5, tons per year:</strong> ' + props.PM25_tpy + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>PM, tons per year:</strong> ' + props.PM_tpy + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>NOx, tons per year:</strong> ' + props.NOx_tpy + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>VOC, tons per year:</strong> ' + props.VOC_tpy + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>SO2, tons per year:</strong> ' + props.SO2_tpy + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>CO, tons per year:</strong> ' + props.CO_tpy + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>GHG Permit Status:</strong> ' + props.GHG_Permit_Status + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>Permit History (permit no., type, issue date):</strong> ' + props.Permit_History_permit_no_type_issue_date + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>Permit Documents:</strong> ' + props.Permit_Documents + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>State Facility ID(s):</strong> ' + props.State_Facility_IDs + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>Link to State Permitting Website:</strong> ' + props.Link_to_State_Permitting_Website + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>Link to State Enforcement Records:</strong> ' + props.Link_to_State_Enforcement_Records + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>EPA Compliance Report:</strong> ' + props.EPA_Compliance_Report + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>Congressional Representative, Political Party:</strong> ' + props.Congressional_Representative_Political_Party + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>Permit Status Last Updated by EIP Staff:</strong> ' + props.Permit_Status_Last_Updated_by_EIP_Staff + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>Operational Status:</strong> ' + props.Operational_Status + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>Year Operating or Expected Completion Date:</strong> ' + props.Year_Operating_or_Expected_Completion_Date + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>Operational Status Sources:</strong> ' + props.Operational_Status_Sources + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>Operational Status Links:</strong> ' + props.Operational_Status_Links + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>Operating Status Last Updated by EIP Staff:</strong> ' + props.Operating_Status_Last_Updated_by_EIP_Staff + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>Total Population (1 mile):</strong> ' + props.Total_Population_1_mile + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>Percent Minority (1 mile):</strong> ' + props.Percent_Minority_1_mile + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>Percent Low Income (1 mile):</strong> ' + props.Percent_Low_Income_1_mile + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>Percent Younger than 5 (1 mile):</strong> ' + props.Percent_Younger_than_5 + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>Percent Older than 64 (1 mile):</strong> ' + props.Percent_Older_than_64_1_mile + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>Total Population (3 miles):</strong> ' + props.Total_Population_3_miles + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>Percent Minority (3 miles):</strong> ' + props.Percent_Minority_3_miles + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>Percent Low Income (3 miles):</strong> ' + props.Percent_Low_Income_3_miles + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>Percent Younger than 5 (3 miles):</strong> ' + props.Percent_Younger_than_5_3_miles + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>Percent Older than 64 (3 miles):</strong> ' + props.Percent_Older_than_64_3_miles + '<br>'
              this.popup.setPosition(e.coordinate)
              this.closeTooltip()
            } else if (props.type && props.description && props.Operator) {
              this.$refs.popupContent.innerHTML = '<h2>' + props.type + 'line</h4><br>'
              this.$refs.popupContent.innerHTML += '<strong>Operator:</strong> ' + props.Operator + '<br>'
              this.$refs.popupContent.innerHTML += '<strong>Description:</strong> ' + props.description + ' pipeline <br>'
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
        locateMe.getLocateArgs = (function (map, userLocSource, handleGetUserLocation) {
          // Here, we return the eventhandler.
          return function () {
            return {
              map: map,
              source: userLocSource,
              handler: handleGetUserLocation
            }
          }
        }(this.olmap, this.userLocSource, this.handleGetUserLocation))
        locateMe.addEventListener('click', this.handleZoomToMe)
        // Add the new Locate Me button to the controls.
        this.olmap.addControl(new Control({
          element: document.querySelector('.locateMe-control')
        }))
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
        this.olmap.on('moveend', function (e) {
          const zoomLevel = this.getView().getZoom()
          const spotlightControls = document.querySelector('.spotlightControls')
          if (zoomLevel >= 11) {
            spotlightControls.style.display = 'block'
          } else {
            spotlightControls.style.display = 'none'
          }
        })
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
    geoJSONLineVectorLayerStyle1: function (feature) {
      if (feature.values_ && feature.values_['color'] && !this.styleCache[feature.values_['color']]) {
        this.styleCache[feature.values_['color']] = new Style({
          stroke: new Stroke({
            color: feature.values_['color'],
            width: 4,
            lineDash: [6]
          })
        })
      }
      return this.styleCache[feature.values_['color']]
    },
    makeGeoJSONLineVectorLayerWithStyle1: function (url, minResolution, maxResolution, width) {
      return new VectorLayer({
        source: new VectorSource({
          format: new GeoJSON(),
          url: url
        }),
        minResolution: minResolution,
        maxResolution: maxResolution,
        style: this.geoJSONLineVectorLayerStyle1
      })
    },
    LineVectorTileLayerStyle2: function (feature) {
      if (feature.values_ && feature.values_['color'] && !this.styleCache[feature.values_['color']]) {
        this.styleCache[feature.values_['color']] = new Style({
          stroke: new Stroke({
            color: feature.values_['color'],
            width: 1
          })
        })
      }
      return this.styleCache[feature.values_['color']]
    },
    makeLineVectorTileLayerWithStyle2: function (url, minResolution, maxResolution, width, opacity) {
      return new VectorTileLayer({
        source: new VectorTileSource({
          format: new MVT(),
          url: url
        }),
        minResolution: minResolution,
        maxResolution: maxResolution,
        style: this.LineVectorTileLayerStyle2
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
    /**
     * Zoom to my location. Utilizes a function getLocateArgs
     * that is curried with an object containing map, source, and handler
     * passed through from the scope of this object into the event handler
     * scope, whose "this" scope is the event and the clicked button.
     *
     */
    handleZoomToMe: function (e) {
      const {map, source, handler} = e.target.getLocateArgs()
      handler(source, map)
    },
    handleGetUserLocation: function (source, map) {
      const watchId = navigator.geolocation.watchPosition(function (pos) {
        const coords = [pos.coords.longitude, pos.coords.latitude]
        const accuracy = circular(coords, pos.coords.accuracy)
        source.clear(true)
        source.addFeatures([
          new Feature(accuracy.transform('EPSG:4326', map.getView().getProjection())),
          new Feature(new Point(fromLonLat(coords)))
        ])
        if (!source.isEmpty()) {
          map.getView().fit(source.getExtent(), {
            maxZoom: 7,
            duration: 500
          })
          navigator.geolocation.clearWatch(watchId)
        }
      }, function (error) {
        alert(`ERROR: ${error.message}`)
      }, {
        enableHighAccuracy: true
      })
    },
    /*
     * Creates a new layer for the user's location that will be used for getting
     * the user's location.
     *
     * @param {Object} map: this vueJS map object
     * @return {VectorSource}: The created user layer VectorSource
     */
    makeUserLocationLayer: function (map) {
      const source = new VectorSource()
      const layer = new VectorLayer({
        source: source
      })
      this.olmap.addLayer(layer)
      return source
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
