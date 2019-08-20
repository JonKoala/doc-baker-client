<template>
  <v-container fluid>

    <v-row justify="center" align="center" dense>
      <v-col cols="8">
        <v-card>

          <v-toolbar color="blue-grey" class="white--text" dense flat>
            <v-toolbar-title>PROCESSOS</v-toolbar-title>
          </v-toolbar>

          <v-progress-linear v-bind:active="isLoading" height="6" color="blue" indeterminate></v-progress-linear>
          <v-row justify="end" align="end" dense class="my-3 mr-1">
            <v-col cols="4">
              <v-text-field v-model="search" append-icon="search" label="Busca" single-line hide-details></v-text-field>
            </v-col>
          </v-row>

          <v-data-table id="processos-table" v-bind="{ headers, items, search }" v-on:click:row="showDetails" hide-default-footer>
            <template v-slot:no-data>
              <v-alert class="my-0" v-bind="{ ...tableAlert }" tile>{{ tableAlert.message }}</v-alert>
            </template>
            <template v-slot:no-results>
              <v-alert class="my-0" v-bind="{ ...tableAlert }" tile>{{ tableAlert.message }}</v-alert>
            </template>
          </v-data-table>

        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" width="30vw" scrollable>
      <v-card>
        
        <v-toolbar color="blue darken-2" class="white--text" dense flat>
          <v-toolbar-title>WORKFLOW</v-toolbar-title>
          <v-spacer></v-spacer>
          <base-icon-button v-bind:to="linkToEdit" color="white" tooltip="editar" top>edit</base-icon-button>
        </v-toolbar>

        <v-card-text ref="dialogContent" style="height:300px">
          <workflow-viewer v-if="processo.workflow.length > 0" v-bind:value="processo.workflow"></workflow-viewer>
        </v-card-text>

      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'

import { START, SELECT_PROCESSO } from 'store/action.types'
import { SET_SEARCH } from 'store/mutation.types'
import { VIEW_HOME } from 'store/namespaces'

import BaseIconButton from 'components/BaseIconButton'
import WorkflowViewer from 'components/WorkflowViewer'

export default {
  name: 'ViewHome',
  components: {
    BaseIconButton,
    WorkflowViewer
  },
  data () {
    return {
      dialog: false,
      isError: false
    }
  },
  computed: {
    ...mapGetters(VIEW_HOME, [
      'isLoading',
      'items',
      'processo'
    ]),
    search: {
      get () { return this.$store.getters[`${VIEW_HOME}/search`] },
      set (value) { return this.$store.commit(`${VIEW_HOME}/${SET_SEARCH}`, value) }
    },
    headers () {
      return [
        { text: 'NOME', value: 'nome' },
        { text: 'NÚMERO', value: 'numero' },
        { text: 'ANO', value: 'ano' }
      ]
    },
    linkToEdit () {
      return `processo/${this.processo.id}`
    },
    tableAlert () {
      if (this.isLoading)
        return { type: 'info', icon: 'search', message: 'Buscando processos...' }
      else if (this.isError)
        return { type: 'error', icon: 'error', message: 'Erro na busca dos processos' }
      return { type: 'warning', icon: 'info', message: 'Nenhum processo encontrado' }
    }
  },
  methods: {
    async showDetails (item) {
      this.$store.dispatch(`${VIEW_HOME}/${SELECT_PROCESSO}`, item)
      this.dialog = true

      await Vue.nextTick()
      this.$refs.dialogContent.scrollTo(0, this.$refs.dialogContent.scrollHeight)
    }
  },
  async created () {
    try {
      await this.$store.dispatch(`${VIEW_HOME}/${START}`)
    } catch (err) {
      this.isError = true
      console.log(err)
    }
  }
}
</script>

<style scoped>

  #processos-table >>> .v-data-table__empty-wrapper td {
    padding: 0px !important
  }

</style>
