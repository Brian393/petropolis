<template>
  <div id="ol-map-container">
    <!-- Map Controls -->
    <zoom-control :map="map" />
    <full-screen />
    <locate :map="map" />
    <route-controls />
    <div
      v-show="spotlightMessage === true"
      class="elevation-4 regular spotlight-message"
      ref="spotlightControls"
    >
      press ↑ or ↓ to change spotlight size
    </div>
    <!-- Popup overlay  -->
    <overlay-popup :title="popup.title" v-show="popup.isVisible" ref="popup">
      <v-btn icon>
        <v-icon>close</v-icon>
      </v-btn>
      <template v-slot:close>
        <v-btn @click="closePopup()" icon>
          <v-icon>close</v-icon>
        </v-btn>
      </template>
      <template v-slot:body>
        <div
          v-if="popup.activeFeature"
          class="mb-3 font-weight-bold title"
          v-html="
            popup.activeFeature.get('category') ||
            popup.activeFeature.get('title')
              ? popup.activeFeature.get('category') ||
                popup.activeFeature.get('title')
              : popup.activeLayer
              ? popup.activeLayer.get('name')
              : ''
          "
        ></div>

        <div style="max-height:490px;">
          <vue-scroll>
            <div class="body-2" v-for="item in popupInfo" :key="item.property">
              <span
                v-if="isPopupRowVisible(item)"
                v-html="
                  `<strong>${mapPopupPropName(item)}: </strong>` + item.value
                "
              ></span>
            </div>
          </vue-scroll>
          <div v-if="popup.activeFeature" class="mt-1">
            <a
              v-if="
                popup.activeLayer &&
                  popup.activeLayer.get('showZoomToFeature') !== false &&
                  popup.activeFeature
              "
              href="javascript:void(0)"
              @click="zoomToFeature()"
            >
              <strong>{{
                popup.activeFeature.getGeometry().getType() === 'Point'
                  ? 'DIVE'
                  : 'VIEW WHOLE FEATURE'
              }}</strong>
            </a>
            <a
              v-if="
                (popup.activeFeature.get('entity') &&
                  !selectedCoorpNetworkEntity) ||
                  (selectedCoorpNetworkEntity &&
                    popup.activeFeature.get('entity') &&
                    !popup.activeFeature
                      .get('entity')
                      .includes(selectedCoorpNetworkEntity))
              "
              @click="queryCoorporateNetwork"
              href="javascript:void(0)"
              class="ml-2"
            >
              <strong>CORPORATE NETWORK</strong>
            </a>
          </div>
        </div>
        <v-divider></v-divider>
      </template>
    </overlay-popup>
    <app-lightbox ref="lightbox" :images="lightBoxImages"></app-lightbox>
    <progress-loader
      :value="progressLoading.value"
      :progressColor="progressLoading.progressColor"
      :message="progressLoading.message"
    ></progress-loader>
  </div>
</template>

<script>
import Vue from 'vue';

// ol imports
import Map from 'ol/Map';
import View from 'ol/View';
import Overlay from 'ol/Overlay';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import VectorTileLayer from 'ol/layer/VectorTile';
import { like as likeFilter } from 'ol/format/filter';

// style imports
import { popupInfoStyle } from '../../../style/OlStyleDefs';

// import the app-wide EventBus
import { EventBus } from '../../../EventBus';

// utils imports
import { LayerFactory } from '../../../factory/OlLayer';
import { isCssColor } from '../../../utils/Helpers';
import { fromLonLat } from 'ol/proj';
import {
  extractGeoserverLayerNames,
  wfsRequestParser
} from '../../../utils/Layer';
import UrlUtil from '../../../utils/Url';
import { geojsonToFeature } from '../../../utils/MapUtils';

//Store imports
import { mapMutations, mapGetters, mapActions } from 'vuex';
import { mapFields } from 'vuex-map-fields';

// Map Controls
import OverlayPopup from './controls/Overlay';
import ZoomControl from './controls/ZoomControl';
import FullScreen from './controls/FullScreen';
import Locate from './controls/Locate';
import RouteControls from './controls/RouteControls';

// Interactions
import DoubleClickZoom from 'ol/interaction/DoubleClickZoom';
import { defaults as defaultInteractions } from 'ol/interaction';

// Ol controls
import { defaults as defaultControls, Attribution } from 'ol/control';

// Lightbox
import AppLightBox from '../../core/AppLightBox';

// Media lightbox
import MediaLightBox from '../../core/MediaLightBox';

// Shared methods
import { SharedMethods } from '../../../mixins/SharedMethods';

// Services
import http from '../../../services/http';

// Progress loader
import ProgressLoader from '../../core/ProgressLoader';

export default {
  components: {
    'overlay-popup': OverlayPopup,
    'zoom-control': ZoomControl,
    'full-screen': FullScreen,
    'route-controls': RouteControls,
    'app-lightbox': AppLightBox,
    'progress-loader': ProgressLoader,
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
      getInfoResult: [],
      radius: 300,
      mousePosition: undefined,
      spotlightMessage: false,
      lightBoxImages: [],
      progressLoading: {
        message: 'Fetching Coorporate Network',
        progressColor: '#DC143C',
        value: false
      }
    };
  },
  mixins: [SharedMethods],
  mounted() {
    var me = this;
    // Add keydown event listener to change spotlight radius
    window.addEventListener('keydown', e => {
      if (e.keyCode === 38) {
        // up arrow key
        this.radius = Math.min(this.radius + 5, 800);
        this.map.render();
      } else if (e.keyCode === 40) {
        // down arrow key
        this.radius = Math.max(this.radius - 5, 0);
        this.map.render();
      }
    });
    // Make the OL map accessible for Mapable mixin even 'ol-map-mounted' has
    // already been fired. Don not use directly in cmps, use Mapable instead.
    Vue.prototype.$map = me.map;
    // Send the event 'ol-map-mounted' with the OL map as payload
    EventBus.$emit('ol-map-mounted', me.map);
    // Capture the event 'findCoorporateNetwork' emitted from sidepanel
    EventBus.$on('findCoorporateNetwork', me.queryCoorporateNetwork);
    EventBus.$on('closePopupInfo', me.closePopup);
    // resize the map, so it fits to parent
    window.setTimeout(() => {
      me.map.setTarget(document.getElementById('ol-map-container'));
      me.map.updateSize();
      // adjust the bg color of the OL buttons (like zoom, rotate north, ...)
      me.setOlButtonColor();
      // Get Info
      me.setupMapClick();
      // Pointer Move
      me.setupMapPointerMove();
      // Move end event
      this.setupMapMoveEnd();
      // Create popup overlay for get info
      me.createPopupOverlay();
      // Fetch gas pipes entities for styling
      me.fetchGasPipesEntities();
      // Remove layers with no entity property as it will
      // not work with Coorporate Networks. (A describe fetaure type )
      // for every layer is needed.
      me.fetchDescribeFeatureTypes();
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
    //Add map to the vuex store.
    me.setMap(me.map);
    // Create layers from config and add them to map
    me.createLayers();

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
      const me = this;
      // Get Info layer
      me.createGetInfoLayer();

      // Other Operotionial Layers
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

      this.$appConfig.map.layers.forEach(lConf => {
        const layerIndex = visibleLayers.indexOf(lConf.name);
        if (layerIndex === -1) return;
        const layer = LayerFactory.getInstance(lConf);
        layer.setZIndex(layerIndex);
        // Enable spotlight for ESRI Imagery
        if (layer.get('name') === 'ESRI-World-Imagery') {
          layer.on('prerender', e => {
            this.spotlight(e);
          });
          layer.on('postrender', function(e) {
            e.context.restore();
          });
        }
        if (layer.get('name')) {
          me.setLayer(layer);
        }
      });
    },

    /**
     * Creates a layer to visualize selected GetInfo features.
     */
    createGetInfoLayer() {
      // For Vector selection
      const source = new VectorSource({
        wrapX: false
      });
      const vector = new VectorLayer({
        name: 'Get Info Layer',
        displayInLayerList: false,
        zIndex: 2000,
        source: source,
        style: popupInfoStyle()
      });
      this.popup.highlightLayer = vector;
      this.map.addLayer(vector);
    },

    /**
     * Create Vector Tile Highligh layer.
     */

    createVTHighlightLayer(source) {
      // For Vector tiles selection.
      var vectorTileLayer = new VectorTileLayer({
        renderMode: 'vector',
        source: source,
        zIndex: 100,
        style: feature => {
          if (
            this.popup.activeFeature &&
            this.popup.activeFeature.getId() === feature.getId()
          ) {
            return popupInfoStyle()(feature);
          }
        }
      });
      this.popup.highlightVectorTileLayer = vectorTileLayer;
      this.map.addLayer(this.popup.highlightVectorTileLayer);
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
      me.popup.popupOverlay = new Overlay({
        element: me.$refs.popup.$el,
        autoPan: false,
        autoPanMargin: 40,
        autoPanAnimation: {
          duration: 250
        }
      });
      me.map.addOverlay(me.popup.popupOverlay);
    },

    /**
     * Closes the popup if user click X button.
     */
    closePopup() {
      const me = this;
      if (me.popup.popupOverlay) {
        me.popup.popupOverlay.setPosition(undefined);
        me.popup.isVisible = false;
      }

      // Clear highligh feature (Don't clear if a coorporate network entity is selected)
      if (me.popup.highlightLayer && !this.selectedCoorpNetworkEntity) {
        this.popup.highlightLayer.getSource().clear();
      }
      if (me.popup.highlightVectorTileLayer) {
        me.map.removeLayer(me.popup.highlightVectorTileLayer);
      }

      me.popup.activeFeature = null;
      me.popup.activeLayer = null;
      me.popup.showInSidePanel = false;
    },

    /**
     * Show getInfo popup.
     */
    showPopup(clickCoord) {
      // Clear highligh feature (Don't clear if a coorporate network entity is selected)
      if (!this.selectedCoorpNetworkEntity) {
        this.popup.highlightLayer.getSource().clear();
      }
      let position = this.popup.activeFeature.getGeometry().getCoordinates();
      // Correct popup position (used feature coordinates insteaad of mouse)
      let closestPoint;
      // Closest point doesn't work with vector tile layers.
      if (position) {
        closestPoint = this.popup.activeFeature
          .getGeometry()
          .getClosestPoint(clickCoord);
      } else {
        closestPoint = clickCoord;
      }
      this.map.getView().animate({
        center: closestPoint,
        duration: 400
      });
      this.popup.popupOverlay.setPosition(closestPoint);
      this.popup.isVisible = true;
      this.popup.title = `Info`;
    },
    /**
     * Zooms to feature, add a cloned feature to the highlight layer and set the position of popup undefined
     * move the popup content to sidepanel and replace legend with feature image if exist.
     *
     */
    zoomToFeature() {
      const geometry = this.popup.activeFeature.getGeometry();
      this.popup.highlightLayer.getSource().clear();
      if (geometry.getType() === 'Point') {
        this.map.getView().animate({
          center: geometry.getCoordinates(),
          zoom: 13,
          duration: 800
        });
      } else {
        // Zoom to extent adding a padding to the extent
        this.map.getView().fit(geometry.getExtent(), {
          padding: [10, 10, 10, 10],
          duration: 800
        });

        // Logic for vector tile layers. (Workaround as we can't clone features for highlight here.)
        if (this.popup.activeLayer.get('type') === 'VECTORTILE') {
          if (this.popup.highlightVectorTileLayer) {
            this.map.removeLayer(this.popup.highlightVectorTileLayer);
          }
          const vtSource = this.popup.activeLayer.getSource();
          this.createVTHighlightLayer(vtSource);
          this.popup.highlightVectorTileLayer.changed();
        } else {
          // Highlight feature

          this.popup.highlightLayer
            .getSource()
            .addFeature(this.popup.activeFeature.clone());
        }
      }
      setTimeout(() => {
        this.selectedCoorpNetworkEntity = null;
      }, 800);
      // Close popup
      this.popup.popupOverlay.setPosition(undefined);
      this.popup.showInSidePanel = true;
    },

    /**
     * Map pointer move event .
     */
    setupMapPointerMove() {
      this.mapPointerMoveListenerKey = this.map.on('pointermove', evt => {
        if (evt.dragging || this.activeInteractions.length > 0) {
          return;
        }
        const features = this.map.getFeaturesAtPixel(evt.pixel, {
          layerFilter: candidate => {
            if (candidate.get('isInteractive') === false) {
              return false;
            }
            return true;
          }
        });

        this.map.getTarget().style.cursor =
          features.length > 0 ? 'pointer' : '';

        this.mousePosition = this.map.getEventPixel(evt.originalEvent);
        this.map.render();
      });
    },

    setupMapMoveEnd() {
      // After the map moveend event fires, determine if the instructions
      // for using the spotlights should be shown based on zoom level.
      this.map.on('moveend', () => {
        const resolutionLevel = this.map.getView().getResolution();
        if (resolutionLevel <= 20) {
          this.spotlightMessage = true;
        } else {
          this.spotlightMessage = false;
        }
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
        let feature, layer;
        this.map.forEachFeatureAtPixel(
          evt.pixel,
          (f, l) => {
            // Order of features is based is based on zIndex.
            // First feature is on top, last feature is on bottom.
            if (!feature) {
              feature = f;
              layer = l;
            }
          },
          {
            hitTolerance: 3
          }
        );
        // Check if layer is interactive
        if (
          (layer && layer.get('isInteractive') === false) ||
          (layer && layer.get('queryable') === false)
        )
          return;

        this.popup.activeLayer = layer;

        // Clear lightbox images array
        if (this.lightBoxImages) {
          this.lightBoxImages = [];
        }

        if (feature) {
          const props = feature.getProperties();
          // Check if feature has video link
          if (props.vimeoSrc) {
            const mediabox = new MediaLightBox(props.vimeoSrc);
            mediabox.open();
            return;
          }
          // Check if feature has lightbox array of images
          if (Array.isArray(props.lightbox)) {
            props.lightbox.forEach(image => {
              let imageUrl;
              let caption = '';
              if (typeof image === 'object') {
                // Image is stored as object. Get imageUrl and caption values
                imageUrl = image.imageUrl;
                caption = image.caption;
              } else {
                // Image is stored as a string
                imageUrl = image;
              }
              const url = UrlUtil.parseUrl(imageUrl);
              this.lightBoxImages.push({
                src: url,
                thumb: url,
                caption: caption
              });
            });
            // Open lightbox
            this.$refs.lightbox.open();
            // Popup will not be opened if there are lightbox images
            return;
          }

          this.popup.activeFeature = feature;
          // Show popup only for point features.
          if (
            ['Point', 'MultiPoint'].includes(feature.getGeometry().getType()) ||
            this.selectedCoorpNetworkEntity
          ) {
            if (
              feature &&
              feature.get('entity') &&
              feature.get('entity').includes(this.selectedCoorpNetworkEntity) &&
              this.selectedCoorpNetworkEntity &&
              !this.$appConfig.map.corporateEntitiesUrls[
                this.selectedCoorpNetworkEntity
              ]
            ) {
              return;
            }
            this.showPopup(evt.coordinate);
          } else {
            this.zoomToFeature();
          }
        }
      });
    },
    spotlight: function(e) {
      let ctx = e.context;
      const pixelRatio = e.frameState.pixelRatio;
      ctx.save();
      ctx.beginPath();
      if (this.mousePosition) {
        // Only show a circle around the mouse --
        ctx.arc(
          this.mousePosition[0] * pixelRatio,
          this.mousePosition[1] * pixelRatio,
          this.radius * pixelRatio,
          0,
          2 * Math.PI
        );
        ctx.lineWidth = 6 * pixelRatio;
        ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        ctx.stroke();
      }
      ctx.clip();
    },
    queryCoorporateNetwork() {
      const entity = this.popup.activeFeature.get('entity');
      const workspace = 'petropolis';
      if (!entity || !this.layersWithEntityField) return;
      if (!this.geoserverLayerNames) {
        this.geoserverLayerNames = extractGeoserverLayerNames(
          this.map,
          this.layersWithEntityField
        );
        // Filter only geoserver layers names with entity field.
        this.geoserverLayerNames[workspace] = this.geoserverLayerNames[
          workspace
        ].filter(name => this.layersWithEntityField.includes(name));
      }

      const wfsRequest = wfsRequestParser(
        'EPSG:3857',
        workspace,
        this.geoserverLayerNames[workspace],
        likeFilter('entity', entity)
      );
      this.progressLoading.value = true;
      this.progressLoading.message = `Fetching data for: "${entity}"`;
      http
        .post(`http://209.126.13.2/geoserver/${workspace}/wfs`, wfsRequest, {
          headers: { 'Content-Type': 'text/xml' }
        })
        .then(response => {
          if (response.data) {
            this.progressLoading.value = false;
            const olFeatures = geojsonToFeature(response.data, {});
            if (this.popup.highlightLayer) {
              this.popup.highlightLayer.getSource().clear();
              this.popup.highlightLayer.getSource().addFeatures(olFeatures);

              // Zoom to extent adding a padding to the extent
              this.map
                .getView()
                .fit(this.popup.highlightLayer.getSource().getExtent(), {
                  padding: [10, 10, 10, 10],
                  duration: 800
                });
              this.popup.popupOverlay.setPosition(undefined);
              this.selectedCoorpNetworkEntity = entity;
            }
          }
        })
        .catch(error => {
          // handle error
          console.log(error);
          this.progressLoading.value = false;
          //TODO: Show snackbar for errors.
        });
    },
    fetchDescribeFeatureTypes() {
      const geoserverLayerNames = extractGeoserverLayerNames(
        this.$appConfig.map.layers
      );
      const workspace = 'petropolis';
      if (!geoserverLayerNames[workspace]) return;
      http
        .get('http://209.126.13.2/geoserver/wfs', {
          params: {
            service: 'WFS',
            version: ' 2.0.0',
            request: 'DescribeFeatureType',
            outputFormat: 'application/json',
            typeNames: `${workspace}:${geoserverLayerNames[
              workspace
            ].toString()}`
          }
        })
        .then(response => {
          if (response.data && response.data.featureTypes) {
            const filterLayersWithEntity = [];
            const featureTypes = response.data.featureTypes;
            featureTypes.forEach(featureType => {
              featureType.properties.forEach(property => {
                if (
                  property.name === 'entity' &&
                  filterLayersWithEntity.indexOf(featureType.typeName) === -1
                ) {
                  filterLayersWithEntity.push(featureType.typeName);
                }
              });
            });
            if (!this.layersWithEntityField) {
              this.layersWithEntityField = filterLayersWithEntity;
            }
          }
        })
        .catch(function(error) {
          // handle error
          console.log(error);
        });
    },
    isPopupRowVisible(item) {
      if (
        this.selectedCoorpNetworkEntity &&
        this.popup.activeFeature &&
        this.popup.activeFeature.get('entity') &&
        this.popup.activeFeature
          .get('entity')
          .includes(this.selectedCoorpNetworkEntity)
      ) {
        return (
          !this.popup.hiddenProps.includes(item.property) &&
          !['null', '---'].includes(item.value)
        );
      }

      if (!['null', '---'].includes(item.value)) {
        return (
          this.popup.diveVisibleProps.includes(item.property) &&
          !this.popup.hiddenProps.includes(item.property)
        );
      } else {
        return false;
      }
    },
    ...mapActions('map', {
      fetchGasPipesEntities: 'fetchGasPipesEntities'
    }),
    ...mapMutations('map', {
      setMap: 'SET_MAP',
      setLayer: 'SET_LAYER',
      removeAllLayers: 'REMOVE_ALL_LAYERS'
    })
  },
  computed: {
    ...mapGetters('map', {
      activeLayerGroup: 'activeLayerGroup',
      popupInfo: 'popupInfo'
    }),
    ...mapFields('map', {
      popup: 'popup',
      geoserverLayerNames: 'geoserverLayerNames',
      layersWithEntityField: 'layersWithEntityField',
      selectedCoorpNetworkEntity: 'selectedCoorpNetworkEntity'
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
    },
    activeLayerGroup() {
      this.removeAllLayers();
      this.closePopup();
      // Reset geoserver layer names array
      this.geoserverLayerNames = null;
      this.selectedCoorpNetworkEntity = null;
      this.createLayers();
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

.spotlight-message {
  background-color: #dc143c;
  position: absolute;
  left: 80px;
  top: 17px;
  color: white;
  padding: 5px;
  border-radius: 5px;
  z-index: 100;
}
</style>
