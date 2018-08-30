import { SET_ANO, SET_ID, SET_NOME, SET_NUMERO, RESET_STATE } from 'store/mutation.types'
import { START_PROCESSO } from 'store/action.types'


function getInitialState () {
  return {
    ano: null, // String
    id: null, // String
    nome: null, // String
    numero: null // String
  }
}
const state = getInitialState

const getters = {

  state (state) {
    return state
  },
  ano (state) {
    return state.ano
  },
  id (state) {
    return state.id
  },
  nome (state) {
    return state.nome
  },
  numero (state) {
    return state.numero
  }

}

const mutations = {

  [SET_ANO] (state, ano) {
    state.ano = ano
  },
  [SET_ID] (state, id) {
    state.id = id
  },
  [SET_NOME] (state, nome) {
    state.nome = nome
  },
  [SET_NUMERO] (state, numero) {
    state.numero = numero
  },
  [RESET_STATE] (state) {
    const initialState = getInitialState()
    Object.keys(initialState).forEach(key => { state[key] = initialState[key] })
  }

}

const actions = {

  [START_PROCESSO] ({ commit }, processo) {
    commit(SET_ANO, processo.ano)
    commit(SET_ID, processo.id)
    commit(SET_NOME, processo.nome)
    commit(SET_NUMERO, processo.numero)
  }

}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
