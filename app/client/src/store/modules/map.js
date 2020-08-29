import { getField, updateField } from 'vuex-map-fields';
import {
  formatPopupRows,
  getLayerSourceUrl,
  extractGeoserverLayerNames
} from '../../utils/Layer';
import http from '../../services/http';
import axios from 'axios';
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
  colorMapEntities: {}, // Fetched from geoserver
  geoserverLayerNames: null, // Created when user clicks corporate network,
  layersWithEntityField: null, // Fetched from Geoserver on load
  selectedCoorpNetworkEntity: null, // Selected entity,
  fuelGroups: [
    {
      name: 'coal',
      title: 'Coal & Ash'
    },
    {
      name: 'oil',
      title: 'Oil & Gas'
    },
    {
      name: 'renewables',
      title: 'Wind & Solar'
    }
  ],
  regions: [
    {
      name: 'local',
      title: 'Local'
    },
    {
      name: 'global',
      title: 'Global'
    }
  ],
  previousMapPosition: null,
  previousMapPositionSearch: null
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
      let splittedString = state.selectedCoorpNetworkEntity
        .split(',')
        .map(str => {
          if (str.charAt(0) === ' ') {
            str = str.slice(1);
          }
          str = str
            .split(' ')
            .slice(0, 2)
            .join(' ');
          return str;
        });
      return splittedString;
    } else {
      return null;
    }
  },
  fuelGroups: state => state.fuelGroups,
  regions: state => state.regions,
  getField
};

const actions = {
  fetchColorMapEntities({ commit, rootState }) {
    // eslint-disable-next-line no-undef
    if (!rootState.map.colorMapEntities) {
      return;
    }
    const layers = rootState.map.layers;
    const promiseArray = [];
    Object.keys(layers).forEach(function(key) {
      const layer = layers[key];
      if (layer.get('styleObj')) {
        const styleObj = JSON.parse(layer.get('styleObj'));
        if (
          styleObj.styleRef !== 'colorMapStyle' ||
          rootState.map.colorMapEntities[layer.get('name')]
        )
          return;

        const tableName =
          styleObj.tableName ||
          extractGeoserverLayerNames([
            { url: getLayerSourceUrl(layer.getSource()) }
          ])['petropolis'][0];
        let viewParams = `viewparams=table:${tableName}`;
        if (styleObj.colorField) {
          viewParams += `;field:${styleObj.colorField}`
        }
        const url = `./geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=petropolis:colormap&srsname=EPSG:4326&${viewParams}&outputFormat=json`;
        promiseArray.push(
          http.get(url, {
            data: { layerName: layer.get('name'), colormap: styleObj.colormap || 'portland' }
          })
        );
      }
    });
    if (promiseArray.length > 0) {
      axios
        .all(promiseArray)
        .then(function(results) {
          results.forEach(response => {
            const features = response.data.features;
            const configData = JSON.parse(response.config.data)
            const layerName = configData.layerName;
            if (features && features.length === 0) {
              return;
            }
            const nshades = features.length < 5 ? 5 : features.length; // 5 is the minimun of the shades
            const entities = {};
            console.log(configData.colormap)
            const colors = colormap({
              colormap: configData.colormap,
              nshades: nshades,
              format: 'hex',
              alpha: 1
            });
            features.forEach((feature, index) => {
              const entity = feature.properties.entity;
              entities[entity] = colors[index];
            });
            commit('SET_COLORMAP_VALUES', { layerName, entities });
          });
        })
        .catch(function(err) {
          console.log('Fetch Error :-S', err);
        });
    }
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
  SET_COLORMAP_VALUES(state, payload) {
    state.colorMapEntities[payload.layerName] = payload.entities;
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
