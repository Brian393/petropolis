import { getField, updateField } from 'vuex-map-fields';

const state = {
  asideHidden: false,
  sidebarHtml: {},
  postIcons: []
};

// mutations are operations that actually mutates the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = {
  toggle(state) {
    // console.log('store toggle!!')
    state.asideHidden = !state.asideHidden;
  },

  updateField
};

const actions = {
  toggle(context) {
    context.commit('toggle');
  }
};

// getters are functions
const getters = {
  asideHidden: state => state.asideHidden,
  sidebarHtml: state => state.sidebarHtml,
  postIcons: state => state.postIcons,
  getField
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
