import ApiService from 'services/api.service'
import stateMachine from 'services/statemachine.service'

import processo from 'store/modules/processo.geral'

import { PROCESSO } from 'store/namespaces'
import { END_LOADING, SET_ANO, SET_ID, SET_NOME, SET_NOME_LOCKING, SET_NUMERO, START_LOADING, RESET_STATE } from 'store/mutation.types'
import { AUTO_CHANGE_NOME, SAVE_PROCESSO, START_PROCESSO, CHANGE_ANO, CHANGE_NOME, CHANGE_NUMERO, START_VIEW, TOGGLE_NOME_LOCKING } from 'store/action.types'


function getInitialState () {
  return {
    isLoading: false,
    isNomeLocked: true
  }
}
const state = getInitialState

const modules = {
  [PROCESSO]: processo
}

const getters = {

  isLoading (state) {
    return state.isLoading
  },
  isNomeLocked (state) {
    return state.isNomeLocked
  },
  processo (state, getters) {
    return getters[`${PROCESSO}/state`]
  }

}

const mutations = {

  [END_LOADING] (state) {
    state.isLoading = false
  },
  [SET_NOME_LOCKING] (state, isLocking) {
    state.isNomeLocked = isLocking
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

  [AUTO_CHANGE_NOME] ({ dispatch, getters }) {
    if (getters.processo.numero && getters.processo.ano)
      dispatch(CHANGE_NOME, `${getters.processo.numero}/${getters.processo.ano}`)
    else
      dispatch(CHANGE_NOME, null)
  },
  async [SAVE_PROCESSO] ({ commit, dispatch, getters }) {

    commit(START_LOADING)
    try {
      var response = await ApiService.post('processos', { ...getters.processo, workflow: stateMachine.getFreshWorkflow() })
      await dispatch(`${PROCESSO}/${START_PROCESSO}`, { ...response.data, id: response.data._id })
    } catch (err) {
      throw err
    } finally {
      commit(END_LOADING)
    }
  },
  [CHANGE_ANO] ({ dispatch, commit, getters }, ano) {
    commit(`${PROCESSO}/${SET_ANO}`, ano)
    if (getters.isNomeLocked)
      dispatch(AUTO_CHANGE_NOME)
  },
  [CHANGE_NOME] ({ commit }, nome) {
    commit(`${PROCESSO}/${SET_NOME}`, nome)
  },
  [CHANGE_NUMERO] ({ dispatch, commit, getters }, numero) {
    commit(`${PROCESSO}/${SET_NUMERO}`, numero)
    if (getters.isNomeLocked)
      dispatch(AUTO_CHANGE_NOME)
  },
  [START_VIEW] ({ commit, dispatch }) {
    commit(RESET_STATE)
    commit(`${PROCESSO}/${RESET_STATE}`)
    commit(`${PROCESSO}/${SET_ANO}`, new Date().getFullYear().toString())
  },
  [TOGGLE_NOME_LOCKING] ({ dispatch, commit, getters }) {
    commit(SET_NOME_LOCKING, !getters.isNomeLocked)
    dispatch(AUTO_CHANGE_NOME)
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
