import schema from './statemachine/schema'


function getState (state) {
  return schema.states[state]
}

function getStateActions (state) {
  return getState(state).actions
}

export default {
  getState,
  getStateActions
}
