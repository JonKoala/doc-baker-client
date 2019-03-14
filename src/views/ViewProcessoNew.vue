<template>
  <v-container grid-list-lg fluid>
    <v-layout justify-center>
      <v-flex xs5>
        <v-card>
          <v-toolbar color="blue-grey" dense card>
            <v-toolbar-title class="white--text">NOVO PROCESSO</v-toolbar-title>
          </v-toolbar>
          <v-progress-linear v-bind:active="isLoading" class="my-0" color="blue" indeterminate></v-progress-linear>

          <!-- Dados gerais -->
          <v-layout row wrap class="px-4">
            <v-flex xs6>
              <v-text-field v-model="numero" v-bind:disabled="isLoading" label="Número" hide-details></v-text-field>
            </v-flex>
            <v-flex xs2>
              <v-text-field v-model="ano" v-bind:disabled="isLoading" label="Ano" hide-details></v-text-field>
            </v-flex>
            <v-flex xs4>
              <v-select v-model="tipo" v-bind:items="selectOptions.processoTipos" label="Tipo" hide-details></v-select>
            </v-flex>
            <v-flex xs8>
              <v-text-field v-model="nome" v-bind:disabled="isNomeLocked || isLoading" label="Nome" hide-details></v-text-field>
            </v-flex>
            <v-flex class="pt-3" xs1>
              <base-icon-button v-on:click="toggleNomeEditMode" v-bind:disabled="isLoading" v-bind:tooltip="nomeEditModeButtonTooltip" top>
                {{ nomeEditModeButtonIcon }}
              </base-icon-button>
            </v-flex>
          </v-layout>

          <!-- Dados do objeto -->
          <v-divider class="mt-4"></v-divider>
          <v-subheader>Objeto</v-subheader>
          <v-layout row wrap class="px-4">
            <v-flex xs4>
              <v-select v-model="objetoTipo" v-bind:items="selectOptions.objetoTipos" label="Tipo" hide-details></v-select>
            </v-flex>
            <v-flex xs8>
              <v-text-field v-model="objetoCodigo" label="Código" hide-details>
              </v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-textarea v-model="objetoDescricao"  label="Descrição" auto-grow rows="1" hide-details>
              </v-textarea>
            </v-flex>
          </v-layout>

          <!-- Dados da representacao -->
          <v-divider class="mt-4"></v-divider>
          <v-subheader>Representante</v-subheader>
          <v-layout row wrap class="px-4">
            <v-flex xs4>
              <v-select v-model="representanteIsPessoaFisica" v-bind:items="selectOptions.representanteTipos" label="Tipo" hide-details></v-select>
            </v-flex>
            <v-flex xs8>
              <v-text-field v-model="representanteNome" label="Nome" hide-details></v-text-field>
            </v-flex>
          </v-layout>

          <v-layout row wrap justify-end class="pr-4 pt-4 pb-2">
            <v-btn v-bind:disabled="isLoading" v-on:click="saveProcesso" large class="mt-1">Salvar</v-btn>
          </v-layout>

        </v-card>
      </v-flex>
    </v-layout>
    <v-snackbar v-model="isNotifying" v-bind:timeout="5000" bottom right>Ocorreu um erro ao tentar salvar o processo</v-snackbar>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'

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
      'isNomeLocked',
      'selectOptions'
    ]),
    ...mapFields(`${VIEW_PROCESSO_NEW}/${PROCESSO}`, {
      objetoCodigo: 'objeto.codigo',
      objetoDescricao: 'objeto.descricao',
      objetoTipo: 'objeto.tipo',
      representanteNome: 'representante.nome',
      representanteIsPessoaFisica: 'representante.isPessoaFisica',
      tipo: 'tipo'
    }),
    numero: {
      get () { return this.$store.getters[`${VIEW_PROCESSO_NEW}/processoField`]('numero') },
      set (value) { this.$store.dispatch(`${VIEW_PROCESSO_NEW}/${CHANGE_NUMERO}`, value) }
    },
    ano: {
      get () {  return this.$store.getters[`${VIEW_PROCESSO_NEW}/processoField`]('ano') },
      set (value) { this.$store.dispatch(`${VIEW_PROCESSO_NEW}/${CHANGE_ANO}`, value) }
    },
    nome: {
      get () {  return this.$store.getters[`${VIEW_PROCESSO_NEW}/processoField`]('nome') },
      set (value) { this.$store.dispatch(`${VIEW_PROCESSO_NEW}/${CHANGE_NOME}`, value) }
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
        await this.$store.dispatch(`${VIEW_PROCESSO_NEW}/${SAVE_PROCESSO}`)
        this.$router.push({ name: 'editProcesso', params: { id: this.$store.getters[`${VIEW_PROCESSO_NEW}/processoField`]('id') } })
      } catch (err) {
        this.isNotifying = true
        console.log(err)
      }
    },
    toggleNomeEditMode () {
      this.$store.dispatch(`${VIEW_PROCESSO_NEW}/${TOGGLE_NOME_LOCKING}`)
    }
  },
  created () {
    this.$store.dispatch(`${VIEW_PROCESSO_NEW}/${START_VIEW}`)
  }
}
</script>
