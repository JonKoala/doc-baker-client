import Vue from 'vue'
import { forEach } from 'p-iteration'

import ApiService from 'services/api.service'

import { FETCH_PROJETO, SET_PROJETO, SAVE_PROJETO, TAKE_WORKFLOW_ACTION_OFFLINE, UPDATE_PROJETO } from 'store/actions.type'
import {
  RESET_PROJETO_STATE, RESET_WORKFLOW_STATE, SET_PROJETO_ANO_PROCESSO,
  SET_PROJETO_ID, SET_PROJETO_NOME, SET_PROJETO_NUMERO_PROCESSO
} from 'store/mutations.type'


const initialState = {
  id: null, // Number
  nome: null, // String
  numeroProcesso: null, // String
  anoProcesso: null // Number
}
const state = Object.assign({}, initialState)

const getters = {

  projetoId(state) {
    return state.id
  },
  projetoNome(state) {
    return state.nome
  },
  projetoNumeroProcesso(state) {
    return state.numeroProcesso
  },
  projetoAnoProcesso(state) {
    return state.anoProcesso
  }

}

const mutations = {

  [SET_PROJETO_ID] (state, id) {
    state.id = id
  },
  [SET_PROJETO_NOME] (state, nome) {
    state.nome = nome
  },
  [SET_PROJETO_NUMERO_PROCESSO] (state, numeroProcesso) {
    state.numeroProcesso = numeroProcesso
  },
  [SET_PROJETO_ANO_PROCESSO] (state, anoProcesso) {
    state.anoProcesso = anoProcesso
  },
  [RESET_PROJETO_STATE] (state) {
    for (let f in state) {
      Vue.set(state, f, initialState[f]);
    }
  }

}

const actions = {

  async [FETCH_PROJETO] ({ commit, dispatch }, id) {
    var projeto = await ApiService.get(`projetos/${id}`)
    await dispatch(SET_PROJETO, projeto)
  },
  async [SAVE_PROJETO] ({ commit, dispatch }) {
    var saved = await dispatch(UPDATE_PROJETO)
    await dispatch(SET_PROJETO, saved)
  },
  async [SET_PROJETO] ({ commit, dispatch }, projeto) {
    commit(RESET_PROJETO_STATE)
    commit(RESET_WORKFLOW_STATE)

    commit(SET_PROJETO_ID, projeto.id)
    commit(SET_PROJETO_NOME, projeto.nome)
    commit(SET_PROJETO_NUMERO_PROCESSO, projeto.numero_processo)
    commit(SET_PROJETO_ANO_PROCESSO, projeto.ano_processo)
    await forEach(projeto.workflow, async (step) => {
      if (step.action)
        await dispatch(TAKE_WORKFLOW_ACTION_OFFLINE, step.action)
    })
  },
  async [UPDATE_PROJETO] ({ getters }) {
    var projeto = { id: getters.projetoId, nome: getters.projetoNome, numero_processo: getters.projetoNumeroProcesso, ano_processo: getters.anoProcesso, workflow: getters.workflow }
    var saved = (projeto.id) ? await ApiService.put('projetos', projeto) : await ApiService.post('projetos', projeto)
    return saved.data
  }

}


export default {
  state,
  getters,
  mutations,
  actions
}
