import Vue from 'vue'

import ApiService from 'services/api.service'

import { CREATE_PROCESSO, FETCH_PROCESSO, SET_PROCESSO, SET_WORKFLOW, UPDATE_PROCESSO } from 'store/actions.type'
import { RESET_PROCESSO_STATE, SET_PROCESSO_ANO, SET_PROCESSO_ID, SET_PROCESSO_NOME, SET_PROCESSO_NUMERO } from 'store/mutations.type'


const initialState = {
  _id: null, // String
  nome: null, // String
  numero: null, // String
  ano: null // String
}
const state = Object.assign({}, initialState)

const getters = {

  processo(state) {
    return state
  },
  processoId(state) {
    return state._id
  },
  processoNome(state) {
    return state.nome
  },
  processoNumero(state) {
    return state.numero
  },
  processoAno(state) {
    return state.ano
  }

}

const mutations = {

  [SET_PROCESSO_ID] (state, id) {
    state._id = id
  },
  [SET_PROCESSO_NOME] (state, nome) {
    state.nome = nome
  },
  [SET_PROCESSO_NUMERO] (state, numero) {
    state.numero = numero
  },
  [SET_PROCESSO_ANO] (state, ano) {
    state.ano = ano
  },
  [RESET_PROCESSO_STATE] (state) {
    for (let f in state) {
      Vue.set(state, f, initialState[f]);
    }
  }

}

const actions = {

  async [CREATE_PROCESSO] ({ dispatch, getters }) {
    var response = await ApiService.post('processos', { ...getters.processo, workflow: getters.workflowFreshModel })
    await dispatch(SET_PROCESSO, response.data)
  },
  async [FETCH_PROCESSO] ({ dispatch }, id) {
    var processo = await ApiService.get(`processos/${id}`)
    dispatch(SET_PROCESSO, processo)
    dispatch(SET_WORKFLOW, processo.workflow)
  },
  [SET_PROCESSO] ({ commit }, processo) {
    commit(SET_PROCESSO_ID, processo._id)
    commit(SET_PROCESSO_NOME, processo.nome)
    commit(SET_PROCESSO_NUMERO, processo.numero)
    commit(SET_PROCESSO_ANO, processo.ano)
  },
  async [UPDATE_PROCESSO] ({ getters }) {
    var response = await ApiService.put('processos', getters.processo)
    await dispatch(SET_PROCESSO, response.data)
  }

}


export default {
  state,
  getters,
  mutations,
  actions
}
