import { SET_AUDITORES, SET_PRESENTE_FUMUS, SET_PRESENTE_PERICULUM, SET_REQUISITOS_PRESENTES, RESET_STATE } from 'store/mutation.types'
import { START_MTP } from 'store/action.types'


function getInitialState () {
  return {
    auditores: [], // Strings
    pressupostos: {
      presenteFumus: false,
      presentePericulum: null // String
    },
    requisitosPresentes: [] // Strings
  }
}
const state = getInitialState

const getters = {

  state (state) {
    return state
  },
  auditores (state) {
    return state.auditores
  },
  presenteFumus (state) {
    return state.pressupostos.presenteFumus
  },
  presentePericulum (state) {
    return state.pressupostos.presentePericulum
  },
  requisitosPresentes (state) {
    return state.requisitosPresentes
  }

}

const mutations = {

  [SET_AUDITORES] (state, auditores) {
    state.auditores = auditores
  },
  [SET_PRESENTE_FUMUS] (state, value) {
    state.pressupostos.presenteFumus = value
  },
  [SET_PRESENTE_PERICULUM] (state, value) {
    state.pressupostos.presentePericulum = value
  },
  [SET_REQUISITOS_PRESENTES] (state, requisitos) {
    state.requisitosPresentes = requisitos
  },
  [RESET_STATE] (state) {
    const initialState = getInitialState()
    Object.keys(initialState).forEach(key => { state[key] = initialState[key] })
  }

}

const actions = {

  [START_MTP] ({ commit }, mtp) {
    commit(SET_AUDITORES, mtp.auditores)
    commit(SET_REQUISITOS_PRESENTES, mtp.requisitosPresentes)
    if (mtp.pressupostos) {
      commit(SET_PRESENTE_FUMUS, mtp.pressupostos.presenteFumus)
      commit(SET_PRESENTE_PERICULUM, mtp.pressupostos.presentePericulum)
    }
  }

}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
