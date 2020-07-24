<template>
  <div id="ol-map-container">
    <!-- Map Controls -->
    <zoom-control :map="map" />

    <full-screen />
    <locate :map="map" />
    <map-legend color="#dc143c" />
    <route-controls />

    <div
      v-show="spotlightMessage === true"
      class="elevation-4 regular spotlight-message"
      ref="spotlightControls"
    >
      press ↑ or ↓ to change spotlight size
    </div>
    <!-- Popup overlay  -->
    <overlay-popup
      :title="
        popup.activeFeature
          ? popup.activeFeature.get('category') ||
            popup.activeFeature.get('title')
            ? popup.activeFeature.get('category') ||
              popup.activeFeature.get('title')
            : popup.activeLayer
            ? popup.activeLayer.get('name')
            : ''
          : ''
      "
      v-show="popup.isVisible"
      ref="popup"
    >
      <v-btn icon>
        <v-icon>close</v-icon>
      </v-btn>
      <template v-slot:close>
        <v-btn @click="closePopup()" icon>
          <v-icon>close</v-icon>
        </v-btn>
      </template>
      <template v-slot:body>
        <vue-scroll ref="vs">
          <div style="max-height:280px;" class="pr-2">
            <div class="body-2" v-for="item in popupInfo" :key="item.property">
              <span
                v-if="isPopupRowVisible(item)"
                v-html="
                  `<strong>${mapPopupPropName(item)}: </strong>` + item.value
                "
              ></span>
            </div>
          </div>
        </vue-scroll>
        <div v-if="popup.activeFeature" class="mt-1">
          <a
            v-if="
              popup.activeLayer &&
                popup.activeLayer.get('showZoomToFeature') !== false &&
                popup.activeFeature &&
                selectedCoorpNetworkEntity === null
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
                  splittedEntities &&
                  !splittedEntities.some(substring =>
                    popup.activeFeature.get('entity').includes(substring)
                  ))
            "
            @click="queryCorporateNetwork"
            href="javascript:void(0)"
            class="ml-2"
          >
            <strong>CORPORATE NETWORK</strong>
          </a>
        </div>
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
import Feature from 'ol/Feature';
import RenderFeature from 'ol/render/Feature';
import { fromExtent } from 'ol/geom/Polygon';
import { fromLonLat } from 'ol/proj';
import { extend } from 'ol/extent';
import { like as likeFilter, or as orFilter } from 'ol/format/filter';

// style imports
import {
  popupInfoStyle,
  networkCorpHighlightStyle,
  worldOverlayFill
} from '../../../style/OlStyleDefs';

// import the app-wide EventBus
import { EventBus } from '../../../EventBus';

// utils imports
import { LayerFactory } from '../../../factory/OlLayer';
import { isCssColor } from '../../../utils/Helpers';
import {
  extractGeoserverLayerNames,
  wfsRequestParser,
  getLayerSourceUrl
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
import Legend from './controls/Legend';

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
import axios from 'axios';

// Progress loader
import ProgressLoader from '../../core/ProgressLoader';

export default {
  components: {
    'overlay-popup': OverlayPopup,
    'map-legend': Legend,
    'zoom-control': ZoomControl,
    'full-screen': FullScreen,
    'route-controls': RouteControls,
    'app-lightbox': AppLightBox,
    locate: Locate,
    'progress-loader': ProgressLoader
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
        message: 'Fetching Corporate Network',
        progressColor: '#dc143c',
        value: false
      },
      ops: {
        vuescroll: {
          sizeStrategy: 'number'
        }
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

    // Capture the event 'findCorporateNetwork' emitted from sidepanel
    EventBus.$on('findCorporateNetwork', me.queryCorporateNetwork);
    EventBus.$on('closePopupInfo', me.closePopup);
    EventBus.$on('resetMap', me.resetMap);

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
      // not work with Corporate Networks. (A describe fetaure type )
      // for every layer is needed.
      me.fetchDescribeFeatureTypes();
      if (this.activeLayerGroup.region === 'local') {
        EventBus.$emit('zoomToLocation');
      }
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
      const activeLayerGroup = this.activeLayerGroup;
      const visibleGroup = this.$appConfig.map.groups[
        activeLayerGroup.fuelGroup
      ][activeLayerGroup.region];
      const visibleLayers = visibleGroup.layers;
      me.resetMap();
      // World Overlay Layer and selected features layer for corporate network
      me.createWorldExtentOverlayLayer();
      me.createSelectedCorpNetworkLayer();

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
        zIndex: 3000,
        source: source,
        style: popupInfoStyle()
      });
      this.popup.highlightLayer = vector;
      this.map.addLayer(vector);
    },

    /**
     * Creates a layer to visualize selected GetInfo features.
     */
    createWorldExtentOverlayLayer() {
      // For Vector selection
      const source = new VectorSource({
        wrapX: true
      });
      const vector = new VectorLayer({
        name: 'World Extent Layer',
        isInteractive: false,
        queryable: false,
        zIndex: 2000,
        source: source,
        style: worldOverlayFill()
      });
      this.popup.worldExtentLayer = vector;
      this.map.addLayer(vector);
    },

    /**
     * Create a layer to visualize selected corporate network features.
     */
    createSelectedCorpNetworkLayer() {
      // For Vector selection
      const source = new VectorSource({
        wrapX: true
      });
      const vector = new VectorLayer({
        name: 'Corporate Selected Network Layer',
        zIndex: 2500,
        hoverable: true,
        source: source,
        style: networkCorpHighlightStyle()
      });
      this.popup.selectedCorpNetworkLayer = vector;
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
        hoverable: true,
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

      // Clear highligh feature (Don't clear if a corporate network entity is selected)
      if (me.popup.highlightLayer) {
        this.popup.highlightLayer.getSource().clear();
      }
      if (me.popup.highlightVectorTileLayer) {
        me.map.removeLayer(me.popup.highlightVectorTileLayer);
      }

      if (!this.selectedCoorpNetworkEntity) {
        me.popup.activeFeature = null;
        me.popup.activeLayer = null;
      }
      me.popup.showInSidePanel = false;
    },

    /**
     * Show getInfo popup.
     */
    showPopup(clickCoord) {
      // Clear highligh feature (Don't clear if a corporate network entity is selected)
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
      this.popup.title = 'Info';
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
          zoom: 14,
          duration: 800
        });
      } else {
        // Zoom to extent adding a padding to the extent
        this.map.getView().fit(geometry.getExtent(), {
          padding: [100, 100, 100, 100],
          duration: 800
        });

        this.popup.highlightLayer
          .getSource()
          .addFeature(this.popup.activeFeature.clone());
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
      let overlayEl;
      // create a span to show map tooltip
      overlayEl = document.createElement('div');
      overlayEl.className = 'tooltip';
      this.overlayEl = overlayEl;
      // wrap the tooltip span in a OL overlay and add it to map
      this.overlay = new Overlay({
        element: overlayEl,
        offset: [22, 12],
        positioning: 'center-left',
        stopEvent: true,
        insertFirst: false
      });
      this.map.addOverlay(this.overlay);

      this.mapPointerMoveListenerKey = this.map.on('pointermove', evt => {
        if (evt.dragging || this.activeInteractions.length > 0) {
          return;
        }

        let feature, layer;
        this.map.forEachFeatureAtPixel(
          evt.pixel,
          (f, l) => {
            // Order of features is based is based on zIndex.
            // First feature is on top, last feature is on bottom.
            if (!feature && l.get('isInteractive') !== false) {
              feature = f;
              layer = l;
            }
          },
          {
            hitTolerance: 3
          }
        );

        this.map.getTarget().style.cursor = feature ? 'pointer' : '';

        if (!feature || !layer.get('hoverable')) {
          overlayEl.innerHTML = null;
          this.overlay.setPosition(undefined);
        } else {
          if (!feature) return;
          if (
            this.popup.activeFeature &&
            this.popup.activeFeature.getId() === `clone.${feature.getId()}`
          )
            return;
          const attr =
            feature.get('hoverAttribute') ||
            feature.get('title') ||
            feature.get('entity') ||
            feature.get('NAME');
          if (!attr) return;
          if (layer.get('styleObj')) {
            const { hoverTextColor, hoverBackgroundColor } = JSON.parse(
              layer.get('styleObj')
            );

            hoverBackgroundColor && overlayEl
              ? (overlayEl.style.backgroundColor = hoverBackgroundColor)
              : (overlayEl.style.backgroundColor = '');

            hoverTextColor && overlayEl
              ? (overlayEl.style.color = hoverTextColor)
              : (overlayEl.style.color = '');
          }
          if (
            (!feature.get('entity') && this.selectedCoorpNetworkEntity) ||
            (feature.get('entity') &&
              this.selectedCoorpNetworkEntity &&
              this.splittedEntities &&
              !this.splittedEntities.some(substring =>
                feature.get('entity').includes(substring)
              ))
          ) {
            return;
          }

          overlayEl.innerHTML = attr;
          this.overlay.setPosition(evt.coordinate);
        }

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
      me.mapClickListenerKey = map.on('click', async evt => {
        if (me.activeInteractions.length > 0) {
          return;
        }
        let feature, layer;
        this.map.forEachFeatureAtPixel(
          evt.pixel,
          (f, l) => {
            // Order of features is based is based on zIndex.
            // First feature is on top, last feature is on bottom.
            if (
              !feature &&
              l.get('isInteractive') !== false &&
              l.get('queryable') !== false
            ) {
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

        if (
          feature &&
          !feature.get('entity') &&
          this.selectedCoorpNetworkEntity
        )
          return;

        if (
          feature &&
          feature.get('entity') &&
          this.selectedCoorpNetworkEntity &&
          this.splittedEntities &&
          !this.splittedEntities.some(substring =>
            feature.get('entity').includes(substring)
          )
        ) {
          return;
        }

        me.closePopup();
        if (this.selectedCoorpNetworkEntity && !layer) {
          return;
        }

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
          if (props.lightbox) {
            const images = JSON.parse(props.lightbox);
            if (!Array.isArray(images)) return;
            images.forEach(image => {
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

          this.popup.activeFeature = feature.clone ? feature.clone() : feature;

          // Add id reference
          if (feature instanceof RenderFeature) {
            const urls = layer.getSource().getUrls()[0];
            const url = urls.match('tms/1.0.0/(.*)@EPSG');
            if (!urls.includes('geoserver')) return;
            if (!Array.isArray(url) || url.length < 2) return;
            const geoserverLayerName = url[1];
            const response = await http.get(
              'https://timetochange.today/geoserver/wfs',
              {
                params: {
                  service: 'WFS',
                  version: ' 2.0.0',
                  request: 'GetFeature',
                  outputFormat: 'application/json',
                  srsName: 'EPSG:3857',
                  typeNames: geoserverLayerName,
                  featureId: feature.getId()
                }
              }
            );
            if (response.data.features) {
              const olFeatures = geojsonToFeature(response.data, {});
              this.popup.activeFeature = olFeatures[0];
              feature = olFeatures[0];
            } else {
              return;
            }
          }
          if (feature.getId()) {
            this.popup.activeFeature.setId(`clone.${feature.getId()}`);
          }

          if (this.selectedCoorpNetworkEntity && this.popup.activeFeature) {
            this.popup.highlightLayer.getSource().clear();
            this.popup.activeFeature.setStyle(null);
            this.popup.highlightLayer
              .getSource()
              .addFeature(this.popup.activeFeature);
          }

          if (
            ['Point', 'MultiPoint'].includes(feature.getGeometry().getType()) ||
            this.selectedCoorpNetworkEntity
          ) {
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
    queryCorporateNetwork() {
      const entity = this.popup.activeFeature.get('entity');
      if (!entity) return;
      this.selectedCoorpNetworkEntity = entity;
      if (!this.layersWithEntityField || !this.splittedEntities) return;
      ///////////////////////
      const workspace = 'petropolis';
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

      const filterArray = [];
      this.splittedEntities.forEach(entity => {
        filterArray.push(likeFilter('entity', `%${entity}%`));
      });
      if (filterArray.length === 0) return;
      let filter;
      filterArray.length === 1
        ? (filter = filterArray[0])
        : (filter = orFilter(...filterArray));

      let promiseArray = [];
      this.geoserverLayerNames[workspace].forEach(geoserverLayerName => {
        const wfsRequest = wfsRequestParser(
          'EPSG:3857',
          workspace,
          [geoserverLayerName],
          filter
        );
        promiseArray.push(
          http.post(
            `https://timetochange.today/geoserver/${workspace}/wfs`,
            wfsRequest,
            {
              headers: { 'Content-Type': 'text/xml' },
              layerName: geoserverLayerName
            }
          )
        );
      });

      this.progressLoading.value = true;
      this.progressLoading.message = `Fetching data...`;
      this.popup.highlightLayer.getSource().clear();
      this.popup.worldExtentLayer.getSource().clear();
      this.popup.selectedCorpNetworkLayer.getSource().clear();
      const mapLayers = this.map.getLayers().getArray();
      axios
        .all(promiseArray)
        .then(results => {
          const olFeatures = [];
          results.forEach(response => {
            if (response.data.features) {
              const olFeaturesArray = geojsonToFeature(response.data, {});
              const geoserverLayerName = response.config.layerName;
              olFeaturesArray.forEach(feature => {
                if (feature.getGeometry().getType() === 'Point') {
                  // Find all the layers that have this feature using geoserverLayerName
                  mapLayers.forEach(layer => {
                    const url = getLayerSourceUrl(layer.getSource());
                    if (url && url.includes(geoserverLayerName)) {
                      const clonedFeature = feature.clone();
                      clonedFeature.setStyle(layer.getStyle());
                      olFeatures.push(clonedFeature);
                    }
                  });
                } else {
                  olFeatures.push(feature.clone());
                }
              });
            }
          });
          if (olFeatures) {
            this.popup.selectedCorpNetworkLayer
              .getSource()
              .addFeatures(olFeatures);
            // Zoom to extent adding a padding to the extent
            var extent = olFeatures[0]
              .getGeometry()
              .getExtent()
              .slice(0);
            olFeatures.forEach(function(feature) {
              extend(extent, feature.getGeometry().getExtent());
            });
            setTimeout(() => {
              this.map.getView().fit(extent, {
                padding: [30, 80, 80, 80],
                duration: 800
              });
            }, 500);
            this.popup.popupOverlay.setPosition(undefined);

            const worldOverlayGeometry = fromExtent([
              -20037508.342789244,
              -20037508.342789244,
              20037508.342789244,
              20037508.342789244
            ]);
            const worldExtentFeature = new Feature({
              geometry: worldOverlayGeometry
            });
            this.popup.worldExtentLayer
              .getSource()
              .addFeature(worldExtentFeature);
            this.progressLoading.value = false;
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
      const promisesArray = [];
      geoserverLayerNames[workspace].forEach(geoserverLayerName => {
        promisesArray.push(
          http.get('https://timetochange.today/geoserver/wfs', {
            params: {
              service: 'WFS',
              version: ' 2.0.0',
              request: 'DescribeFeatureType',
              outputFormat: 'application/json',
              typeNames: `${workspace}:${geoserverLayerName}`
            }
          })
        );
      });

      const filterLayersWithEntity = [];
      axios
        .all(promisesArray)
        .then(results => {
          results.forEach(response => {
            if (response.data && response.data.featureTypes) {
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
            }
          });
        })
        .catch(function(error) {
          // handle error
          console.log(error);
        });
      if (!this.layersWithEntityField) {
        this.layersWithEntityField = filterLayersWithEntity;
      }
    },
    isPopupRowVisible(item) {
      if (this.selectedCoorpNetworkEntity && this.popup.activeFeature) {
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
    resetMap() {
      // Other Operotionial Layers
      if (!this.map) return;
      const activeLayerGroup = this.activeLayerGroup;
      const visibleGroup = this.$appConfig.map.groups[
        activeLayerGroup.fuelGroup
      ][activeLayerGroup.region];

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
      popupInfo: 'popupInfo',
      splittedEntities: 'splittedEntities'
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
.tooltip {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-style: normal;
  position: relative;
  background-color: rgba(0, 0, 0, 0.9);
  border-radius: 4px;
  color: white;
  padding: 2px 8px;
  font-size: 14px;
  opacity: 1;
  font-weight: bold;
}

.tooltip::before {
  border-right: 6px solid transparent;
  border-left: 6px solid transparent;
  content: '';
  position: absolute;
  bottom: 40%;
  margin-left: -8px;
  left: 0%;
  transform: rotate(90deg);
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
