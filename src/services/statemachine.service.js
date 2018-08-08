import schema from './statemachine/schema'


function getInitialState () {
  return schema.initial_state
}

function getState (state) {
  return schema.states[state]
}

export default {
  getInitialState,
  getState
}
