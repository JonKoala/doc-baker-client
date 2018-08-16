import Vue from 'vue'
import Vuex from 'vuex'

import projeto from './projeto'
import workflow from './workflow'


Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    projeto,
    workflow
  }
})
