import ApiService from 'services/api.service'

import { START_VIEW } from './home.type'
import { END_LOADING, SET_ITEMS, SET_PROCESSO, SET_SEARCH, START_LOADING } from './home.type'


const state = {
  isLoading: false,
  items: [],
  processoId: null, // Number
  processoWorkflow: [],
  search: null // String
}

const getters = {

  isLoading (state) {
    return state.isLoading
  },
  items (state) {
    return state.items
  },
  processo (state) {
    return {
      id: state.processoId,
      workflow: state.processoWorkflow
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
  [SET_PROCESSO] (state, processo) {
    state.processoId = processo._id
    state.processoWorkflow = processo.workflow
  },
  [SET_SEARCH] (state, search) {
    state.search = search
  },
  [START_LOADING] (state) {
    state.isLoading = true
  }

}

const actions = {

  async [START_VIEW] ({ commit }) {
    commit(START_LOADING)

    try {
      var items = await ApiService.get('processos/abstract')
      commit(SET_ITEMS, items)
    } catch(err) {
      throw err
    } finally {
      commit(END_LOADING)
    }
  }

}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
