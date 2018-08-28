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
            <v-text-field v-model="processoNumero" v-bind:disabled="isLoading" label="Número" class="px-2"></v-text-field>
            <v-text-field v-model="processoAno" v-bind:disabled="isLoading" label="Ano" class="px-2"></v-text-field>
          </v-layout>
          <v-layout row wrap justify-space-around class="pa-2">
            <v-text-field v-model="processoNome" v-bind:disabled="isNomeLocked || isLoading" label="Nome" class="pl-2"></v-text-field>
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
import { mapGetters } from 'vuex'

import { NAMESPACE } from 'store/views/processoNew.type'
import { SAVE_PROCESSO, SET_PROCESSO_ANO, SET_PROCESSO_NOME, SET_PROCESSO_NUMERO, START_VIEW, TOGGLE_NOME_LOCKING } from 'store/views/processoNew.type'

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
    ...mapGetters(NAMESPACE, [
      'isLoading',
      'isNomeLocked',
      'processo'
    ]),
    processoAno: {
      get () { return this.processo.ano },
      set (ano) { this.$store.dispatch(`${NAMESPACE}/${SET_PROCESSO_ANO}`, ano) }
    },
    processoNome: {
      get () { return this.processo.nome },
      set (nome) { this.$store.dispatch(`${NAMESPACE}/${SET_PROCESSO_NOME}`, nome) }
    },
    processoNumero: {
      get () { return this.processo.numero },
      set (numero) { this.$store.dispatch(`${NAMESPACE}/${SET_PROCESSO_NUMERO}`, numero) }
    },
    isSaveLocked () {
      return !(this.processoAno && this.processoNome && this.processoNumero)
    },
    nomeEditModeButtonIcon () {
      return (this.isNomeLocked) ? 'edit' : 'sync'
    },
    nomeEditModeButtonTooltip () {
      return (this.isNomeLocked) ? 'manual' : 'automatico'
    }
  },
  methods: {
    async saveProcesso () {
      try {
        await this.$store.dispatch(`${NAMESPACE}/${SAVE_PROCESSO}`)
        this.$router.push({ name: 'editProcesso', params: { id: this.processo.id } })
      } catch (err) {
        this.isNotifying = true
        console.log(err)
      }
    },
    toggleNomeEditMode () {
      this.$store.dispatch(`${NAMESPACE}/${TOGGLE_NOME_LOCKING}`)
    }
  },
  created () {
    this.$store.dispatch(`${NAMESPACE}/${START_VIEW}`)
  }
}
</script>
