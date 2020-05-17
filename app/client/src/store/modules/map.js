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
  layers: {} // Only for operational layers
}

const getters = {
  map: state => state.map,
  layers: state => state.layers,
  messages: state => state.messages,
  snackbar: state => state.messages.snackbar
}

const actions = {}

const mutations = {
  TOGGLE_SNACKBAR(state, payload) {
    Object.assign(state.messages.snackbar, payload)
  },
  SET_LAYER(state, layer) {
    if (layer.get('name')) {
      state.layers[layer.get('name')] = layer
    }
  },
  SET_MAP(state, map) {
    state.map = map
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
