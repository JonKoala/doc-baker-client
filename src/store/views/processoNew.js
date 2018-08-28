import Vue from 'vue'

import ApiService from 'services/api.service'
import {
  AUTO_SET_PROCESSO_NOME, SAVE_PROCESSO, SET_PROCESSO_ANO, SET_PROCESSO_NOME,
  SET_PROCESSO_NUMERO, START_VIEW, TOGGLE_NOME_LOCKING
} from './processoNew.type'
import { END_LOADING, SET_NOME_LOCKING, SET_PROCESSO, START_LOADING, RESET_STATE } from './processoNew.type'



const initialState = {
  isLoading: false,
  isNomeLocked: true,
  processo: {
    id: null, // String
    ano: null, // String
    nome: null, // String
    numero: null // String
  }
}
const state = Object.assign({}, initialState)

const getters = {

  isLoading (state) {
    return state.isLoading
  },
  isNomeLocked (state) {
    return state.isNomeLocked
  },
  processo (state) {
    return state.processo
  }

}

const mutations = {

  [END_LOADING] (state) {
    state.isLoading = false
  },
  [SET_NOME_LOCKING] (state, isLocking) {
    state.isNomeLocked = isLocking
  },
  [SET_PROCESSO] (state, processo) {
    state.processo = processo
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

  [AUTO_SET_PROCESSO_NOME] ({ dispatch, getters }) {
    if (getters.processo.numero && getters.processo.ano)
      dispatch(SET_PROCESSO_NOME, `${getters.processo.numero}/${getters.processo.ano}`)
    else
      dispatch(SET_PROCESSO_NOME, null)
  },
  async [SAVE_PROCESSO] ({ commit, getters, rootGetters }) {
    commit(START_LOADING)

    try {
      var response = await ApiService.post('processos', { ...getters.processo, workflow: rootGetters.workflowFreshModel })
      var { _id, ...newProcesso } = response.data
      commit(SET_PROCESSO, { ...newProcesso, id: _id })
    } catch (err) {
      throw err
    } finally {
      commit(END_LOADING)
    }
  },
  [SET_PROCESSO_ANO] ({ dispatch, commit, getters }, ano) {
    commit(SET_PROCESSO, { ...getters.processo, ano })
    if (getters.isNomeLocked)
      dispatch(AUTO_SET_PROCESSO_NOME)
  },
  [SET_PROCESSO_NOME] ({ commit, getters }, nome) {
    commit(SET_PROCESSO, { ...getters.processo, nome })
  },
  [SET_PROCESSO_NUMERO] ({ dispatch, commit, getters }, numero) {
    commit(SET_PROCESSO, { ...getters.processo, numero })
    if (getters.isNomeLocked)
      dispatch(AUTO_SET_PROCESSO_NOME)
  },
  [START_VIEW] ({ commit, dispatch }) {
    commit(RESET_STATE)
    dispatch(SET_PROCESSO_ANO, new Date().getFullYear().toString())
  },
  [TOGGLE_NOME_LOCKING] ({ dispatch, commit, getters }) {
    commit(SET_NOME_LOCKING, !getters.isNomeLocked)
    dispatch(AUTO_SET_PROCESSO_NOME)
  }

}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
