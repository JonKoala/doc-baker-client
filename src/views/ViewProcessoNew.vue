<template>
  <v-container fluid>
    <v-layout justify-center>
      <v-flex xs4>
        <v-card>
          <v-toolbar color="blue-grey" dense card>
            <v-toolbar-title class="white--text">NOVO PROCESSO</v-toolbar-title>
          </v-toolbar>
          <v-progress-linear v-bind:active="isLoading" class="my-0" color="blue" indeterminate></v-progress-linear>
          <v-layout row wrap justify-space-around class="pa-2">
            <v-text-field v-model="numero" v-bind:disabled="isLoading" label="Número" class="px-2"></v-text-field>
            <v-text-field v-model="ano" v-bind:disabled="isLoading" label="Ano" class="px-2"></v-text-field>
          </v-layout>
          <v-layout row wrap justify-space-around class="pa-2">
            <v-text-field v-model="nome" v-bind:disabled="isNomeLocked || isLoading" label="Nome" class="pl-2"></v-text-field>
            <base-icon-button v-on:click="toggleNomeEditMode" v-bind:disabled="isLoading" v-bind:tooltip="nomeEditModeButtonTooltip" top class="pt-3 pr-4">
              {{ nomeEditModeButtonIcon }}
            </base-icon-button>
            <v-btn v-bind:disabled="isSaveLocked || isLoading" v-on:click="saveProcesso" large class="mt-1">Salvar</v-btn>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
    <v-snackbar v-model="isNotifying" v-bind:timeout="5000" bottom right>Ocorreu um erro ao tentar salvar o processo</v-snackbar>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import { VIEW_PROCESSO_NEW, PROCESSO } from 'store/namespaces'
import { SAVE_PROCESSO, CHANGE_ANO, CHANGE_NOME, CHANGE_NUMERO, START_VIEW, TOGGLE_NOME_LOCKING } from 'store/action.types'

import BaseIconButton from 'components/BaseIconButton'

export default {
  name: 'ViewProcessoNew',
  components: {
    BaseIconButton
  },
  data () {
    return {
      isNotifying: false
    }
  },
  computed: {
    ...mapGetters(VIEW_PROCESSO_NEW, [
      'isLoading',
      'isNomeLocked'
    ]),
    numero: {
      get () { return this.$store.getters[`${VIEW_PROCESSO_NEW}/${PROCESSO}/numero`] },
      set (value) { this.$store.dispatch(`${VIEW_PROCESSO_NEW}/${CHANGE_NUMERO}`, value) }
    },
    ano: {
      get () {  return this.$store.getters[`${VIEW_PROCESSO_NEW}/${PROCESSO}/ano`] },
      set (value) { this.$store.dispatch(`${VIEW_PROCESSO_NEW}/${CHANGE_ANO}`, value) }
    },
    nome: {
      get () {  return this.$store.getters[`${VIEW_PROCESSO_NEW}/${PROCESSO}/nome`] },
      set (value) { this.$store.dispatch(`${VIEW_PROCESSO_NEW}/${CHANGE_NOME}`, value) }
    },
    isSaveLocked () {
      return !(this.ano && this.nome && this.numero)
    },
    nomeEditModeButtonIcon () {
      return (this.isNomeLocked) ? 'edit' : 'sync'
    },
    nomeEditModeButtonTooltip () {
      return (this.isNomeLocked) ? 'manual' : 'automatico'
    }
  },
  methods: {
    ...mapActions(VIEW_PROCESSO_NEW, {
      persistProcesso: SAVE_PROCESSO,
      startView: START_VIEW,
      toggleNomeEditMode: TOGGLE_NOME_LOCKING
    }),
    async saveProcesso () {
      try {
        await this.persistProcesso()
        this.$router.push({ name: 'editProcesso', params: { id: this.$store.getters[`${VIEW_PROCESSO_NEW}/${PROCESSO}/id`] } })
      } catch (err) {
        this.isNotifying = true
        console.log(err)
      }
    }
  },
  created () {
    this.startView()
  }
}
</script>
