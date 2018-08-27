import Vue from 'vue'
import Vuex from 'vuex'

import processo from './models/processo'
import workflow from './models/workflow'

import home from './views/home'
import { NAMESPACE as homeNamespace } from './views/home.type'


Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    processo,
    workflow,

    [homeNamespace]: home
  }
})
