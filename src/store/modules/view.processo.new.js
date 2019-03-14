import ApiService from 'services/api.service'
import stateMachine from 'services/statemachine.service'

import processo from 'store/modules/processo'

import { PROCESSO } from 'store/namespaces'
import {
  UPDATE_FIELD, END_LOADING, SET_ANO, SET_ID, SET_NOME,
  SET_NOME_LOCKING, SET_NUMERO, SET_OPTIONS, START_LOADING, RESET_STATE
} from 'store/mutation.types'
import { AUTO_CHANGE_NOME, SAVE_PROCESSO, START_PROCESSO, CHANGE_ANO, CHANGE_NOME, CHANGE_NUMERO, START_VIEW, TOGGLE_NOME_LOCKING } from 'store/action.types'


function getInitialState () {
  return {
    isLoading: false,
    isNomeLocked: true,
    selectOptions: {
      objetoTipos: [],
      processoTipos: [],
      representanteTipos: [{ text: 'Jurídica', value: false }, { text: 'Física', value: true }]
    }
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
  processoField (state, getters) {
    return getters[`${PROCESSO}/getField`]
  },
  selectOptions (state) {
    return state.selectOptions
  }

}

const mutations = {

  [END_LOADING] (state) {
    state.isLoading = false
  },
  [SET_NOME_LOCKING] (state, isLocking) {
    state.isNomeLocked = isLocking
  },
  [SET_OPTIONS] (state, payload) {
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

  [AUTO_CHANGE_NOME] ({ dispatch, getters }) {
    if (getters.processoField('numero') && getters.processoField('ano'))
      dispatch(CHANGE_NOME, `${getters.processoField('numero')}/${getters.processoField('ano')}`)
    else
      dispatch(CHANGE_NOME, null)
  },
  async [SAVE_PROCESSO] ({ commit, dispatch, getters }) {

    commit(START_LOADING)
    try {
      var response = await ApiService.post('processos', { ...getters[`${PROCESSO}/clone`], workflow: stateMachine.getFreshWorkflow() })
      await dispatch(`${PROCESSO}/${START_PROCESSO}`, { ...response.data, id: response.data._id })
    } catch (err) {
      throw err
    } finally {
      commit(END_LOADING)
    }
  },
  [CHANGE_ANO] ({ dispatch, commit, getters }, ano) {
    commit(`${PROCESSO}/${UPDATE_FIELD}`, { path: 'ano', value: ano })
    if (getters.isNomeLocked)
      dispatch(AUTO_CHANGE_NOME)
  },
  [CHANGE_NOME] ({ commit }, nome) {
    commit(`${PROCESSO}/${UPDATE_FIELD}`, { path: 'nome', value: nome })
  },
  [CHANGE_NUMERO] ({ dispatch, commit, getters }, numero) {
    commit(`${PROCESSO}/${UPDATE_FIELD}`, { path: 'numero', value: numero })
    if (getters.isNomeLocked)
      dispatch(AUTO_CHANGE_NOME)
  },
  async [START_VIEW] ({ commit, dispatch }) {
    commit(RESET_STATE)
    commit(`${PROCESSO}/${RESET_STATE}`)
    commit(`${PROCESSO}/${UPDATE_FIELD}`, { path: 'ano', value: new Date().getFullYear().toString() })

    commit(START_LOADING)
    try {
      await Promise.all([
        ApiService.get('/processos/objeto/tipo/options').then(result => commit(SET_OPTIONS, { path: 'objetoTipos', value: result })),
        ApiService.get('/processos/tipo/options').then(result => commit(SET_OPTIONS, { path: 'processoTipos', value: result }))
      ])
    } catch(err) {
      throw err
    } finally {
      commit(END_LOADING)
    }
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
