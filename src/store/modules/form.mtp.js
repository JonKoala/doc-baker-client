import ApiService from 'services/api.service'

import irregularidades from 'store/modules/processo.irregularidades'
import processo from 'store/modules/processo.geral'

import { IRREGULARIDADES, PROCESSO } from 'store/namespaces'
import { END_LOADING, START_LOADING, RESET_STATE } from 'store/mutation.types'
import { START_IRREGULARIDADES, START_PROCESSO, START_VIEW } from 'store/action.types'


function getInitialState () {
  return {
    isLoading: false,
    // showRequisitos
    // showPressupostos
  }
}
const state = getInitialState

const modules = {
  [IRREGULARIDADES]: irregularidades,
  [PROCESSO]: processo
}

const getters = {

  paramId (state, getters, rootState) {
    return rootState.route.params.id
  },
  isLoading (state) {
    return state.isLoading
  }

}

const mutations = {

  [END_LOADING] (state) {
    state.isLoading = false
  },
  [START_LOADING] (state) {
    state.isLoading = true
  },
  [RESET_STATE] (state) {
    const initialState = getInitialState()
    Object.keys(initialState).forEach(key => { state[key] = initialState[key] })
  }

}

const actions = {

  async [START_VIEW] ({ commit, dispatch, getters }) {
    commit(RESET_STATE)
    commit(`${PROCESSO}/${RESET_STATE}`)
    commit(`${IRREGULARIDADES}/${RESET_STATE}`)

    commit(START_LOADING)
    try {
      var processo = await ApiService.get(`processos/${getters.paramId}`)
      dispatch(`${PROCESSO}/${START_PROCESSO}`, { ...processo, id: processo._id })
      dispatch(`${IRREGULARIDADES}/${START_IRREGULARIDADES}`, processo.irregularidades)
    } catch(err) {
      throw err
    } finally {
      commit(END_LOADING)
    }
  }

}

export default {
  namespaced: true,
  modules,
  state,
  getters,
  mutations,
  actions
}
