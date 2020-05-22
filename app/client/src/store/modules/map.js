import { getField, updateField } from 'vuex-map-fields';
import { humanize } from '../../utils/Helpers';

const state = {
  map: null,
  messages: {
    snackbar: {
      type: 'info',
      message: '',
      state: false,
      timeout: 2000
    }
  },
  popup: {
    title: 'Info',
    isVisible: false,
    activeFeature: null,
    activeLayer: null,
    hiddenProps: ['category', 'BPD', 'variable1', 'variable2', 'ImageUrl'],
    exludedProps: [
      'id',
      'geometry',
      'geom',
      'orgin_geometry',
      'osm_id',
      'gid',
      'layerName'
    ],
    diveVisibleProps: ['title', 'entitiy'],
    showInSidePanel: false
  },
  layers: {}, // Only for operational layers
  activeLayerGroup: null
};

const getters = {
  map: state => state.map,
  layers: state => state.layers,
  messages: state => state.messages,
  snackbar: state => state.messages.snackbar,
  activeLayerGroup: state => state.activeLayerGroup,
  popup: state => state.popup,
  popupInfo: state => {
    const feature = state.popup.activeFeature;
    if (!feature) return;
    const props = feature.getProperties();
    let transformed = [];
    const excludedProperties = state.popup.exludedProps
    Object.keys(props).forEach(k => {
      if (!excludedProperties.includes(k) && !typeof k !== 'object') {
        transformed.push({
          humanizedProperty: humanize(k),
          property: k,
          value: !props[k] ? '---' : props[k]
        });
      }
    });

    return transformed;
  },
  getField
};

const actions = {};

const mutations = {
  TOGGLE_SNACKBAR(state, payload) {
    Object.assign(state.messages.snackbar, payload);
  },
  SET_LAYER(state, layer) {
    if (layer.get('name')) {
      if (!state.layers[layer.get('name')]) {
        state.map.addLayer(layer);
      }
      state.layers[layer.get('name')] = layer;
    }
  },
  SET_MAP(state, map) {
    state.map = map;
  },
  SET_ACTIVE_LAYERGROUP(state, activeLayerGroup) {
    state.activeLayerGroup = activeLayerGroup;
  },
  REMOVE_ALL_LAYERS(state) {
    const layers = [...state.map.getLayers().getArray()];
    layers.forEach(layer => state.map.removeLayer(layer));
    state.layers = {};
  },
  updateField
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
