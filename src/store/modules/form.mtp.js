import ApiService from 'services/api.service'

import irregularidades from 'store/modules/processo.irregularidades'
import mtp from 'store/modules/processo.documento.mtp'
import processo from 'store/modules/processo.geral'
import workflow from 'store/modules/processo.workflow'

import { IRREGULARIDADES, MTP, PROCESSO, WORKFLOW } from 'store/namespaces'
import {
  END_LOADING, SET_ADMISSIBILIDADE_OPTIONS, SET_AUDITOR_OPTIONS,
  SET_PERICULUM_OPTIONS, SET_STEPS, SET_TIPO_OPTIONS, START_LOADING, RESET_STATE
} from 'store/mutation.types'
import { SAVE_MTP, START_IRREGULARIDADES, START_MTP, START_PROCESSO, START_VIEW } from 'store/action.types'


function getInitialState () {
  return {
    isLoading: false,
    options: {
      admissibilidade: [],
      auditor: [],
      periculum: [],
      tipo: []
    }
  }
}
const state = getInitialState

const modules = {
  [IRREGULARIDADES]: irregularidades,
  [MTP]: mtp,
  [PROCESSO]: processo,
  [WORKFLOW]: workflow
}

const getters = {

  paramId (state, getters, rootState) {
    return rootState.route.params.id
  },
  form (state, getters) {
    if (getters[`${WORKFLOW}/latestStep`])
      return getters[`${WORKFLOW}/latestStep`].state
  },
  isLoading (state) {
    return state.isLoading
  },
  options (state) {
    return state.options
  }

}

const mutations = {

  [END_LOADING] (state) {
    state.isLoading = false
  },
  [SET_ADMISSIBILIDADE_OPTIONS] (state, options) {
    state.options.admissibilidade = options
  },
  [SET_AUDITOR_OPTIONS] (state, options) {
    state.options.auditor = options
  },
  [SET_PERICULUM_OPTIONS] (state, options) {
    state.options.periculum = options
  },
  [SET_TIPO_OPTIONS] (state, options) {
    state.options.tipo = options
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

  async [SAVE_MTP] ({ commit, dispatch, getters }) {
    var { id, ...geral } = getters[`${PROCESSO}/state`]
    var processo = {
      ...geral,
      ...getters[`${IRREGULARIDADES}/state`],
      _id: id,
      documento: {
        mtp: getters[`${MTP}/state`]
      }
    }

    commit(START_LOADING)
    try {
      var response = await ApiService.put('processos', processo)
      processo = response.data
      dispatch(`${PROCESSO}/${START_PROCESSO}`, { ...processo, id: processo._id })
      dispatch(`${MTP}/${START_MTP}`, processo.documento.mtp)
      dispatch(`${IRREGULARIDADES}/${START_IRREGULARIDADES}`, processo.irregularidades)
    } catch (err) {
      throw err
    } finally {
      commit(END_LOADING)
    }
  },
  async [START_VIEW] ({ commit, dispatch, getters }) {
    commit(RESET_STATE)
    commit(`${PROCESSO}/${RESET_STATE}`)
    commit(`${MTP}/${RESET_STATE}`)
    commit(`${IRREGULARIDADES}/${RESET_STATE}`)
    commit(`${WORKFLOW}/${RESET_STATE}`)

    commit(START_LOADING)
    try {
      await Promise.all([
        ApiService.get('/criterioslegais/admissibilidade').then(result => commit(SET_ADMISSIBILIDADE_OPTIONS, result)),
        ApiService.get('/auditores').then(result => commit(SET_AUDITOR_OPTIONS, result)),
        ApiService.get('/processos/periculum/options').then(result => commit(SET_PERICULUM_OPTIONS, result)),
        ApiService.get('/processos/tipo/options').then(result => commit(SET_TIPO_OPTIONS, result)),
        ApiService.get(`processos/${getters.paramId}`).then(processo => {
          dispatch(`${PROCESSO}/${START_PROCESSO}`, { ...processo, id: processo._id })
          dispatch(`${MTP}/${START_MTP}`, processo.documento.mtp)
          dispatch(`${IRREGULARIDADES}/${START_IRREGULARIDADES}`, processo.irregularidades)
          commit(`${WORKFLOW}/${SET_STEPS}`, processo.workflow)
        })
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
