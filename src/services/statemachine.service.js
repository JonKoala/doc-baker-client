import schema from './statemachine/schema'

function getFreshWorkflow () {
  return [{ action: null, state: getInitialState() }]
}

function getInitialState () {
  return schema.initial_state
}

function getState (state) {
  return schema.states[state]
}

export default {
  getFreshWorkflow,
  getInitialState,
  getState
}
