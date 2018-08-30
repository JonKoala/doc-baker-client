import Vue from 'vue'
import Vuex from 'vuex'

import home from 'store/modules/view.home'
import processoEdit from 'store/modules/view.processo.edit'
import processoNew from 'store/modules/view.processo.new'
import { VIEW_HOME, VIEW_PROCESSO_EDIT, VIEW_PROCESSO_NEW } from 'store/namespaces'


Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    [VIEW_HOME]: home,
    [VIEW_PROCESSO_EDIT]: processoEdit,
    [VIEW_PROCESSO_NEW]: processoNew
  }
})
