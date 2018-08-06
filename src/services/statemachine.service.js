import schema from './statemachine/schema'


function getState (state) {
  return schema.states[state]
}

function getStateData (state) {
  return getState(state).data
}

function getStateOptions (state) {
  var stateObj = getState(state)
  return (stateObj.on == null) ? [] : Object.keys(stateObj.on)
}

function getStateType (state) {
  return getStateData(state).type
}

function transition (state, next) {
  return getState(state).on[next]
}

export default {
  getState,
  getStateData,
  getStateOptions,
  getStateType,
  transition
}
