import Vue from 'vue'

import ApiService from 'services/api.service'
import stateMachine from 'services/statemachine.service'

import { SET_WORKFLOW, TAKE_WORKFLOW_ACTION, UNDO_WORKFLOW_LATEST_ACTION } from 'store/actions.type'
import { ADD_WORKFLOW_STEP, DELETE_WORKFLOW_LATEST_STEP, RESET_WORKFLOW_STATE, SET_WORKFLOW_LATEST_STEP_ACTION, SET_WORKFLOW_STEPS } from 'store/mutations.type'


const initialState = {
  steps: [] // [{ state: [STRING], action: [STRING] }]
}
const state = Object.assign({}, initialState)

const getters = {

  workflow (state) {
    return state.steps
  },
  workflowFreshModel () {
    return [{ action: null, state: stateMachine.getInitialState() }]
  },
  workflowSteps (state) {
    return state.steps.map((entry, index) => {
      return {
        ...entry,
        index: index + 1,
        title: stateMachine.getState(entry['state'])['title']
      }
    })
  },
  workflowCurrentStep (state, getters) {
    if (getters.workflowSteps.length < 1)
      return {}

    var latest = getters.workflowSteps[getters.workflowSteps.length - 1]
    return {
      ...latest,
      options: stateMachine.getState(latest['state'])['actions'].map(a => { return a.text })
    }
  }

}

const mutations = {

  [ADD_WORKFLOW_STEP] (state, stepState) {
    state.steps.push({ action: null, state: stepState })
  },
  [DELETE_WORKFLOW_LATEST_STEP] (state) {
    state.steps.pop()
  },
  [SET_WORKFLOW_LATEST_STEP_ACTION] (state, action) {
    Vue.set(state.steps[state.steps.length - 1], 'action', action)
  },
  [SET_WORKFLOW_STEPS] (state, steps) {
    state.steps = steps
  },
  [RESET_WORKFLOW_STATE] (state) {
    for (let f in state) {
      Vue.set(state, f, initialState[f]);
    }
  }

}

const actions = {

  [SET_WORKFLOW] ({ commit }, steps) {
    commit(SET_WORKFLOW_STEPS, steps)
  },
  [TAKE_WORKFLOW_ACTION] ({ commit, getters }, action) {
    action = stateMachine.getState(getters.workflowCurrentStep.state)['actions'].find(a => a.text === action)
    commit(SET_WORKFLOW_LATEST_STEP_ACTION, action.text)
    commit(ADD_WORKFLOW_STEP, action.state)

    ApiService.put('processos', { _id: getters.processoId, workflow: getters.workflow })
  },
  [UNDO_WORKFLOW_LATEST_ACTION] ({ commit, getters }) {
    commit(DELETE_WORKFLOW_LATEST_STEP)
    commit(SET_WORKFLOW_LATEST_STEP_ACTION, null)

    ApiService.put('processos', { _id: getters.processoId, workflow: getters.workflow })
  }

}


export default {
  state,
  getters,
  mutations,
  actions
}
