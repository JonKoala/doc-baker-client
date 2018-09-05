<template>
  <v-container fluid>
    <v-layout justify-center>
      <v-flex xs8>
        <v-card color="white">
          <v-toolbar color="blue-grey" dense card>
            <v-toolbar-title class="white--text">PROCESSOS</v-toolbar-title>
          </v-toolbar>
          <v-progress-linear v-show="isLoading" class="my-0" color="blue" indeterminate></v-progress-linear>
          <v-layout v-if="showResults" row justify-end class="pt-3 pb-5 pr-4">
            <v-flex xs4>
              <v-text-field v-model="search" append-icon="search" label="Busca" single-line hide-details></v-text-field>
            </v-flex>
          </v-layout>
          <v-data-table v-if="showResults" v-bind="{ headers, items, search }" hide-actions>
            <template slot="items" slot-scope="props">
              <tr v-on:click="showDetails(props.item)">
                <td>{{ props.item.nome }}</td>
                <td>{{ props.item.numero }}</td>
                <td>{{ props.item.ano }}</td>
              </tr>
            </template>
          </v-data-table>
          <v-alert v-model="isEmpty" class="my-0" color="warning" icon="priority_high">Nenhum processo encontrado</v-alert>
          <v-alert v-model="isError" class="my-0" color="error" icon="warning">Erro na busca dos processos</v-alert>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog v-model="dialog" width="30vw" scrollable>
      <v-card>
        <v-toolbar color="blue darken-2" dense card>
          <v-toolbar-title class="white--text">WORKFLOW</v-toolbar-title>
          <v-spacer></v-spacer>
          <base-icon-button v-bind:to="linkToEdit" color="white" tooltip="editar" top>edit</base-icon-button>
        </v-toolbar>
        <v-card-text ref="dialogContent" style="height:300px">
          <workflow-viewer v-if="processo.workflow.length > 0" v-bind:value="processo.workflow" class="pb-1"></workflow-viewer>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'

import { START_VIEW, SELECT_PROCESSO } from 'store/action.types'
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
        {text: 'NOME', value: 'nome'},
        {text: 'NÚMERO', value: 'numero'},
        {text: 'ANO', value: 'ano'}
      ]
    },
    isEmpty () {
      return !this.isLoading && !this.isError && this.items.length === 0
    },
    linkToEdit () {
      return `processo/${this.processo.id}`
    },
    showResults () {
      return !this.isLoading && !this.isError && !this.isEmpty
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
      await this.$store.dispatch(`${VIEW_HOME}/${START_VIEW}`)
    } catch (err) {
      this.isError = true
      console.log(err)
    }
  }
}
</script>
