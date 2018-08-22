<template>
  <v-container fluid>
    <v-layout justify-center>
      <v-flex xs4>
        <v-card>
          <v-toolbar color="blue-grey" dense card>
            <v-toolbar-title class="white--text">NOVO PROCESSO</v-toolbar-title>
          </v-toolbar>
          <v-layout row wrap justify-space-around class="pa-2">
            <v-text-field v-bind:value="processoNumero" v-on:input="onNumeroInput" label="Número" class="px-2"></v-text-field>
            <v-text-field v-bind:value="processoAno" v-on:input="onAnoInput" label="Ano" class="px-2"></v-text-field>
          </v-layout>
          <v-layout row wrap justify-space-around class="pa-2">
            <v-text-field v-bind:value="processoNome" v-bind:disabled="!isNomeEditable" v-on:input="onNomeInput" label="Nome" class="pl-2"></v-text-field>
            <base-icon-button v-on:click="onEditButtonClick" v-bind:tooltip="nomeEditButtonTooltip" top class="pt-3 pr-4">{{ nomeEditButtonIcon }}</base-icon-button>
            <v-btn v-bind:disabled="!isSavable" v-on:click="onSaveButtonClick" large class="mt-1">Salvar</v-btn>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

import { CREATE_PROCESSO } from 'store/actions.type'
import { RESET_PROCESSO_STATE, RESET_WORKFLOW_STATE, SET_PROCESSO_ANO, SET_PROCESSO_NOME, SET_PROCESSO_NUMERO } from 'store/mutations.type'

import BaseIconButton from 'components/BaseIconButton'

export default {
  name: 'ViewProcessoNew',
  components: {
    BaseIconButton
  },
  data () {
    return {
      isNomeEditable: false
    }
  },
  computed: {
    ...mapGetters([
      'processoAno',
      'processoId',
      'processoNome',
      'processoNumero'
    ]),
    isSavable () {
      return this.processoAno && this.processoNome && this.processoNumero
    },
    nomeEditButtonIcon () {
      return (this.isNomeEditable) ? 'sync' : 'edit'
    },
    nomeEditButtonTooltip () {
      return (this.isNomeEditable) ? 'automatico' : 'manual'
    }
  },
  methods: {
    onEditButtonClick () {
      this.isNomeEditable = !this.isNomeEditable
      this.updateNome()
    },
    async onSaveButtonClick () {
      await this.$store.dispatch(CREATE_PROCESSO)
      this.$router.push({ name: 'editProcesso', params: { id: this.processoId } })
    },
    onAnoInput (ano) {
      this.$store.commit(SET_PROCESSO_ANO, ano)
      this.updateNome()
    },
    onNomeInput (nome) {
      this.$store.commit(SET_PROCESSO_NOME, nome)
    },
    onNumeroInput (numero) {
      this.$store.commit(SET_PROCESSO_NUMERO, numero)
      this.updateNome()
    },
    updateNome () {
      if (this.isNomeEditable)
        return

      if (this.processoNumero && this.processoAno)
        this.$store.commit(SET_PROCESSO_NOME, `${this.processoNumero}/${this.processoAno}`)
      else
        this.$store.commit(SET_PROCESSO_NOME, null)
    }
  },
  created () {
    this.$store.commit(RESET_PROCESSO_STATE)
    this.$store.commit(RESET_WORKFLOW_STATE)

    this.$store.commit(SET_PROCESSO_ANO, new Date().getFullYear().toString())
  }
}
</script>
