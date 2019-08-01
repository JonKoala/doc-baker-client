import { getField, updateField } from 'vuex-map-fields'

import { PUSH_IRREGULARIDADE, REMOVE_IRREGULARIDADE, RESET_STATE, UPDATE_FIELD } from 'store/mutation.types'
import { START } from 'store/action.types'


function getInitialState () {
  return {
    auditores: [], // Strings
    irregularidades: [{ text: null }],
    admissibilidade: {
      requisitosPresentes: [] // Strings
    },
    cautelar: {
      presenteFumus: false,
      presentePericulum: null
    }
  }
}
const state = getInitialState

const getters = {

  getField,
  clone (state) {
    return { ...state }
  }

}

const mutations = {

  updateField,
  [PUSH_IRREGULARIDADE] (state) {
    state.irregularidades.push({ text: '' })
  },
  [REMOVE_IRREGULARIDADE] (state, index) {
    state.irregularidades.splice(index, 1)
  },
  [RESET_STATE] (state) {
    const initialState = getInitialState()
    Object.keys(initialState).forEach(key => { state[key] = initialState[key] })
  }

}

const actions = {

  [START] ({ commit }, mtp) {
    if (mtp) {
      commit(UPDATE_FIELD, { path: 'auditores', value: mtp.auditores.map(a => a._id) })
      commit(UPDATE_FIELD, { path: 'irregularidades', value: mtp.irregularidades.map(i => { return { text: i } }) })
      if (mtp.admissibilidade)
        commit(UPDATE_FIELD, { path: 'admissibilidade.requisitosPresentes', value: mtp.admissibilidade.requisitosPresentes.map(r => r._id) })
      if (mtp.cautelar) {
        commit(UPDATE_FIELD, { path: 'cautelar.presenteFumus', value: mtp.cautelar.presenteFumus })
        commit(UPDATE_FIELD, { path: 'cautelar.presentePericulum', value: mtp.cautelar.presentePericulum })
      }
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
