<template>
  <v-container fluid>
    <v-divider></v-divider>
    <v-subheader>Dados do Processo</v-subheader>
    <v-layout row wrap class="pl-5">
      <v-flex xs2>
        <v-select v-bind:items="tiposProcessoItems" label="Tipo" box></v-select>
      </v-flex>
      <v-flex xs5>
        <v-text-field label="Representante" box></v-text-field>
      </v-flex>
    </v-layout>
    <v-divider inset class="mt-1"></v-divider>
    <v-subheader inset>Contrato</v-subheader>
    <v-layout row wrap class="pl-5">
      <v-flex xs4>
        <v-text-field label="Edital" box></v-text-field>
      </v-flex>
      <v-flex xs10>
        <v-text-field label="Objeto" box></v-text-field>
      </v-flex>
    </v-layout>
    <v-divider inset class="mt-1"></v-divider>
    <v-subheader inset>irregularidades</v-subheader>
    <v-layout row wrap class="pl-5">
      <v-flex v-for="(irregularidade, index) in irregularidadesInput" v-bind:key="index" xs7>
        <v-text-field
          v-model="irregularidade.value"
          v-on:click:append="removeIrregularidade(index)"
          v-bind:append-icon="(irregularidadesInput.length > 1) ? 'cancel' : null"
          label="Descrição da irregularidade" box
        ></v-text-field>
      </v-flex>
      <v-tooltip top>
        <v-btn v-on:click="addIrregularidade" fab dark slot="activator" color="indigo">
          <v-icon dark>add</v-icon>
        </v-btn>
        <span>Adicionar</span>
      </v-tooltip>
    </v-layout>
    <v-divider class="mt-3"></v-divider>
    <v-subheader>Dados da Manifestação Técnica</v-subheader>
    <v-layout row wrap class="pl-5">
      <v-flex xs12>
        <v-combobox v-model="auditoresInput" v-bind:items="auditoresItems" multiple hide-selected small-chips label="Auditores" box></v-combobox>
      </v-flex>
    </v-layout>
    <v-divider inset class="mt-1"></v-divider>
    <v-subheader inset>Requisitos de Admissibilidade</v-subheader>
    <v-layout column class="pl-5">
      <v-checkbox v-for="(admissibilidade, index) in admissibilidadeItems"
        v-model="admissibilidadeInput"
        v-bind:label="admissibilidade.text"
        v-bind:value="admissibilidade.value"
        v-bind:key="index"></v-checkbox>
    </v-layout>
    <v-divider inset class="mt-1"></v-divider>
    <v-subheader inset>Pressupostos</v-subheader>
    <v-layout row wrap class="pl-5">
      <v-flex xs4>
        <v-checkbox label="Presente 'fumus boni iuris'"></v-checkbox>
      </v-flex>
      <v-flex xs4>
        <v-select v-bind:items="periculumItems" label="Presente 'periculum in mora'" box></v-select>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import ApiService from 'services/api.service'

export default {
  name: 'FormMtp',
  data () {
    return {
      auditoresItems: [],
      tiposProcessoItems: [],
      admissibilidadeItems: [],
      periculumItems: [],

      auditoresInput: [],
      irregularidadesInput: [{ value: null }],
      admissibilidadeInput: []
    }
  },
  computed: {
    auditores () {
      return this.auditoresInput.map(a => a.value)
    },
    irregularidades () {
      return this.irregularidadesInput.map(i => i.value)
    }
  },
  methods: {
    addIrregularidade () {
      this.irregularidadesInput.push({ value: null })
    },
    removeIrregularidade (index) {
      this.irregularidadesInput.splice(index, 1)
    }
  },
  async created () {
    var auditoresApiResponse = await ApiService.get('/auditores')
    this.auditoresItems = auditoresApiResponse.map(a => { return { text: a.nome, value: a._id } })

    this.tiposProcessoItems = await ApiService.get('/processos/tipos')

    var admissibilidadeApiResponse = await ApiService.get('/criterioslegais/admissibilidade')
    this.admissibilidadeItems = admissibilidadeApiResponse.map(a => { return { text: a.descricao.presente, value: a._id } })

    this.periculumItems = await ApiService.get('/processos/Periculum/options')
  }
}
</script>
