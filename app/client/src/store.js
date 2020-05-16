import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// root state object.
// each Vuex instance is just a single state tree.
const state = {
  asideHidden: false
}

// mutations are operations that actually mutates the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = {
  toggle (state) {
    // console.log('store toggle!!')
    state.asideHidden = !state.asideHidden
  }
}

const actions = {
  toggle (context) {
    context.commit('toggle')
  }
}

// getters are functions
const getters = {
  asideHidden: state => state.asideHidden
}

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
