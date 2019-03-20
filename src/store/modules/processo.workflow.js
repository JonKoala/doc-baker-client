import Vue from 'vue'

import stateMachine from 'services/statemachine.service'

import { PUSH_STEP, POP_STEP, RESET_STATE, SET_STEP_ACTION, SET_STEPS } from 'store/mutation.types'
import { TAKE_ACTION, UNDO_ACTION } from 'store/action.types'


function getInitialState () {
  return {
    steps: [] // [{ state: [STRING], action: [STRING] }]
  }
}
const state = getInitialState

const getters = {

  steps (state) {
    return state.steps
  },
  latestIndex (state, getters) {
    return getters.steps.length - 1
  },
  latestStep (state, getters) {
    return getters.steps[getters.latestIndex]
  },
  options (state, getters) {
    if (getters.latestStep)
      return stateMachine.getState(getters.latestStep['state'])['actions']
  }

}

const mutations = {

  [POP_STEP] (state) {
    state.steps.pop()
  },
  [PUSH_STEP] (state, stepState) {
    state.steps.push({ action: null, state: stepState })
  },
  [SET_STEP_ACTION] (state, { index, action }) {
    Vue.set(state.steps[index], 'action', action)
  },
  [SET_STEPS] (state, steps) {
    state.steps = steps
  },
  [RESET_STATE] (state) {
    const initialState = getInitialState()
    Object.keys(initialState).forEach(key => { state[key] = initialState[key] })
  }

}

const actions = {

  [TAKE_ACTION] ({ commit, getters }, action) {
    action = getters.options.find(o => o.text === action)
    commit(SET_STEP_ACTION, { index: getters.latestIndex, action: action.text })
    commit(PUSH_STEP, action.state)
  },
  [UNDO_ACTION] ({ commit, getters }) {
    commit(POP_STEP)
    commit(SET_STEP_ACTION, { index: getters.latestIndex, action: null })
  }

}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
