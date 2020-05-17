import Vue from 'vue'
import Vuex from 'vuex'
import map from './modules/map'
import app from './modules/app'

Vue.use(Vuex)

// Create a new store
const store = new Vuex.Store({
  modules: { map, app }
})

export default store
