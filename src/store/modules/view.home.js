import ApiService from 'services/api.service'

import workflow from 'store/modules/processo.workflow'

import { WORKFLOW } from 'store/namespaces'
import { END_LOADING, RESET_STATE, SET_ITEMS, SET_PROCESSO_ID, SET_SEARCH, SET_STEPS, START_LOADING } from 'store/mutation.types'
import { START, SELECT_PROCESSO } from 'store/action.types'


function getInitialState () {
  return {
    isLoading: false,
    items: [],
    processoId: null, // String
    search: null // String
  }
}
const state = getInitialState

const modules = {
  [WORKFLOW]: workflow
}

const getters = {

  isLoading (state) {
    return state.isLoading
  },
  items (state) {
    return state.items
  },
  processo (state, getters) {
    return {
      id: state.processoId,
      workflow: getters[`${WORKFLOW}/steps`]
    }
  },
  search (state) {
    return state.search
  }

}

const mutations = {

  [END_LOADING] (state) {
    state.isLoading = false
  },
  [SET_ITEMS] (state, items) {
    state.items = items
  },
  [SET_PROCESSO_ID] (state, processoId) {
    state.processoId = processoId
  },
  [SET_SEARCH] (state, search) {
    state.search = search
  },
  [START_LOADING] (state) {
    state.isLoading = true
  },
  [RESET_STATE] (state) {
    const initialState = getInitialState()
    Object.keys(initialState).forEach(key => { state[key] = initialState[key] })
  }

}

const actions = {

  async [START] ({ commit }) {
    commit(RESET_STATE)
    commit(`${WORKFLOW}/${RESET_STATE}`)

    commit(START_LOADING)
    try {
      var items = await ApiService.get('processos/abstract')
      items.forEach(item => item.id = item._id)
      commit(SET_ITEMS, items)
    } catch(err) {
      throw err
    } finally {
      commit(END_LOADING)
    }
  },
  [SELECT_PROCESSO] ({ commit }, processo) {
    commit(SET_PROCESSO_ID, processo.id)
    commit(`${WORKFLOW}/${SET_STEPS}`, processo.workflow)
  }

}

export default {
  namespaced: true,
  state,
  modules,
  getters,
  mutations,
  actions
}
