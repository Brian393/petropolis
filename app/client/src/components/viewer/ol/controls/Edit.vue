<template>
  <div class="mt-4 mb-2">
    <div>
      <v-layout>
        <v-spacer></v-spacer>
        <div v-if="!selectedLayer">
          <v-tooltip left>
            <template v-slot:activator="{ on }">
              <v-btn
                class="edit-buttons"
                v-on="on"
                @click="activateEdit"
                color="#dc143c"
                fab
                dark
                small
              >
                <v-icon small>far fa-edit</v-icon>
              </v-btn>
            </template>
            <span>Edit</span>
          </v-tooltip>
        </div>

        <v-menu
          v-if="selectedLayer"
          class="edit-buttons"
          origin="center center"
          offset-y
          :nudge-bottom="5"
          transition="slide-y-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              class="edit-buttons"
              dark
              rounded
              small
              color="#dc143c"
              ><v-icon small left>far fa-edit</v-icon>
              {{
                selectedLayer ? selectedLayer.get('legendDisplayName') : ''
              }}</v-btn
            >
          </template>

          <v-list dense>
            <v-list-item @click="changeLayer">
              <v-list-item-icon>
                <v-icon>layers</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Select layer to edit</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="closeEdit">
              <v-list-item-icon>
                <v-icon>close</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Close Edit</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-layout>
    </div>
    <div v-if="selectedLayer">
      <div v-for="(item, index) in editButtons" :key="index">
        <v-layout>
          <v-spacer></v-spacer>
          <v-tooltip left>
            <template v-slot:activator="{ on }">
              <v-btn
                class="edit-buttons mt-2"
                v-on="on"
                fab
                dark
                right
                x-small
                :color="
                  item.action === editType ? 'rgb(228, 76, 107)' : '#dc143c'
                "
                @click="edit(item.action)"
              >
                <v-icon medium>{{ item.icon }}</v-icon>
              </v-btn>
            </template>
            <span>{{ item.tooltip }}</span>
          </v-tooltip>
        </v-layout>
      </div>
    </div>

    <!-- SELECT LAYER DIALOG -->
    <v-dialog
      v-model="layersDialog"
      max-width="350"
      @keydown.esc="layersDialog = false"
    >
      <v-card>
        <v-app-bar flat color="#dc143c" height="50" dark>
          <v-icon class="mr-3">layers</v-icon>
          <v-toolbar-title>Select Layer</v-toolbar-title>
        </v-app-bar>

        <v-select
          class="mx-4 my-2"
          :items="
            map
              .getLayers()
              .getArray()
              .filter(
                l =>
                  ['VECTORTILE', 'VECTOR'].includes(l.get('type')) &&
                  l.get('name') &&
                  l.get('legendDisplayName')
              )
          "
          v-model="dialogSelectedLayer"
          return-object
          item-value="values_.name"
          label="Layers"
        >
          <template slot="selection" slot-scope="{ item }">
            {{ item.get('legendDisplayName') }}
          </template>
          <template slot="item" slot-scope="{ item }">
            {{ item.get('legendDisplayName') }}
          </template>
        </v-select>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary darken-1"
            text
            :disabled="!dialogSelectedLayer"
            @click.native="
              removeInteraction();
              selectedLayer = dialogSelectedLayer;
              layersDialog = false;
            "
            >Ok</v-btn
          >
          <v-btn color="#dc143c" text @click.native="layersDialog = false"
            >Cancel</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Popup overlay  -->
    <overlay-popup
      style="cursor: default;"
      :title="popup.title"
      v-show="popup.isVisible"
      ref="popup"
    >
      <v-btn icon>
        <v-icon>close</v-icon>
      </v-btn>
      <template v-slot:close>
        <v-btn @click="popupCancel()" icon>
          <v-icon>close</v-icon>
        </v-btn>
      </template>
      <template v-slot:body>
        <div v-if="editType === 'deleteFeature'">
          <b>Are you sure you want to delete the selected feature ?</b>
        </div>
        <div v-else-if="['addFeature', 'modifyAttributes'].includes(editType)">
          <vue-scroll ref="vs">
            <div style="max-height:280px;" class="pr-2">
              <v-form ref="edit-form" v-model="formValid">
                <v-jsf
                  v-model="formData"
                  :schema="formSchema"
                  :options="formOptions"
                />
              </v-form>
            </div>
          </vue-scroll>
        </div>
      </template>
      <template v-slot:actions>
        <template v-if="editType === 'deleteFeature'">
          <v-btn color="primary darken-1" @click="popupOk" text>Yes</v-btn>
          <v-btn color="grey" text @click="popupCancel">Cancel</v-btn>
        </template>
        <template
          v-else-if="['addFeature', 'modifyAttributes'].includes(editType)"
        >
          <v-btn
            color="primary darken-1"
            :disabled="formValid === false"
            @click="popupOk"
            text
            >Save</v-btn
          >

          <v-btn color="grey" text @click="popupCancel">Cancel</v-btn>
        </template>
      </template>
    </overlay-popup>
  </div>
</template>
<script>
import { Mapable } from '../../../../mixins/Mapable';

import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Feature from "ol/Feature";
import RenderFeature from 'ol/render/Feature';
import { LineString, MultiLineString, Polygon, MultiPolygon } from 'ol/geom';
import { Modify, Draw } from 'ol/interaction';
import { unByKey } from 'ol/Observable';
import Overlay from 'ol/Overlay.js';
import { mapFields } from 'vuex-map-fields';
import { mapGetters } from 'vuex';
import { getFeatureHighlightStyle } from '../../../../style/OlStyleDefs';
import OverlayPopup from './Overlay';
import axios from 'axios';
import { geojsonToFeature } from '../../../../utils/MapUtils';
import { wfsTransactionParser } from '../../../../utils/Layer';

import VJsf from '@koumoul/vjsf/lib/VJsf.js';
import '@koumoul/vjsf/lib/VJsf.css';
// load third-party dependencies (markdown-it, vuedraggable)
// you can also load them separately based on your needs
import '@koumoul/vjsf/lib/deps/third-party.js';

export default {
  components: {
    'overlay-popup': OverlayPopup,
    VJsf
  },
  mixins: [Mapable],
  props: {
    map: { type: Object, required: true }
  },
  data: () => ({
    editType: null,
    dialogSelectedLayer: null, // Temporary selection (not active if user doesn't press ok)
    selectedLayer: null,
    editButtons: [
      {
        icon: 'add',
        action: 'addFeature',
        tooltip: 'Add Feature'
      },
      {
        icon: 'edit',
        action: 'modifyFeature',
        tooltip: 'Modify Feature'
      },
      {
        icon: 'delete',
        action: 'deleteFeature',
        tooltip: 'Delete Feature'
      },
      {
        icon: 'subject',
        action: 'modifyAttributes',
        tooltip: 'Modify Attributes'
      }
    ],
    layersDialog: false,
    // INTERACTION
    currentInteraction: null,
    mapClickListener: null,
    pointerMoveKey: null,
    overlayersGarbageCollector: [],
    sketch: null,
    // Help tooltip data
    helpMessage: '',
    helpTooltipElement: null,
    helpTooltip: null,
    helpTooltipMessages: {
      delete: 'Click on the feature to delete. \nPress ESC to exit.',
      edit: 'Click on the feature and drag to move it. \nPress ESC to exit.',
      modifyAttributes:
        'Click on the feature to modify attributes. \nPress ESC to exit.',
      polygonAndLine: {
        start: 'Click to start drawing. \nPress ESC to exit.',
        continue: 'Click to continue drawing. \nPress ESC to exit.',
        close:
          'Click to add another point (double-click to finish) \nPress ESC to exit.'
      },
      point: {
        start: 'Click to place the point. \nPres ESC to exit.'
      }
    },
    // Popup
    popupOverlay: null,
    popup: {
      title: '',
      isVisible: false,
      el: null
    },
    // Dynamic form
    formValid: true,
    formOptions: {},
    formData: {},
    formTypesMapping: {
      string: 'string',
      int: 'integer',
      number: 'number'
    },
    formSchema: {
      type: 'object',
      required: [],
      properties: {}
    },
    formSchemaCache: {}
  }),
  name: 'edit-control',
  computed: {
    ...mapFields('map', {
      isEditing: 'isEditing'
    }),
    ...mapGetters('map', {
      layersMetadata: 'layersMetadata'
    })
  },
  methods: {
    onMapBound() {
      this.createLayers();
    },
    createLayers() {
      //-  create an edit vector layer
      const editLayerSource = new VectorSource({
        wrapX: false
      });
      const options = Object.assign(
        {},
        {
          name: 'edit_layer',
          isInteractive: false,
          queryable: false,
          zIndex: 2000,
          source: editLayerSource
        }
      );
      const editLayer = new VectorLayer(options);
      this.map.addLayer(editLayer);
      this.editLayer = editLayer;

      //- create highligh layer
      //Create highlight layer
      const highlightSource = new VectorSource({ wrapX: false });
      const highlightLayer = new VectorLayer({
        name: 'highlight_layer',
        isInteractive: false,
        queryable: false,
        zIndex: 2001,
        style: getFeatureHighlightStyle(),
        source: highlightSource
      });
      this.map.addLayer(highlightLayer);
      this.highlightLayer = highlightLayer;
    },
    createPopupOverlay() {
      this.popupOverlay = new Overlay({
        element: this.popup.el.$el,
        autoPan: true,
        autoPanMargin: 40,
        autoPanAnimation: {
          duration: 250
        }
      });
      this.map.addOverlay(this.popupOverlay);
      this.overlayersGarbageCollector.push(this.popupOverlay);
    },
    createHelpTooltip() {
      if (this.helpTooltipElement) {
        this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
      }
      this.helpTooltipElement = document.createElement('div');
      this.helpTooltipElement.className = 'edit-tooltip';
      this.helpTooltip = new Overlay({
        element: this.helpTooltipElement,
        offset: [15, 15],
        positioning: 'top-left',
        stopEvent: true,
        insertFirst: false
      });
      this.map.addOverlay(this.helpTooltip);
      this.overlayersGarbageCollector.push(this.helpTooltip);
    },
    clearOverlays() {
      if (this.overlayersGarbageCollector) {
        this.overlayersGarbageCollector.forEach(overlay => {
          this.map.removeOverlay(overlay);
        });
        this.overlayersGarbageCollector = [];
      }
    },
    /**
     * Main Edit function
     */
    edit(editType) {
      this.removeInteraction();
      this.editType = editType;
      if (!this.selectedLayer) return;
      const layerName = this.selectedLayer.get('name');
      const layerMetadata = this.layersMetadata[layerName];
      this.createSchemaFromLayerMetadata(); // Used for dynamic form rendering
      let geometryType;
      if (layerMetadata) {
        geometryType = layerMetadata[0].localType;
      }
      if (!geometryType) return;
      this.createHelpTooltip();
      this.pointerMoveKey = this.map.on('pointermove', this.onPointerMove);
      this.createPopupOverlay();
      this.isEditing = true;
      switch (editType) {
        case 'addFeature': {
          this.currentInteraction = new Draw({
            source: this.editLayer.getSource(),
            type: geometryType,
            geometryName: 'geom'
          });
          this.currentInteraction.on('drawstart', this.onDrawStart);
          this.currentInteraction.on('drawend', this.onDrawEnd);
          this.helpMessage = ['Point'].some(r => geometryType.includes(r))
            ? this.helpTooltipMessages.point.start
            : this.helpTooltipMessages.polygonAndLine.start;
          break;
        }
        case 'modifyFeature': {
          this.currentInteraction = new Modify({
            source:
              this.selectedLayer.get('type') === 'VECTORTILE'
                ? this.editLayer.getSource()
                : this.selectedLayer.getSource()
          });
          this.currentInteraction.on('modifystart', this.onModifyStart);
          this.currentInteraction.on('modifyend', this.onModifyEnd);
          this.helpMessage = this.helpTooltipMessages.edit;
          break;
        }
        case 'deleteFeature': {
          this.mapClickListener = this.map.on('click', this.openPopup);
          this.helpMessage = this.helpTooltipMessages.delete;
          break;
        }
        case 'modifyAttributes': {
          this.mapClickListener = this.map.on('click', this.openPopup);
          this.helpMessage = this.helpTooltipMessages.modifyAttributes;
          break;
        }
        default:
          break;
      }
      if (this.currentInteraction) {
        this.map.addInteraction(this.currentInteraction);
      }
    },
    /**
     * Transforms layer metadata into a json structure which can be used to render dynamic vuetify components
     */
    createSchemaFromLayerMetadata() {
      const layerName = this.selectedLayer.get('name');
      if (!this.formSchemaCache[layerName]) {
        const layerMetadata = this.layersMetadata[layerName];
        if (layerMetadata) {
          layerMetadata.forEach(property => {
            const type = this.formTypesMapping[property.localType];
            if (type) {
              this.formSchema.properties[property.name] = {
                type,
                title: property.name
              };
              if (property.nillable === false) {
                this.formSchema.required.push(property.name);
              }
              if (property.name === 'geom') {
                this.formSchema[property.name]['x-display'] = 'hidden';
              }
            }
          });
        }
      }
    },

    /**
     * Draw event
     */
    onDrawStart(evt) {
      this.sketch = evt.feature;
    },
    onDrawEnd(evt) {
      const feature = evt.feature;
      this.selectedFeature = feature;
      this.closePopup();
      if (this.currentInteraction) {
        this.currentInteraction.setActive(false);
      }
      this.highlightLayer.getSource().addFeature(feature.clone());
      let popupCoordinate = feature.getGeometry().getCoordinates();
      while (popupCoordinate && Array.isArray(popupCoordinate[0])) {
        popupCoordinate = popupCoordinate[0];
      }
      this.map.getView().animate({
        center: popupCoordinate,
        duration: 400
      });
      this.popupOverlay.setPosition(popupCoordinate);
      this.popup.title = 'Attributes';
      this.popup.isVisible = true;
      this.sketch = null;
    },

    /**
     * Modify event
     */
    onModifyStart() {
      this.selectedFeature = null;

    },
    onModifyEnd(evt) {
      console.log(evt);
    },

    /**
     * Modify attributes
     */
    async openPopup(evt) {
      // Get feature attributes popup
      this.highlightLayer.getSource().clear();
      const selectedLayer = this.selectedLayer;
      if (['VECTOR', 'VECTORTILE'].includes(this.selectedLayer.get('type'))) {
        const features = this.map.getFeaturesAtPixel(evt.pixel, {
          layerFilter: layerCandidate => {
            return layerCandidate.get('name') === selectedLayer.get('name');
          },
          hitTolerance: 3
        });
        if (features.length > 0) {
          let feature = features[0];
          // Workaround for vector tile layers.
          if (feature instanceof RenderFeature) {
            const urls = selectedLayer.getSource().getUrls()[0];
            const url = urls.match('tms/1.0.0/(.*)@EPSG');
            if (!urls.includes('geoserver')) return;
            if (!Array.isArray(url) || url.length < 2) return;
            const geoserverLayerName = url[1];
            const response = await axios.get('./geoserver/wfs', {
              params: {
                service: 'WFS',
                version: ' 2.0.0',
                request: 'GetFeature',
                outputFormat: 'application/json',
                srsName: 'EPSG:3857',
                typeNames: geoserverLayerName,
                featureId: feature.getId()
              }
            });
            if (response.data.features) {
              const olFeatures = geojsonToFeature(response.data, {});
              feature = olFeatures[0];
            }
          }
          if (feature) {
            this.selectedFeature = feature;
            this.highlightLayer.getSource().addFeature(feature.clone());
            let popupCoordinate = feature.getGeometry().getCoordinates();
            let closestPoint;
            if (popupCoordinate) {
              closestPoint = feature
                .getGeometry()
                .getClosestPoint(evt.coordinate);
            } else {
              closestPoint = evt.coordinate;
            }
            this.map.getView().animate({
              center: closestPoint,
              duration: 400
            });
            this.popupOverlay.setPosition(closestPoint);
            this.popup.isVisible = true;
            if (this.editType === 'deleteFeature') {
              this.popup.title = 'Confirm';
            } else if (this.editType === 'modifyAttributes') {
              this.popup.title = 'Modify Attributes';
              this.formData = feature.getProperties();
            }
          }
        }
      }
    },

    /**
     * Popup action buttons
     */
    popupOk() {
      if (this.editType === 'deleteFeature') {
        //TODO: Commit delete in the server
        //Remove feature from the source
        if (this.selectedFeature) {
          this.selectedLayer.getSource().removeFeature(this.selectedFeature);
        }
      } else if (
        ['addFeature', 'modifyAttributes'].includes(this.editType) &&
        this.selectedFeature
      ) {
        // Get properties and assign it to feature
        this.selectedFeature.setProperties(this.formData);
      }
      // Commit change in db
      this.transact();
      // Close popup and clear previous interactions.
      this.popupCancel();
    },
    popupCancel() {
      if (this.popupOverlay) {
        this.popupOverlay.setPosition(undefined);
        this.popup.isVisible = false;
      }
      if (this.currentInteraction) {
        this.currentInteraction.setActive(true);
      }
      this.highlightLayer.getSource().clear();
    },

    /**
     * Pointermove for tooltip
     */
    onPointerMove(evt) {
      //Hide helptooltip if mouse is over popoverlay
      if (this.popupOverlay && this.popupOverlay.getPosition() !== undefined) {
        this.helpTooltip.setPosition(undefined);
        return;
      }

      const coordinate = evt.coordinate;
      if (this.sketch) {
        const geom = this.sketch.getGeometry();
        if (
          geom instanceof Polygon ||
          geom instanceof MultiPolygon ||
          geom instanceof LineString ||
          geom instanceof MultiLineString
        ) {
          this.helpMessage = this.helpTooltipMessages.polygonAndLine.continue;
          if (geom.getCoordinates && geom.getCoordinates().length > 2) {
            this.helpMessage = this.helpTooltipMessages.polygonAndLine.close;
          }
        }
      }
      this.helpTooltipElement.innerHTML = this.helpMessage;
      this.helpTooltip.setPosition(coordinate);
      this.map.getTarget().style.cursor = 'pointer';
    },

    /**
     * UI BUTTON EVENTS
     */
    activateEdit() {
      this.layersDialog = true;
    },
    changeLayer() {
      this.layersDialog = true;
    },

    /**
     * CLOSE/CLEAR METHODS
     */
    closeEdit() {
      this.selectedLayer = null;
      this.dialogSelectedLayer = null;
      this.layersDialog = false;
      this.removeInteraction();
    },

    removeInteraction() {
      this.editLayer.getSource().clear();
      this.highlightLayer.getSource().clear();
      this.selectedFeature = null;
      this.isEditing = false;
      this.editType = null;
      this.formData = {};
      this.clearOverlays();
      if (this.currentInteraction) {
        this.map.removeInteraction(this.currentInteraction);
        this.currentInteraction = null;
      }
      if (this.mapClickListener) {
        unByKey(this.mapClickListener);
      }
      if (this.pointerMoveKey) {
        unByKey(this.pointerMoveKey);
      }
    },
    closePopup() {
      if (this.popupOverlay) {
        this.popupOverlay.setPosition(undefined);
        this.popup.isVisible = false;
      }
      if (this.currentInteraction) {
        this.currentInteraction.setActive(true);
      }
      this.highlightLayer.getSource().clear();
      this.editLayer.getSource().clear();
    },

    /**
     * TRANSACT METHOD (GEOSERVER WFS-T)
     */
    transact() {
      if (!this.selectedFeature) {
        return;
      }
      const formatGML = {
        featureNS: 'petropolis',
        featureType: this.selectedLayer.get('name'),
        srsName: 'urn:x-ogc:def:crs:EPSG:4326'
      };
      const interactionType = this.editType;
      const {
        // eslint-disable-next-line no-unused-vars
        geometry,
        // eslint-disable-next-line no-unused-vars
        geom,
        ...propsWithNoGeometry
      } = this.selectedFeature.getProperties();

      const feature = new Feature({
        geom: this.selectedFeature.getGeometry().clone(),
        ...propsWithNoGeometry
      });
      feature.setGeometryName('geom');
      feature.getGeometry().transform('EPSG:3857', 'EPSG:4326');
      feature.setId(this.selectedFeature.getId());

      let payload;
      console.log(interactionType, feature);
      switch (this.editType) {
        case 'addFeature': {
          payload = wfsTransactionParser([feature], null, null, formatGML);
          break;
        }
        case 'modifyAttributes':
        case 'modifyFeature': {
          payload = wfsTransactionParser(null, [feature], null, formatGML);
          break;
        }
        case 'deleteFeature': {
          payload = wfsTransactionParser(null, null, [feature], formatGML);
          break;
        }
        default:
          break;
      }
      payload = new XMLSerializer().serializeToString(payload);
      axios
        .post('geoserver/petropolis/wfs', payload, {
          headers: { 'Content-Type': 'text/xml' }
        })
        .then(response => {
          console.log(response);
          this.editLayer.getSource().clear();
          if (this.selectedLayer && this.selectedLayer.getSource().refresh) {
            if (this.selectedLayer.get('type') === 'VECTOR') {
              this.selectedLayer.getSource().refresh();
            } else if (this.selectedLayer.get('type') === 'VECTORTILE') {
              this.selectedLayer.getSource().tileCache.expireCache({});
              this.selectedLayer.getSource().clear();
              this.selectedLayer.getSource().tileCache.clear();
              this.selectedLayer.getSource().refresh();
            }
          }
        });
    }
  },
  mounted() {
    /**
     * Reference popup element
     */
    this.popup.el = this.$refs.popup;
    /**
     * Create event listener for escape key
     */
    document.onkeyup = null;
    document.onkeyup = evt => {
      const key = evt.key;
      const code = evt.keyCode;
      if (key === 'Escape' || code === '27') {
        if (this.removeInteraction) {
          this.removeInteraction();
        }
      }
    };
  },
  watch: {
    $route() {
      this.closeEdit();
    }
  }
};
</script>
<style lang="css" scoped>
.edit-buttons {
  z-index: 1;
}
</style>
