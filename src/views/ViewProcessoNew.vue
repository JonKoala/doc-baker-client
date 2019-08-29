<template>
  <v-form v-model="isFormValid">

    <v-container fluid>
      <v-row justify="center" align="center" dense>
        <v-col cols="6">
          <v-card>

            <v-toolbar color="blue-grey" class="white--text" dense flat>
              <v-toolbar-title>NOVO PROCESSO</v-toolbar-title>
            </v-toolbar>
            <v-progress-linear v-bind:active="isLoading" height="6" color="blue" indeterminate></v-progress-linear>

            <!-- Dados gerais -->
            <v-row class="mx-2">
              <v-col cols="6">
                <v-text-field v-model="numero" v-bind:disabled="isLoading" v-bind:rules="[NotBlank]" label="Número" hide-details></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field v-model="ano" v-bind:disabled="isLoading" v-bind:rules="[NotBlank]" label="Ano" hide-details></v-text-field>
              </v-col>
              <v-col cols="8">
                <v-text-field v-model="nome" v-bind:disabled="isNomeLocked || isLoading" v-bind:rules="[NotBlank]" label="Nome" hide-details></v-text-field>
              </v-col>
              <v-col class="pa-0" cols="1">
                <base-icon-button class="mt-8" v-on:click="toggleNomeEditMode" v-bind:disabled="isLoading" v-bind:tooltip="nomeEditModeButtonTooltip" top>
                  {{ nomeEditModeButtonIcon }}
                </base-icon-button>
              </v-col>
              <v-col cols="4">
                <v-select v-model="tipo" v-bind:items="selectOptions.processoTipos" v-bind:rules="[NotBlank]" label="Tipo" hide-details></v-select>
              </v-col>
              <v-col cols="8">
                <v-text-field v-model="jurisdicionado" v-bind:disabled="isLoading" v-bind:rules="[NotBlank]" label="Jurisdicionado" hide-details></v-text-field>
              </v-col>
            </v-row>

            <!-- Dados do objeto -->
            <v-divider class="mt-4"></v-divider>
            <v-subheader>Objeto</v-subheader>
            <v-row class="mx-2">
              <v-col cols="4">
                <v-select v-model="objetoTipo" v-bind:items="selectOptions.objetoTipos" v-bind:rules="[NotBlank]" label="Tipo" hide-details></v-select>
              </v-col>
              <v-col cols="8">
                <v-text-field v-model="objetoCodigo" v-bind:rules="[NotBlank]" label="Código" hide-details></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="objetoDescricao" v-bind:rules="[NotBlank]" label="Descrição" auto-grow rows="1" hide-details></v-textarea>
              </v-col>
            </v-row>

            <!-- Dados do requerente -->
            <v-divider class="mt-4"></v-divider>
            <v-subheader>Requerente</v-subheader>
            <v-row class="mx-2">
              <v-col cols="4">
                <v-select v-model="requerenteIsPessoaFisica" v-bind:items="selectOptions.requerenteTipos" label="Tipo" hide-details></v-select>
              </v-col>
              <v-col cols="8">
                <v-text-field v-model="requerenteNome" v-bind:rules="[NotBlank]" label="Nome" hide-details></v-text-field>
              </v-col>
            </v-row>

            <v-row justify="end" class="mx-2 pt-4 pb-2">
              <v-btn v-bind:disabled="!isSavable" v-on:click="saveProcesso" class="mr-2" large>Salvar</v-btn>
            </v-row>

          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-snackbar v-model="isNotifying" bottom right>Ocorreu um erro ao tentar salvar o processo...</v-snackbar>

  </v-form>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import { VIEW_PROCESSO_NEW, PROCESSO } from 'store/namespaces'
import { CHANGE_ANO, CHANGE_NOME, CHANGE_NUMERO, SAVE, START, TOGGLE_NOME_LOCKING } from 'store/action.types'

import { NotBlank } from 'services/form.rules'

import BaseIconButton from 'components/BaseIconButton'

export default {
  name: 'ViewProcessoNew',
  components: {
    BaseIconButton
  },
  data () {
    return {
      NotBlank,

      isFormValid: false,
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
      jurisdicionado: 'jurisdicionado',
      objetoCodigo: 'objeto.codigo',
      objetoDescricao: 'objeto.descricao',
      objetoTipo: 'objeto.tipo',
      requerenteNome: 'requerente.nome',
      requerenteIsPessoaFisica: 'requerente.isPessoaFisica',
      tipo: 'tipo'
    }),
    numero: {
      get () { return this.$store.getters[`${VIEW_PROCESSO_NEW}/processoField`]('numero') },
      set (value) { this.$store.dispatch(`${VIEW_PROCESSO_NEW}/${CHANGE_NUMERO}`, value) }
    },
    ano: {
      get () { return this.$store.getters[`${VIEW_PROCESSO_NEW}/processoField`]('ano') },
      set (value) { this.$store.dispatch(`${VIEW_PROCESSO_NEW}/${CHANGE_ANO}`, value) }
    },
    nome: {
      get () { return this.$store.getters[`${VIEW_PROCESSO_NEW}/processoField`]('nome') },
      set (value) { this.$store.dispatch(`${VIEW_PROCESSO_NEW}/${CHANGE_NOME}`, value) }
    },
    isSavable () {
      return !this.isLoading && this.isFormValid
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
      if (this.isSavable)
        try {
          await this.$store.dispatch(`${VIEW_PROCESSO_NEW}/${SAVE}`)
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
    this.$store.dispatch(`${VIEW_PROCESSO_NEW}/${START}`)
  }
}
</script>
