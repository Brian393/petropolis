<template>
  <div id="ol-map-container">
    <!-- Map Controls -->
    <zoom-control :map="map" />
    <full-screen />
    <locate :map="map" />
    <!-- Popup overlay  -->
    <overlay-popup :title="popup.title" v-show="popup.isVisible" ref="popup">
      <v-btn icon>
        <v-icon>close</v-icon>
      </v-btn>
      <template v-slot:close>
        <template v-if="getInfoResult.length > 1">
          <span
            >({{ popup.currentLayerIndex + 1 }} of
            {{ getInfoResult.length }})</span
          >
          <v-icon
            :disabled="popup.currentLayerIndex === 0"
            style="cursor:pointer;"
            @click="previousGetInfoLayer()"
            >chevron_left</v-icon
          >
          <v-icon
            :disabled="popup.currentLayerIndex === getInfoResult.length - 1"
            style="cursor:pointer;"
            @click="nextGetInfoLayer()"
            >chevron_right</v-icon
          >
        </template>
        <v-btn @click="closePopup()" icon>
          <v-icon>close</v-icon>
        </v-btn>
      </template>
      <template v-slot:body>
        <div class="subtitle-2 mb-4 font-weight-bold">
          {{
            getInfoResult[popup.currentLayerIndex]
              ? getInfoResult[popup.currentLayerIndex].get('layerName')
              : ''
          }}
        </div>

        <v-divider></v-divider>
        <span v-html="popup.rawHtml"></span>
        <div style="height:190px;">
          <vue-scroll>
            <v-simple-table dense class="pr-2">
              <template v-slot:default>
                <tbody>
                  <tr v-for="item in currentInfo" :key="item.property">
                    <td v-if="item.property !== 'PopupInfo'">
                      {{ item.property }}
                    </td>

                    <td v-if="item.property !== 'PopupInfo'">
                      {{ item.value }}
                    </td>
                    <span
                      v-if="item.property === 'PopupInfo'"
                      v-html="item.value"
                    ></span>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </vue-scroll>
        </div>

        <v-divider></v-divider>
      </template>
    </overlay-popup>
  </div>
</template>

<script>
import Vue from 'vue';
import Map from 'ol/Map';
import View from 'ol/View';
// ol imports
import Overlay from 'ol/Overlay';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';

// style imports
import { popupInfoStyle } from '../../../style/OlStyleDefs';
// import the app-wide EventBus
import { EventBus } from '../../../EventBus';

// utils imports
import { LayerFactory } from '../../../factory/OlLayer';
import { groupBy, humanize, isCssColor } from '../../../utils/Helpers';
import { getAllChildLayers, getLayerType } from '../../../utils/Layer';
import { geojsonToFeature } from '../../../utils/MapUtils';
import { Group as LayerGroup } from 'ol/layer.js';
import { fromLonLat } from 'ol/proj';

import http from '../../../services/http';
import axios from 'axios';

//Store imports
import { mapMutations, mapGetters } from 'vuex';

// Map Controls
import OverlayPopup from './controls/Overlay';
import ZoomControl from './controls/ZoomControl';
import FullScreen from './controls/FullScreen';
import Locate from './controls/Locate';
import DoubleClickZoom from 'ol/interaction/DoubleClickZoom';

import { defaults as defaultControls, Attribution } from 'ol/control';
import { defaults as defaultInteractions } from 'ol/interaction';

export default {
  components: {
    'overlay-popup': OverlayPopup,
    'zoom-control': ZoomControl,
    'full-screen': FullScreen,
    locate: Locate
  },
  name: 'app-ol-map',
  data() {
    return {
      zoom: this.$appConfig.map.zoom,
      center: this.$appConfig.map.center,
      minZoom: this.$appConfig.map.minZoom,
      maxZoom: this.$appConfig.map.maxZoom,
      extent: this.$appConfig.map.extent,
      color: this.$appConfig.controlsColor,
      allLayers: [],
      queryableLayers: [],
      activeInteractions: [],
      popup: {
        rawHtml: null,
        title: 'Info',
        isVisible: false,
        currentLayerIndex: 0
      },
      getInfoResult: []
    };
  },
  mounted() {
    var me = this;
    // Make the OL map accessible for Mapable mixin even 'ol-map-mounted' has
    // already been fired. Don not use directly in cmps, use Mapable instead.
    Vue.prototype.$map = me.map;
    // Send the event 'ol-map-mounted' with the OL map as payload
    EventBus.$emit('ol-map-mounted', me.map);
    //Add map to the vuex store.
    me.setMap(me.map);
    // resize the map, so it fits to parent
    window.setTimeout(() => {
      me.map.setTarget(document.getElementById('ol-map-container'));
      me.map.updateSize();
      // adjust the bg color of the OL buttons (like zoom, rotate north, ...)
      me.setOlButtonColor();
      // Get Info
      me.setupMapClick();
      me.setupMapPointerMove();
      me.createPopupOverlay();
    }, 200);
  },
  created() {
    var me = this;
    // Make map rotateable according to property
    const attribution = new Attribution({
      collapsible: true
    });

    // Need to reference as we should deactive double click zoom when there
    // are active interaction like draw/modify
    this.dblClickZoomInteraction = new DoubleClickZoom();
    me.map = new Map({
      layers: [],
      interactions: defaultInteractions({
        altShiftDragRotate: me.rotateableMap,
        doubleClickZoom: false
      }).extend([this.dblClickZoomInteraction]),
      controls: defaultControls({
        attribution: false,
        zoom: false
      }).extend([attribution]),
      view: new View({
        center: me.center || [0, 0],
        minResolution: 0.5,
        maxResolution: 64000
      })
    });

    // Create layers from config and add them to map
    const layers = me.createLayers();
    console.log(layers);
    me.map.getLayers().extend(layers);
    me.createGetInfoLayer();

    // Event bus setup for managing interactions
    EventBus.$on('ol-interaction-activated', startedInteraction => {
      me.activeInteractions.push(startedInteraction);
    });
    EventBus.$on('ol-interaction-stoped', stopedInteraction => {
      me.activeInteractions = Array.from(new Set(me.activeInteractions));
      me.activeInteractions = me.activeInteractions.filter(interaction => {
        return interaction !== stopedInteraction;
      });
    });
  },

  methods: {
    /**
     * Creates the OL layers due to the map "layers" array in app config.
     * @return {ol.layer.Base[]} Array of OL layer instances
     */
    createLayers() {
      let layers = [];
      const me = this;
      const activeLayerGroup = this.activeLayerGroup;
      const visibleGroup = this.$appConfig.map.groups[
        activeLayerGroup.fuelGroup
      ][activeLayerGroup.region];
      const visibleLayers = visibleGroup.layers;

      if (visibleGroup.center) {
        this.map.getView().setCenter(fromLonLat(visibleGroup.center));
      }

      if (visibleGroup.resolution) {
        this.map.getView().setResolution(visibleGroup.resolution);
      }

      if (visibleGroup.minResolution && visibleGroup.maxResolution) {
        this.map.getView().minResolution_ = visibleGroup.minResolution;
        this.map.getView().maxResolution_ = visibleGroup.maxResolution;
      }

      console.log(this.map.getView());

      const layersConfigGrouped = groupBy(this.$appConfig.map.layers, 'group');
      for (var group in layersConfigGrouped) {
        // eslint-disable-next-line no-prototype-builtins
        if (!layersConfigGrouped.hasOwnProperty(group)) {
          continue;
        }
        const mapLayers = [];
        layersConfigGrouped[group].reverse().forEach(function(lConf) {
          const layerIndex = visibleLayers.indexOf(lConf.name);
          if (layerIndex === -1) return;
          const layer = LayerFactory.getInstance(lConf);
          layer.setZIndex(layerIndex);
          mapLayers.push(layer);
          if (layer.get('name')) {
            me.setLayer(layer);
          }
        });
        let layerGroup = new LayerGroup({
          name: group !== undefined ? group.toString() : 'Other Layers',
          layers: mapLayers
        });
        layers.push(layerGroup);
      }
      return layers;
    },

    /**
     * Creates a layer to visualize selected GetInfo features.
     */
    createGetInfoLayer() {
      const source = new VectorSource({
        wrapX: false
      });
      const vector = new VectorLayer({
        name: 'Get Info Layer',
        displayInLayerList: false,
        zIndex: 20,
        source: source,
        style: popupInfoStyle
      });
      this.getInfoLayerSource = source;
      this.map.addLayer(vector);
    },

    /**
     * Sets the background color of the OL buttons to the color property.
     */
    setOlButtonColor() {
      var me = this;

      if (isCssColor(me.color)) {
        // directly apply the given CSS color
        const rotateEl = document.querySelector('.ol-rotate');
        if (rotateEl) {
          rotateEl.className += ' elevation-5';
          rotateEl.borderRadius = '40px';
          const rotateElStyle = document.querySelector(
            '.ol-rotate .ol-rotate-reset'
          ).style;
          rotateElStyle.backgroundColor = me.color;
          rotateElStyle.borderRadius = '40px';
        }
        const attrEl = document.querySelector('.ol-attribution');
        if (attrEl) {
          attrEl.className += ' elevation-5';
          const elStyle = document.querySelector(
            ".ol-attribution button[type='button']"
          ).style;
          elStyle.backgroundColor = me.color;
          elStyle.borderRadius = '40px';
        }
      } else {
        // apply vuetify color by transforming the color to the corresponding
        // CSS class (see https://vuetifyjs.com/en/framework/colors)
        const [colorName, colorModifier] = me.color
          .toString()
          .trim()
          .split(' ', 2);

        if (document.querySelector('.ol-rotate')) {
          document
            .querySelector('.ol-rotate .ol-rotate-reset')
            .classList.add(colorName);
          document
            .querySelector('.ol-rotate .ol-rotate-reset')
            .classList.add(colorModifier);
        }
      }
    },

    /**
     * Show popup for the get info module.
     */
    createPopupOverlay() {
      const me = this;
      me.popupOverlay = new Overlay({
        element: me.$refs.popup.$el,
        autoPan: false,
        autoPanMargin: 40,
        autoPanAnimation: {
          duration: 250
        }
      });
      me.map.addOverlay(me.popupOverlay);
    },

    /**
     * Closes the popup if user click X button.
     */
    closePopup() {
      const me = this;
      if (me.popupOverlay) {
        me.popupOverlay.setPosition(undefined);
        me.popup.isVisible = false;
      }
      me.getInfoResult = [];
      me.popup.currentLayerIndex = 0;
      if (me.getInfoLayerSource) {
        me.getInfoLayerSource.clear();
      }
    },

    /**
     * Show getInfo popup.
     */
    showPopup() {
      // Clear highligh feature
      this.getInfoLayerSource.clear();
      let position = this.getInfoResult[this.popup.currentLayerIndex]
        .getGeometry()
        .getCoordinates();
      // Add highlight feature
      this.getInfoLayerSource.addFeature(
        this.getInfoResult[this.popup.currentLayerIndex]
      );
      while (position && Array.isArray(position[0])) {
        position = position[0];
      }
      this.map.getView().animate({
        center: position,
        duration: 400
      });
      this.popupOverlay.setPosition(position);
      this.popup.isVisible = true;
      this.popup.title = `Info`;
    },

    /**
     * Map pointer move event .
     */
    setupMapPointerMove() {
      this.mapPointerMoveListenerKey = this.map.on('pointermove', evt => {
        if (evt.dragging || this.activeInteractions.length > 0) {
          return;
        }
        const features = this.map.getFeaturesAtPixel(evt.pixel);

        this.map.getTarget().style.cursor =
          features.length > 0 ? 'pointer' : '';
      });
    },

    /**
     * Map click event for Module.
     */
    setupMapClick() {
      const me = this;
      const map = me.map;
      me.mapClickListenerKey = map.on('click', evt => {
        me.closePopup();
        if (me.activeInteractions.length > 0) {
          return;
        }

        const coordinate = evt.coordinate;
        const projection = me.map.getView().getProjection();
        const resolution = me.map.getView().getResolution();

        me.queryableLayers = getAllChildLayers(me.map).filter(
          layer =>
            layer.get('queryable') === true && layer.getVisible() === true
        );
        // WMS Requests
        let promiseArray = [];
        me.queryableLayers.forEach(layer => {
          const layerType = getLayerType(layer);
          switch (layerType) {
            case 'WFS': {
              let selectedFeatures = me.map.getFeaturesAtPixel(evt.pixel, {
                hitTolerance: 4,
                layerFilter: layerCandidate => {
                  return layerCandidate.get('name') === layer.get('name');
                }
              });
              if (selectedFeatures !== null && selectedFeatures.length > 0) {
                // TODO: If there are more then 2 features selected get the closest one to coordinate rather than the first element
                const clonedFeature = selectedFeatures[0];
                clonedFeature.set('layerName', layer.get('name'));
                me.getInfoResult.push(clonedFeature);
              }
              break;
            }
            case 'WMS': {
              let url = layer
                .getSource()
                .getFeatureInfoUrl(coordinate, resolution, projection, {
                  INFO_FORMAT: 'application/json'
                });
              promiseArray.push(
                http.get(url, {
                  data: { layerName: layer.get('name') }
                })
              );
              break;
            }
            default:
              break;
          }
        });
        if (promiseArray.length > 0) {
          axios.all(promiseArray).then(function(results) {
            results.forEach(response => {
              const features = response.data.features;
              const layerName = JSON.parse(response.config.data).layerName;
              if (features && features.length === 0) {
                return;
              }
              const olFeatures = geojsonToFeature(response.data, {});

              olFeatures[0].set('layerName', layerName);
              me.getInfoResult.push(olFeatures[0]);
            });

            if (me.getInfoResult.length > 0) {
              me.showPopup();
            }
          });
        } else {
          // Only for WFS layer
          if (me.getInfoResult.length > 0) {
            me.showPopup();
          }
        }
      });
    },
    previousGetInfoLayer() {
      this.popup.currentLayerIndex -= 1;
      this.showPopup();
    },
    nextGetInfoLayer() {
      this.popup.currentLayerIndex += 1;
      this.showPopup();
    },
    ...mapMutations('map', {
      setMap: 'SET_MAP',
      setLayer: 'SET_LAYER'
    })
  },
  computed: {
    currentInfo() {
      const feature = this.getInfoResult[this.popup.currentLayerIndex];
      if (!feature) return;
      const props = feature.getProperties();
      let transformed = [];
      const excludedProperties = [
        'id',
        'geometry',
        'geom',
        'orgin_geometry',
        'osm_id',
        'gid',
        'layerName'
      ];
      if (props.PopupInfo) {
        transformed.push({
          property: 'PopupInfo',
          value: props.PopupInfo
        });
      } else {
        Object.keys(props).forEach(k => {
          if (!excludedProperties.includes(k) && !typeof k !== 'object') {
            transformed.push({
              property: humanize(k),
              value: !props[k] ? '---' : props[k]
            });
          }
        });
      }
      return transformed;
    },
    ...mapGetters('map', {
      activeLayerGroup: 'activeLayerGroup'
    })
  },
  watch: {
    activeInteractions() {
      if (!this.dblClickZoomInteraction) return;
      if (this.activeInteractions.length > 0) {
        this.dblClickZoomInteraction.setActive(false);
      } else {
        this.dblClickZoomInteraction.setActive(true);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
div.ol-attribution {
  bottom: 4px;
  border-radius: 40px;
}

div.ol-control {
  padding: 0px;
  border-radius: 40px;
}

div.ol-control button {
  margin: 0px !important;
}

/* Hover tooltip */
.wg-hover-tooltiptext {
  width: 120px;
  background-color: rgba(211, 211, 211, 0.9);
  color: #222;
  text-align: center;
  padding: 5px;
  border-radius: 6px;

  /* Position the hover tooltip */
  position: absolute;
  z-index: 1;
}

.ol-attribution ul {
  margin: 0;
  padding: 0 0.5em;
  font-size: 0.7rem;
  line-height: 1.375em;
  color: #000;
  text-shadow: 0 0 2px #fff;
}
</style>
