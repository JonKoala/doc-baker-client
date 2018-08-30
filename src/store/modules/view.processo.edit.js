import ApiService from 'services/api.service'

import processo from 'store/modules/processo.geral'
import workflow from 'store/modules/processo.workflow'

import { PROCESSO, WORKFLOW } from 'store/namespaces'
import { END_LOADING, SET_STEPS, START_LOADING, RESET_STATE } from 'store/mutation.types'
import { START_PROCESSO, START_VIEW, TAKE_ACTION, UNDO_ACTION } from 'store/action.types'


function getInitialState () {
  return {
    isLoading: false
  }
}
const state = getInitialState

const modules = {
  [PROCESSO]: processo,
  [WORKFLOW]: workflow
}

const getters = {

  paramId (state, getters, rootState) {
    return rootState.route.params.id
  },
  isLoading (state) {
    return state.isLoading
  },
  options (state, getters) {
    return getters[`${WORKFLOW}/options`]
  },
  workflow (state, getters) {
    return getters[`${WORKFLOW}/steps`]
  }

}

const mutations = {

  [END_LOADING] (state) {
    state.isLoading = false
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

  async [START_VIEW] ({ commit, dispatch, getters }) {
    commit(RESET_STATE)
    commit(`${PROCESSO}/${RESET_STATE}`)
    commit(`${WORKFLOW}/${RESET_STATE}`)

    commit(START_LOADING)
    try {
      var processo = await ApiService.get(`processos/${getters.paramId}`)
      await dispatch(`${PROCESSO}/${START_PROCESSO}`, { ...processo, id: processo._id })
      commit(`${WORKFLOW}/${SET_STEPS}`, processo.workflow)
    } catch(err) {
      throw err
    } finally {
      commit(END_LOADING)
    }
  },
  async [TAKE_ACTION] ({ commit, dispatch, getters }, action) {
    await dispatch(`${WORKFLOW}/${TAKE_ACTION}`, action)

    commit(START_LOADING)
    try {
      await ApiService.put('processos', { _id: getters[`${PROCESSO}/id`], workflow: getters.workflow })
    } catch (err) {
      throw err
    } finally {
      commit(END_LOADING)
    }
  },
  async [UNDO_ACTION] ({ commit, dispatch, getters }) {
    await dispatch(`${WORKFLOW}/${UNDO_ACTION}`)

    commit(START_LOADING)
    try {
      await ApiService.put('processos', { _id: getters[`${PROCESSO}/id`], workflow: getters.workflow })
    } catch (err) {
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
