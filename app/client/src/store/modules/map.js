import { getField, updateField } from 'vuex-map-fields';
import { humanize } from '../../utils/Helpers';
import UrlUtil from '../../utils/Url';

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
    highlightLayer: null,
    highlightVectorTileLayer: null,
    popupOverlay: null,
    title: 'Info',
    isVisible: false,
    activeFeature: null,
    activeLayer: null,
    hiddenProps: ['BPD', 'variable1', 'variable2', 'imageUrl'],
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
    const { link1, link2, link3, source, ...rest } = props;
    console.log(props)
    if (UrlUtil.validURL(link1)) {
      rest[
        'COORPORATE WEBSITE'
      ] = `<a href='${link1}' target='_blank'>here</a>`;
    }
    if (UrlUtil.validURL(link2)) {
      let moreInformation = `<a href='${link2}' target='_blank'>here</a>`;
      if (UrlUtil.validURL(link3)) {
        moreInformation += ` and <a href='${link3}' target='_blank'>here</a>`;
      }
      rest['More information'] = moreInformation;
    }
    if (UrlUtil.validURL(source)){
      rest['SOURCE'] = `<a href='${source}' target='_blank'>here</a>`;
    }
    
    let transformed = [];
    const excludedProperties = state.popup.exludedProps;
    Object.keys(rest).forEach(k => {
      if (!excludedProperties.includes(k) && !typeof k !== 'object') {
        transformed.push({
          humanizedProperty: humanize(k),
          property: k,
          value: !rest[k] ? '---' : rest[k]
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
