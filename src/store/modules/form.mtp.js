import ApiService from 'services/api.service'

import mtp from 'store/modules/processo.documento.mtp'

import { MTP, VIEW_PROCESSO_EDIT, WORKFLOW } from 'store/namespaces'
import { END_LOADING, RESET_STATE, SET_SELECT_OPTIONS, START_LOADING } from 'store/mutation.types'
import { SAVE, START } from 'store/action.types'


function getInitialState () {
  return {
    isLoading: false,
    selectOptions: {
      admissibilidade: [],
      auditores: [],
      periculum: []
    }
  }
}
const state = getInitialState

const modules = {
  [MTP]: mtp
}

const getters = {

  paramId (state, getters, rootState, rootGetters) {
    return rootGetters[`${VIEW_PROCESSO_EDIT}/paramId`]
  },
  processoField (state, getters, rootState, rootGetters) {
    return rootGetters[`${VIEW_PROCESSO_EDIT}/processoField`]
  },
  form (state, getters, rootState, rootGetters) {
    if (rootGetters[`${VIEW_PROCESSO_EDIT}/${WORKFLOW}/latestStep`])
      return rootGetters[`${VIEW_PROCESSO_EDIT}/${WORKFLOW}/latestStep`].state
  },
  isLoading (state) {
    return state.isLoading
  },
  selectOptions (state) {
    return state.selectOptions
  }

}

const mutations = {

  [END_LOADING] (state) {
    state.isLoading = false
  },
  [SET_SELECT_OPTIONS] (state, payload) {
    state.selectOptions[payload.path] = payload.value
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

  async [SAVE] ({ commit, dispatch, getters }) {

    var processo = getters.paramId
    var documento = getters[`${MTP}/clone`]
    documento.template = 'MTP'
    documento.auditores = documento.auditores.map(a => a.value)
    documento.irregularidades = documento.irregularidades.map(a => a.text)

    commit(START_LOADING)
    try {
      var response = await ApiService.put('/documentos/mtp', { processo, documento })
      dispatch(`${MTP}/${START}`, response.data)
    } catch (err) {
      throw err
    } finally {
      commit(END_LOADING)
    }
  },
  async [START] ({ commit, dispatch, getters }) {
    commit(RESET_STATE)
    commit(`${MTP}/${RESET_STATE}`)

    commit(START_LOADING)
    try {
      await Promise.all([
        ApiService.get('/auditores').then(result => commit(SET_SELECT_OPTIONS, { path: 'auditores', value: result })),
        ApiService.get('/documentos/mtp/admissibilidade/options').then(result => commit(SET_SELECT_OPTIONS, { path: 'admissibilidade', value: result })),
        ApiService.get(`/documentos/mtp/${getters.paramId}`).then(documento => dispatch(`${MTP}/${START}`, documento)),
        ApiService.get('/documentos/mtp/cautelar/periculum/options').then(result => commit(SET_SELECT_OPTIONS, { path: 'periculum', value: result }))
      ])
    } catch(err) {
      throw err
    } finally {
      commit(END_LOADING)
    }
  }

}

export default {
  namespaced: true,
  modules,
  state,
  getters,
  mutations,
  actions
}
