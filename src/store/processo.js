import Vue from 'vue'

import ApiService from 'services/api.service'

import { FETCH_PROCESSO, SAVE_PROCESSO, SET_PROCESSO, SET_WORKFLOW, UPDATE_PROCESSO } from 'store/actions.type'
import { RESET_PROCESSO_STATE, SET_PROCESSO_ANO, SET_PROCESSO_ID, SET_PROCESSO_NOME, SET_PROCESSO_NUMERO } from 'store/mutations.type'


const initialState = {
  _id: null, // String
  nome: null, // String
  numero: null, // String
  ano: null // String
}
const state = Object.assign({}, initialState)

const getters = {

  Processo(state) {
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

  async [FETCH_PROCESSO] ({ dispatch }, id) {
    var processo = await ApiService.get(`processos/${id}`)
    dispatch(SET_PROCESSO, processo)
    dispatch(SET_WORKFLOW, processo.workflow)
  },
  async [SAVE_PROCESSO] ({ dispatch }) {
    var saved = await dispatch(UPDATE_PROCESSO)
    dispatch(SET_PROCESSO, saved)
  },
  [SET_PROCESSO] ({ commit }, processo) {
    commit(RESET_PROCESSO_STATE)

    commit(SET_PROCESSO_ID, processo._id)
    commit(SET_PROCESSO_NOME, processo.nome)
    commit(SET_PROCESSO_NUMERO, processo.numero)
    commit(SET_PROCESSO_ANO, processo.ano)
  },
  async [UPDATE_PROCESSO] ({ getters }) {
    var processo = { ...getters.processo, workflow: getters.workflow }
    var saved = (processo._id) ? await ApiService.put('processos', processo) : await ApiService.post('processos', processo)
    return saved.data
  }

}


export default {
  state,
  getters,
  mutations,
  actions
}
