<template>
  <v-container fluid>
    <v-layout justify-center>
      <v-flex xs4>
        <v-card>
          <v-toolbar color="blue-grey" dense card>
            <v-toolbar-title class="white--text">NOVO PROCESSO</v-toolbar-title>
          </v-toolbar>
          <v-layout row wrap justify-space-around class="pa-2">
            <v-text-field v-bind:value="processoNumero" v-on:input="updateNumero" label="Número" class="px-2"></v-text-field>
            <v-text-field v-bind:value="processoAno" v-on:input="updateAno" label="Ano" class="px-2"></v-text-field>
          </v-layout>
          <v-layout row wrap justify-space-around class="pa-2">
            <v-text-field v-bind:value="processoNome" v-bind:disabled="!isNomeEditable" v-on:input="updateNome" label="Nome" class="pl-2"></v-text-field>
            <base-icon-button v-on:click="toggleNomeEditMode" v-bind:tooltip="nomeEditModeButtonTooltip" top class="pt-3 pr-4">
              {{ nomeEditModeButtonIcon }}
            </base-icon-button>
            <v-btn v-bind:disabled="!isSavable" v-on:click="saveProcesso" large class="mt-1">Salvar</v-btn>
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
    nomeEditModeButtonIcon () {
      return (this.isNomeEditable) ? 'sync' : 'edit'
    },
    nomeEditModeButtonTooltip () {
      return (this.isNomeEditable) ? 'automatico' : 'manual'
    }
  },
  methods: {
    autoUpdateNome () {
      if (this.isNomeEditable)
        return

      if (this.processoNumero && this.processoAno)
        this.updateNome(`${this.processoNumero}/${this.processoAno}`)
      else
        this.updateNome(null)
    },
    async saveProcesso () {
      await this.$store.dispatch(CREATE_PROCESSO)
      this.$router.push({ name: 'editProcesso', params: { id: this.processoId } })
    },
    toggleNomeEditMode () {
      this.isNomeEditable = !this.isNomeEditable
      this.autoUpdateNome()
    },
    updateAno (ano) {
      this.$store.commit(SET_PROCESSO_ANO, ano)
      this.autoUpdateNome()
    },
    updateNome (nome) {
      this.$store.commit(SET_PROCESSO_NOME, nome)
    },
    updateNumero (numero) {
      this.$store.commit(SET_PROCESSO_NUMERO, numero)
      this.autoUpdateNome()
    }
  },
  created () {
    this.$store.commit(RESET_PROCESSO_STATE)
    this.$store.commit(RESET_WORKFLOW_STATE)

    this.$store.commit(SET_PROCESSO_ANO, new Date().getFullYear().toString())
  }
}
</script>
