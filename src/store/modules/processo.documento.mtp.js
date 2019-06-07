import { getField, updateField } from 'vuex-map-fields'

import { PUSH_IRREGULARIDADE, REMOVE_IRREGULARIDADE, RESET_STATE, UPDATE_FIELD } from 'store/mutation.types'
import { START } from 'store/action.types'


function getInitialState () {
  return {
    auditores: [], // Objects { text: String, value: String }
    irregularidades: [{ text: null }],
    pressupostos: {
      presenteFumus: false,
      presentePericulum: 'NÃO'
    },
    requisitosPresentes: [] // Strings
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
      commit(UPDATE_FIELD, { path: 'auditores', value: mtp.auditores.map(a => { return { text: a.nome, value: a._id } }) })
      commit(UPDATE_FIELD, { path: 'irregularidades', value: mtp.irregularidades.map(i => { return { text: i } }) })
      commit(UPDATE_FIELD, { path: 'requisitosPresentes', value: mtp.requisitosPresentes })
      if (mtp.pressupostos) {
        commit(UPDATE_FIELD, { path: 'pressupostos.presenteFumus', value: mtp.pressupostos.presenteFumus })
        commit(UPDATE_FIELD, { path: 'pressupostos.presentePericulum', value: mtp.pressupostos.presentePericulum })
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
