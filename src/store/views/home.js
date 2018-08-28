import Vue from 'vue'

import ApiService from 'services/api.service'

import { START_VIEW } from './home.type'
import { END_LOADING, RESET_STATE, SET_ITEMS, SET_PROCESSO, SET_SEARCH, START_LOADING } from './home.type'


const initialState = {
  isLoading: false,
  items: [],
  processo: {
    id: null, // Number
    workflow: []
  },
  search: null // String
}
const state = Object.assign({}, initialState)

const getters = {

  isLoading (state) {
    return state.isLoading
  },
  items (state) {
    return state.items
  },
  processo (state) {
    return state.processo
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
    state.processo = processo
  },
  [SET_SEARCH] (state, search) {
    state.search = search
  },
  [START_LOADING] (state) {
    state.isLoading = true
  },
  [RESET_STATE] (state) {
    for (let f in state) {
      Vue.set(state, f, initialState[f]);
    }
  }

}

const actions = {

  async [START_VIEW] ({ commit }) {
    commit(RESET_STATE)
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
  }

}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
