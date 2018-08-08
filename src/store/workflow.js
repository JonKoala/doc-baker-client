import stateMachine from 'services/statemachine.service'

import { TAKE_WORKFLOW_ACTION, UNDO_WORKFLOW_LATEST_ACTION } from 'store/actions.type'
import { ADD_WORKFLOW_STEP, DELETE_WORKFLOW_LATEST_STEP, SET_WORKFLOW_LATEST_STEP_ACTION } from 'store/mutations.type'


const initialState = {
  history: [{
      action: null, // String
      index: 1,
      state: stateMachine.getInitialState() // String
  }]
}
const state = Object.assign({}, initialState)

const getters = {

  workflowSteps (state) {
    return state.history.map(entry => {
      return {
        ...entry,
        title: stateMachine.getState(entry['state'])['title']
      }
    })
  },
  workflowCurrentStep (state, getters) {
    var latest = getters.workflowSteps[getters.workflowSteps.length - 1]
    return {
      ...latest,
      options: stateMachine.getState(latest['state'])['actions'].map(a => { return a.text })
    }
  }

}

const mutations = {

  [ADD_WORKFLOW_STEP] (state, stepState) {
    state.history.push({ action: null, index: state.history.length + 1, state: stepState })
  },
  [DELETE_WORKFLOW_LATEST_STEP] (state) {
    state.history.pop()
  },
  [SET_WORKFLOW_LATEST_STEP_ACTION] (state, action) {
    state.history[state.history.length - 1].action = action
  }

}

const actions = {

  [TAKE_WORKFLOW_ACTION] ({ commit, getters }, action) {
    action = stateMachine.getState(getters.workflowCurrentStep.state)['actions'].find(a => a.text === action)
    commit(SET_WORKFLOW_LATEST_STEP_ACTION, action.text)
    commit(ADD_WORKFLOW_STEP, action.state)
  },
  [UNDO_WORKFLOW_LATEST_ACTION] ({ commit }) {
    commit(DELETE_WORKFLOW_LATEST_STEP)
  }

}


export default {
  state,
  getters,
  mutations,
  actions
}
