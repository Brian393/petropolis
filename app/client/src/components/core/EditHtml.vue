<template>
  <v-card width="100%">
    <v-list v-show="postFeature && !postFeature.get('icon')">
      <v-list-item
        v-for="icon in postIcons"
        :key="icon.title"
        @click="openHtmlEditor(icon)"
      >
        <v-list-item-avatar>
          <v-img :src="icon.iconUrl"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-text="icon.title"></v-list-item-title>
        </v-list-item-content>

        <v-list-item-icon>
          <v-icon>chevron_right</v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
    <div
      v-if="
        (isEditingPost && postFeature && postFeature.get('icon')) ||
          isEditingHtml
      "
    >
      <v-toolbar v-if="postFeature && postFeature.get('icon')">
        <v-avatar v-if="postFeature && postFeature.get('icon')" class="mr-3">
          <v-img contain :src="postFeature.get('icon')"></v-img>
        </v-avatar>
        <v-toolbar-title class="h6">{{ postIconTitle }}</v-toolbar-title>
      </v-toolbar>

      <v-layout justify-space-between column fill-height>
        <tip-tap-editor
          v-if="postFeature || isEditingHtml"
          class="mx-1 mt-1"
        ></tip-tap-editor>
      </v-layout>
      <v-row>
        <v-spacer></v-spacer>
        <v-btn class="mt-2 mr-2" @click="cancel" text>
          Cancel
        </v-btn>
        <v-btn
          :disabled="!postFeature && isEditingPost"
          class="mt-2 mr-5"
          @click="save"
          text
          color="primary"
          >Save</v-btn
        >
      </v-row>
    </div>
  </v-card>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { mapFields } from 'vuex-map-fields';

import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import TipTapEditor from './TipTapEditor';
import { Mapable } from '../../mixins/Mapable';
import { unByKey } from 'ol/Observable';
import Overlay from 'ol/Overlay.js';
import { postEditLayerStyle } from '../../style/OlStyleDefs';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import axios from 'axios';
import authHeader from '../../services/auth-header';
import GeoJSON from 'ol/format/GeoJSON';
import { EventBus } from '../../EventBus';
import { addProps } from '../../utils/Helpers';

export default {
  mixins: [Mapable],
  components: {
    'tip-tap-editor': TipTapEditor
  },
  data() {
    return {
      postFeature: null,
      mapClickKey: null,
      pointerMoveKey: null,
      editType: null,
      // Help tooltip data
      helpMessage: '',
      helpTooltipElement: null,
      helpTooltip: null,
      postSnackbarMessages: {
        update: 'Post updated successfully!',
        delete: 'Post delete successfully!',
        insert: 'Post added successfully!'
      },
      overlayersGarbageCollector: []
    };
  },
  created() {
    EventBus.$on('deletePost', feature => {
      let clonedFeature;
      let fId = feature.getId();
      if (fId.includes('clone.')) {
        fId = fId.split('clone.')[1];
      }
      clonedFeature = feature.clone();
      clonedFeature.setId(fId);
      this.postEditLayer.getSource().addFeature(clonedFeature);
      this.transactPost('delete');
    });
    EventBus.$on('editPost', feature => {
      let clonedFeature;
      let fId = feature.getId();
      if (fId.includes('clone.')) {
        fId = fId.split('clone.')[1];
      }
      clonedFeature = feature.clone();
      clonedFeature.setId(fId);
      this.postEditLayer.getSource().addFeature(clonedFeature);
      this.htmlContent = feature.get('html');
      this.postFeature = clonedFeature;
      this.editType = 'update';
      this.isEditingPost = true;
    });
    EventBus.$on('editHtml', html => {
      this.htmlContent = html;
      this.isEditingHtml = true;
    });
    EventBus.$on('clearEditHtml', this.cancel);
  },
  methods: {
    onMapBound() {
      this.createEditPostLayer();
    },
    openHtmlEditor(icon) {
      if (this.postFeature) {
        this.postFeature.set('icon', icon.iconUrl);
      }
      this.editType = 'insert';
    },
    save() {
      if (this.isEditingPost) {
        this.transactPost(this.editType);
      } else {
        if (this.lastSelectedLayer) {
          this.transactHtml('layer');
        } else {
          this.transactHtml('group');
        }
      }
    },
    cancel() {
      this.postEditLayer.getSource().clear();
      this.lastSelectedLayer = null;
      this.postFeature = null;
      this.isEditingPost = false;
      this.isEditingHtml = false;
    },
    createEditPostLayer() {
      //-  create an edit vector layer
      const postEditLayerSource = new VectorSource({
        wrapX: false
      });
      const options = Object.assign(
        {},
        {
          name: 'post_edit_layer',
          isInteractive: false,
          queryable: false,
          zIndex: 2001,
          source: postEditLayerSource,
          style: postEditLayerStyle
        }
      );
      const postEditLayer = new VectorLayer(options);
      this.map.addLayer(postEditLayer);
      this.postEditLayer = postEditLayer;
    },
    startInteraction() {
      this.createHelpTooltip();
      this.pointerMoveKey = this.map.on('pointermove', this.onPointerMove);
      this.mapClickKey = this.map.once('click', this.onMapClick);
      this.helpMessage = 'Click to place point!';
    },
    onPointerMove(evt) {
      const coordinate = evt.coordinate;
      this.helpTooltipElement.innerHTML = this.helpMessage;
      this.helpTooltip.setPosition(coordinate);
      this.map.getTarget().style.cursor = 'pointer';
    },
    onMapClick(evt) {
      const feature = new Feature({
        geom: new Point(evt.coordinate),
        icon: ''
      });
      this.toggleSnackbar({ state: false });
      unByKey(this.pointerMoveKey);
      this.clearOverlays();
      feature.setGeometryName('geom');
      this.postEditLayer.getSource().clear();
      this.postEditLayer.getSource().addFeature(feature);
      this.postFeature = feature;
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

    closeInteraction() {
      this.postEditLayer.getSource().clear();
      this.postFeature = null;
      this.htmlContent = '';
      if (this.mapClickKey) {
        unByKey(this.mapClickKey);
      }
      if (this.pointerMoveKey) {
        unByKey(this.pointerMoveKey);
      }
      this.clearOverlays();
    },
    ...mapMutations('map', {
      toggleSnackbar: 'TOGGLE_SNACKBAR'
    }),
    transactPost(type) {
      const feature = this.postEditLayer.getSource().getFeatures()[0];
      console.log(feature);
      const payload = {
        type: type,
        srid: '4326',
        table: 'html_posts',
        geometry: new GeoJSON().writeGeometryObject(
          feature
            .getGeometry()
            .clone()
            .transform('EPSG:3857', 'EPSG:4326')
        ),
        featureId: feature.getId(),
        properties: {}
      };
      if (type !== 'delete') {
        payload.properties = {
          icon: this.postFeature.get('icon'),
          html: this.htmlContent,
          createdBy: null // The value is added from the api.
        };
      }
      const formData = new FormData();
      formData.append('payload', JSON.stringify(payload));
      axios
        .post('api/layer', formData, {
          headers: authHeader()
        })
        .then(() => {
          this.cancel();
          setTimeout(() => {
            EventBus.$emit('closePopupInfo');
            this.toggleSnackbar({
              type: 'success',
              message: this.postSnackbarMessages[type],
              timeout: 2000,
              state: true
            });
          }, 50);
          this.persistentLayers['html_posts'].getSource().refresh();
        });
    },
    transactHtml(type) {
      let req;
      if (type === 'layer') {
        const payload = {
          type: 'layer',
          name: this.lastSelectedLayer,
          html: this.htmlContent
        };
        if (this.sidebarHtml.layers[this.lastSelectedLayer]) {
          req = axios.patch('api/html', payload, {
            headers: authHeader()
          });
        } else {
          req = axios.post('api/html', payload, {
            headers: authHeader()
          });
        }
      } else {
        const payload = {
          type: 'group',
          name: this.groupName,
          html: this.htmlContent
        };
        if (this.sidebarHtml.groups[this.groupName]) {
          req = axios.patch('api/html', payload, {
            headers: authHeader()
          });
        } else {
          req = axios.post('api/html', payload, {
            headers: authHeader()
          });
        }
      }
      req.then(() => {
        setTimeout(() => {
          this.toggleSnackbar({
            type: 'success',
            message: 'Updated successfully!',
            timeout: 2000,
            state: true
          });
          if (this.type === 'layer') {
            const layers = this.sidebarHtml.layers;
            addProps(layers, `${this.lastSelectedLayer}.type`, 'layer');
            addProps(
              layers,
              `${this.lastSelectedLayer}.html`,
              this.htmlContent
            );
          } else {
            const groups = this.sidebarHtml.groups;
            addProps(groups, `${this.groupName}.type`, 'group');
            addProps(groups, `${this.groupName}.html`, this.htmlContent);
          }
          // Clear.
          EventBus.$emit('closePopupInfo');
          this.cancel();
        }, 50);
      });
    }
  },
  computed: {
    ...mapGetters('app', {
      sidebarHtml: 'sidebarHtml',
      postIcons: 'postIcons'
    }),
    ...mapFields('map', {
      popup: 'popup',
      htmlContent: 'htmlContent',
      isEditingPost: 'isEditingPost',
      isEditingHtml: 'isEditingHtml',
      postEditLayer: 'postEditLayer',
      lastSelectedLayer: 'lastSelectedLayer'
    }),
    ...mapGetters('map', {
      persistentLayers: 'persistentLayers',
      groupName: 'groupName'
    }),
    postIconTitle() {
      if (this.postFeature && this.postFeature.get('icon')) {
        const icon = this.postIcons.filter(
          i => (i.iconUrl = this.postFeature.get('icon'))
        );
        return icon.length > 0 ? icon[0].title : '';
      }
      return '';
    }
  },
  watch: {
    isEditingPost(value) {
      if (value === true) {
        if (this.editType !== 'update') {
          this.toggleSnackbar({
            type: '#dc143c',
            message: 'Zoom in close and click to add your post',
            timeout: 50000,
            state: true
          });
          this.startInteraction();
        }
      } else {
        this.editType = null;
        this.toggleSnackbar({
          state: false
        });
        this.closeInteraction();
      }
    }
  }
};
</script>

<style></style>
