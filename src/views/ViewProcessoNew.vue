<template>
  <v-form v-model="isFormValid">
    <v-container grid-list-lg fluid class="pa-4">
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
                <v-text-field v-model="numero" v-bind:disabled="isLoading" v-bind:rules="[NotBlank]" label="Número" hide-details required></v-text-field>
              </v-flex>
              <v-flex xs2>
                <v-text-field v-model="ano" v-bind:disabled="isLoading" v-bind:rules="[NotBlank]" label="Ano" hide-details required></v-text-field>
              </v-flex>
              <v-flex xs8>
                <v-text-field v-model="nome" v-bind:disabled="isNomeLocked || isLoading" v-bind:rules="[NotBlank]" label="Nome" hide-details required>
                </v-text-field>
              </v-flex>
              <v-flex class="pt-3" xs1>
                <base-icon-button v-on:click="toggleNomeEditMode" v-bind:disabled="isLoading" v-bind:tooltip="nomeEditModeButtonTooltip" top>
                  {{ nomeEditModeButtonIcon }}
                </base-icon-button>
              </v-flex>
              <v-flex xs4>
                <v-select v-model="tipo" v-bind:items="selectOptions.processoTipos" v-bind:rules="[NotBlank]" label="Tipo" hide-details required></v-select>
              </v-flex>
              <v-flex xs8>
                <v-text-field v-model="jurisdicionado" v-bind:disabled="isLoading" v-bind:rules="[NotBlank]" label="Jurisdicionado" hide-details required>
                </v-text-field>
              </v-flex>
            </v-layout>

            <!-- Dados do objeto -->
            <v-divider class="mt-4"></v-divider>
            <v-subheader>Objeto</v-subheader>
            <v-layout row wrap class="px-4">
              <v-flex xs4>
                <v-select v-model="objetoTipo" v-bind:items="selectOptions.objetoTipos" v-bind:rules="[NotBlank]" label="Tipo" hide-details required>
                </v-select>
              </v-flex>
              <v-flex xs8>
                <v-text-field v-model="objetoCodigo" v-bind:rules="[NotBlank]" label="Código" hide-details required>
                </v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-textarea v-model="objetoDescricao" v-bind:rules="[NotBlank]" label="Descrição" auto-grow rows="1" hide-details required>
                </v-textarea>
              </v-flex>
            </v-layout>

            <!-- Dados do requerente -->
            <v-divider class="mt-4"></v-divider>
            <v-subheader>Requerente</v-subheader>
            <v-layout row wrap class="px-4">
              <v-flex xs4>
                <v-select v-model="requerenteIsPessoaFisica" v-bind:items="selectOptions.requerenteTipos" v-bind:rules="[NotBlank]"
                label="Tipo" hide-details required></v-select>
              </v-flex>
              <v-flex xs8>
                <v-text-field v-model="requerenteNome" v-bind:rules="[NotBlank]" label="Nome" hide-details required></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout row wrap justify-end class="pr-4 pt-4 pb-2">
              <v-btn v-bind:disabled="!isSavable" v-on:click="saveProcesso" large class="mt-1">Salvar</v-btn>
            </v-layout>

          </v-card>
        </v-flex>
      </v-layout>
      <v-snackbar v-model="isNotifying" v-bind:timeout="5000" bottom right>Ocorreu um erro ao tentar salvar o processo</v-snackbar>
    </v-container>
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
