import { getField, updateField } from 'vuex-map-fields'

import { RESET_STATE, UPDATE_FIELD } from 'store/mutation.types'
import { START } from 'store/action.types'

function getInitialState () {
  return {
    ano: null, // String
    id: null, // String
    jurisdicionado: null, //String
    nome: null, // String
    numero: null, // String
    objeto: {
      codigo: null, // String
      descricao: null, // String
      tipo: null // String
    },
    requerente: {
      nome: null, // String
      isPessoaFisica: true
    },
    tipo: null // String
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
  [RESET_STATE] (state) {
    const initialState = getInitialState()
    Object.keys(initialState).forEach(key => { state[key] = initialState[key] })
  }

}

const actions = {

  [START] ({ commit }, processo) {
    commit(UPDATE_FIELD, { path: 'ano', value: processo.ano })
    commit(UPDATE_FIELD, { path: 'id', value: processo.id })
    commit(UPDATE_FIELD, { path: 'jurisdicionado', value: processo.jurisdicionado })
    commit(UPDATE_FIELD, { path: 'nome', value: processo.nome })
    commit(UPDATE_FIELD, { path: 'numero', value: processo.numero })
    commit(UPDATE_FIELD, { path: 'objeto.codigo', value: processo.objeto.codigo })
    commit(UPDATE_FIELD, { path: 'objeto.descricao', value: processo.objeto.descricao })
    commit(UPDATE_FIELD, { path: 'requerente.nome', value: processo.requerente.nome })
    commit(UPDATE_FIELD, { path: 'requerente.isPessoaFisica', value: processo.requerente.isPessoaFisica })
    commit(UPDATE_FIELD, { path: 'tipo', value: processo.tipo })
  }

}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
