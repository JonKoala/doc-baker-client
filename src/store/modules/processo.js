import { getField, updateField } from 'vuex-map-fields'

import {
  UPDATE_FIELD,
  SET_ANO, SET_ID, SET_NOME, SET_NUMERO, SET_OBJETO_CODIGO, SET_OBJETO_DESCRICAO,
  SET_REPRESENTANTE_NOME, SET_REPRESENTANTE_PESSOA_FISICA, SET_TIPO, RESET_STATE
} from 'store/mutation.types'
import { START_PROCESSO } from 'store/action.types'

function getInitialState () {
  return {
    ano: null, // String
    id: null, // String
    nome: null, // String
    numero: null, // String
    objeto: {
      codigo: null, // String
      descricao: null, // String
      tipo: null // String
    },
    representante: {
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

  [START_PROCESSO] ({ commit }, processo) {
    commit(UPDATE_FIELD, { path: 'ano', value: processo.ano })
    commit(UPDATE_FIELD, { path: 'id', value: processo.id })
    commit(UPDATE_FIELD, { path: 'nome', value: processo.nome })
    commit(UPDATE_FIELD, { path: 'numero', value: processo.numero })
    commit(UPDATE_FIELD, { path: 'objeto.codigo', value: processo.objeto.codigo })
    commit(UPDATE_FIELD, { path: 'objeto.descricao', value: processo.objeto.descricao })
    commit(UPDATE_FIELD, { path: 'representante.nome', value: processo.representante.nome })
    commit(UPDATE_FIELD, { path: 'representante.isPessoaFisica', value: processo.representante.isPessoaFisica })
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
