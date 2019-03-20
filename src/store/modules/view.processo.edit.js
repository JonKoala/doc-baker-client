import ApiService from 'services/api.service'

import workflow from 'store/modules/processo.workflow'
import processo from 'store/modules/processo'

import { PROCESSO, WORKFLOW } from 'store/namespaces'
import { END_LOADING, RESET_STATE, SET_STEPS, START_LOADING } from 'store/mutation.types'
import { START, TAKE_ACTION, UNDO_ACTION } from 'store/action.types'


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
  processoField (state, getters) {
    return getters[`${PROCESSO}/getField`]
  },
  isLoading (state) {
    return state.isLoading
  },
  options (state, getters) {
    return getters[`${WORKFLOW}/options`]
  },
  workflow (state, getters) {
    return getters[`${WORKFLOW}/steps`]
  },
  workflowState (state, getters) {
    if (getters[`${WORKFLOW}/latestStep`])
      return getters[`${WORKFLOW}/latestStep`].state
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

  async [START] ({ commit, dispatch, getters }) {
    commit(RESET_STATE)
    commit(`${PROCESSO}/${RESET_STATE}`)
    commit(`${WORKFLOW}/${RESET_STATE}`)

    commit(START_LOADING)
    try {
      var { workflow, ...processo } = await ApiService.get(`processos/workflow/${getters.paramId}`)
      dispatch(`${PROCESSO}/${START}`, { id: processo._id, ...processo })
      commit(`${WORKFLOW}/${SET_STEPS}`, workflow)
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
      await ApiService.put('processos', { _id: getters.paramId, workflow: getters.workflow })
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
      await ApiService.put('processos', { _id: getters.paramId, workflow: getters.workflow })
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
