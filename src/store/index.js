import Vue from 'vue'
import Vuex from 'vuex'

import processo from './processo'
import workflow from './workflow'


Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    processo,
    workflow
  }
})
