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
              .filter(l => ['VECTORTILE', 'VECTOR'].includes(l.get('type')))
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
import { Modify, Draw } from 'ol/interaction';
import { unByKey } from 'ol/Observable';
import Overlay from 'ol/Overlay.js';
import { mapFields } from 'vuex-map-fields';
import { mapGetters } from 'vuex';
import { getFeatureHighlightStyle } from '../../../../style/OlStyleDefs';
import OverlayPopup from './Overlay';

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
    helpMessage: '',
    helpTooltipElement: null,
    helpTooltip: null,
    overlayersGarbageCollector: [],
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
      properties: {
     
      }
    },
    formSchemaCache: {

    }
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
      this.createSchemaFromLayerMetadata() // Used for dynamic form rendering
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
            type: geometryType
          });
          this.currentInteraction.on('drawstart', this.onDrawStart);
          this.currentInteraction.on('drawend', this.onDrawEnd);
          this.helpMessage = ['Point'].some(r => geometryType.includes(r))
            ? 'Click to place point'
            : 'Click to start drawing';
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
          this.helpMessage = 'Click and drag to modify';
          break;
        }
        case 'deleteFeature': {
          this.mapClickListener = this.map.on('click', this.openDeletePopup);
          this.helpMessage = 'Click on feature to delete';
          break;
        }
        case 'modifyAttributes': {
          this.mapClickListener = this.map.on(
            'click',
            this.openModifyAttributesPopup
          );
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
      const layerName = this.selectedLayer.get('name')
      if (!this.formSchemaCache[layerName]) {
        const layerMetadata = this.layersMetadata[layerName];
        console.log(layerMetadata)
        if (layerMetadata) {
          layerMetadata.forEach(property => {
            const type = this.formTypesMapping[property.localType];
            if (type) {
              this.formSchema.properties[property.name] = {
                type,
                title: property.name
              }
              if (property.nillable === false) {
                this.formSchema.required.push(property.name);
              }
              if (property.name === 'geom') {
                this.formSchema[property.name]["x-display"] = "hidden";
              }
            }
          });
        }
      }
    },

    /**
     * Draw event
     */
    onDrawStart() {},
    onDrawEnd(evt) {
      const feature = evt.feature;
      this.closePopup();
      if (this.currentInteraction) {
        this.currentInteraction.setActive(false);
      }
      this.highlightLayer.getSource().addFeature(feature);
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
    },

    /**
     * Modify event
     */
    onModifyStart() {},
    onModifyEnd() {},

    /**
     * Delete
     */
    openDeletePopup(evt) {
      let feature;
      this.highlightLayer.getSource().clear();
      if (evt.coordinate) {
        const coordinate = evt.coordinate;
        feature = this.selectedLayer
          .getSource()
          .getClosestFeatureToCoordinate(coordinate);
      } else {
        this.createPopupOverlay();
        feature = evt;
      }
      this.highlightLayer.getSource().addFeature(feature);
      if (feature) {
        let popupCoordinate = feature.getGeometry().getCoordinates();
        let closestPoint;
        // Closest point doesn't work with vector tile layers.
        if (popupCoordinate) {
          closestPoint = feature.getGeometry().getClosestPoint(evt.coordinate);
        } else {
          closestPoint = evt.coordinate;
        }
        this.map.getView().animate({
          center: closestPoint,
          duration: 400
        });
        this.popupOverlay.setPosition(closestPoint);
        this.popup.title = 'Confirm';
        this.popup.isVisible = true;
      }
    },

    /**
     * Popup action buttons
     */
    popupOk() {
      if (this.editType === 'deleteFeature') {
        console.log('commit feature delete...');
      }
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
     * Modify attributes
     */
    openModifyAttributesPopup() {},

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
      this.isEditing = false;
      this.editType = null;
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
    }
  },
  mounted() {
    /**
     * Reference popup element
     */
    this.popup.el = this.$refs.popup;
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
