import { getField, updateField } from 'vuex-map-fields';
import { formatPopupRows } from '../../utils/Layer';
let colormap = require('colormap');

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
    worldExtentLayer: null,
    highlightVectorTileLayer: null,
    selectedCorpNetworkLayer: null,
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
  activeLayerGroup: null,
  gasFieldEntitiesColors: {}, // Fetched from geoserver
  geoserverLayerNames: null, // Created when user clicks coorporate network,
  layersWithEntityField: null, // Fetched from Geoserver on load
  selectedCoorpNetworkEntity: null // Selected entity
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
    return formatPopupRows(feature, state.popup.exludedProps);
  },
  splittedEntities: state => {
    if (state.selectedCoorpNetworkEntity) {
       let splittedString = state.selectedCoorpNetworkEntity.split(',').map(str => {
         if (str.charAt(0) === ' ') {
           str = str.slice(1);
         }
         str = str
           .split(' ')
           .slice(0, 2)
           .join(' ');
         return str;
       });
       return splittedString
    } else {
      return null
    }
  },
  getField
};

const actions = {
  fetchGasPipesEntities({ commit, rootState }) {
    // eslint-disable-next-line no-undef
    if (!rootState.map.gasFieldEntitiesColors) {
      return;
    }
    fetch(
      './geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=petropolis:select_gas_pipes_entities&srsname=EPSG:4326&outputFormat=json'
    )
      .then(function(response) {
        if (response.status !== 200) {
          console.log(
            'Looks like there was a problem. Status Code: ' + response.status
          );
          return;
        }

        // Examine the text in the response
        response.json().then(function(data) {
          // Make app config accessible for all components
          if (data.features.length < 1) return;

          const entities = {};
          const colors = colormap({
            colormap: 'portland',
            nshades: data.features.length,
            format: 'hex',
            alpha: 1
          });
          data.features.forEach((feature, index) => {
            const entity = feature.properties.Operator;
            entities[entity] = colors[index]
          });
          commit('SET_GAS_FIELD_ENTITIES', entities);
        });
      })
      .catch(function(err) {
        console.log('Fetch Error :-S', err);
      });
  }
};

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
  SET_GAS_FIELD_ENTITIES(state, entities) {
    state.gasFieldEntitiesColors = entities;
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
