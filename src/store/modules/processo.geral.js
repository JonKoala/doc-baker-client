import { SET_ANO, SET_ID, SET_NOME, SET_NUMERO, SET_OBJETO_CODIGO, SET_OBJETO_DESCRICAO, SET_REPRESENTANTE, SET_TIPO, RESET_STATE } from 'store/mutation.types'
import { START_PROCESSO } from 'store/action.types'

function getInitialState () {
  return {
    ano: null, // String
    id: null, // String
    nome: null, // String
    numero: null, // String
    objeto: {
      codigo: null, // String
      descricao: null // String
    },
    representante: null, // String
    tipo: null // String
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
  },
  objetoCodigo (state) {
    return state.objeto.codigo
  },
  objetoDescricao (state) {
    return state.objeto.descricao
  },
  representante (state) {
    return state.representante
  },
  tipo (state) {
    return state.tipo
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
  [SET_OBJETO_CODIGO] (state, codigo) {
    state.objeto.codigo = codigo
  },
  [SET_OBJETO_DESCRICAO] (state, descricao) {
    state.objeto.descricao = descricao
  },
  [SET_REPRESENTANTE] (state, representante) {
    state.representante = representante
  },
  [SET_TIPO] (state, tipo) {
    state.tipo = tipo
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
    commit(SET_OBJETO_CODIGO, processo.objeto.codigo)
    commit(SET_OBJETO_DESCRICAO, processo.objeto.descricao)
    commit(SET_REPRESENTANTE, processo.representante)
    commit(SET_TIPO, processo.tipo)
  }

}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
