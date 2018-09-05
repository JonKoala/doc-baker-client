import Vue from 'vue'

import { PUSH_IRREGULARIDADE, REMOVE_IRREGULARIDADE, SET_IRREGULARIDADE_TITULO, SET_IRREGULARIDADES, RESET_STATE } from 'store/mutation.types'
import { START_IRREGULARIDADES } from 'store/action.types'


function getInitialState () {
  return {
    irregularidades: [{ titulo: null }]
  }
}
const state = getInitialState

const getters = {

  state (state) {
    return state
  },
  titulos (state) {
    return state.irregularidades.map(i => i.titulo)
  }

}

const mutations = {

  [PUSH_IRREGULARIDADE] (state) {
    state.irregularidades.push({ titulo: null })
  },
  [REMOVE_IRREGULARIDADE] (state, index) {
    state.irregularidades.splice(index, 1)
  },
  [SET_IRREGULARIDADE_TITULO] (state, { index, titulo }) {
    Vue.set(state.irregularidades[index], 'titulo', titulo)
  },
  [SET_IRREGULARIDADES] (state, irregularidades) {
    state.irregularidades = irregularidades
  },
  [RESET_STATE] (state) {
    const initialState = getInitialState()
    Object.keys(initialState).forEach(key => { state[key] = initialState[key] })
  }

}

const actions = {

  [START_IRREGULARIDADES] ({ commit }, irregularidades) {
    if (irregularidades.length > 0)
      commit(SET_IRREGULARIDADES, irregularidades)
  }

}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
