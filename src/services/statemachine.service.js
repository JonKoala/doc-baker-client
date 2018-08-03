import { Machine } from 'xstate'

import schema from './statemachine/schema'


const machine = Machine(schema)

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
  return machine.transition(state, next).value
}

export default {
  getState,
  getStateData,
  getStateOptions,
  getStateType,
  transition
}
