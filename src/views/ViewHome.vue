<template>
  <v-container fluid>
    <v-layout justify-center>
      <v-flex xs8>
        <v-card color="white">
          <v-toolbar color="blue-grey" dense card>
            <v-toolbar-title class="white--text">PROCESSOS</v-toolbar-title>
          </v-toolbar>
          <v-layout row justify-end class="pt-3 pb-5 pr-4">
            <v-flex xs4>
              <v-text-field v-model="search" append-icon="search" label="Busca" single-line hide-details></v-text-field>
            </v-flex>
          </v-layout>
          <v-data-table v-bind="{ headers, items, search }" hide-actions>
            <template slot="items" slot-scope="props">
              <tr v-on:click="showDetails(props.item)">
                <td>{{ props.item.nome }}</td>
                <td>{{ props.item.numero }}</td>
                <td>{{ props.item.ano }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog v-model="dialog" width="30vw" scrollable>
      <v-card>
        <v-toolbar color="blue darken-2" dense card>
          <v-toolbar-title class="white--text">WORKFLOW</v-toolbar-title>
          <v-spacer></v-spacer>
          <base-icon-button v-bind:href="linkToEdit" target="_blank" color="white" tooltip="editar" top>edit</base-icon-button>
        </v-toolbar>
        <v-card-text style="height:300px">
          <workflow-viewer v-if="dialogProcessoWorkflow.length > 0" v-bind:value="dialogProcessoWorkflow" class="pb-1"></workflow-viewer>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import ApiService from 'services/api.service'

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
      headers: [
        {text: 'NOME', value: 'nome'},
        {text: 'NÚMERO', value: 'numero'},
        {text: 'ANO', value: 'ano'}
      ],
      items: [],
      search: null,

      dialog: false,
      dialogProcessoId: null,
      dialogProcessoWorkflow: []
    }
  },
  computed: {
    linkToEdit () {
      return `processo/${this.dialogProcessoId}`
    }
  },
  methods: {
    showDetails (item) {
      this.dialogProcessoId = item._id
      this.dialogProcessoWorkflow = item.workflow
      this.dialog = true
    }
  },
  async created () {
    this.items = await ApiService.get('processos')
  }
}
</script>
