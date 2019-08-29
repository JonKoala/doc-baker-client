<template>
  <v-container fluid class="pb-3">

    <!-- Dados do Processo  -->
    <v-divider></v-divider>
    <v-subheader>Dados do Processo</v-subheader>
    <v-layout row wrap class="pl-5">
      <v-flex xs5>
        <v-text-field hint="Trata-se de representação proposta por <b>[REPRESENTANTE]</b> ..." label="Representante" filled></v-text-field>
      </v-flex>
    </v-layout>

    <!-- irregularidades -->
    <v-expansion-panel expand class="elevation-0">

      <v-expansion-panel-content v-for="(irregularidade, index) in irregularidades" v-bind:key="index" hide-actions class="custom-expansion-panel">
        <div slot="header">
          <v-divider></v-divider>
          <v-subheader>{{ index+1 }}ª Irregularidade</v-subheader>
        </div>
        <v-layout row wrap class="pl-5">
          <v-flex xs7><v-text-field label="Título" filled></v-text-field></v-flex>
          <base-icon-button v-on:click="removeIrregularidade(index)" slot="activator"
          tooltip="Remover Irregularidade" color="red" class="ma-2 mt-1" top fab dark small>remove</base-icon-button>
          <v-flex xs12><v-textarea label="Base Legal" filled auto-grow rows="1"></v-textarea></v-flex>

          <!-- reponsaveis -->
          <v-expansion-panel expand class="elevation-0">
            <v-expansion-panel-content v-for="(responsavel, responsavelIndex) in irregularidade.responsaveis" v-bind:key="responsavelIndex" hide-actions class="custom-expansion-panel">
              <div slot="header">
                <v-divider></v-divider>
                <v-subheader>{{ responsavelIndex+1 }}° Responsável</v-subheader>
              </div>
              <v-layout row wrap class="pl-5">
                <v-flex xs7><v-text-field label="Responsável" filled></v-text-field></v-flex>
                <base-icon-button v-on:click="removeResponsavel(index, responsavelIndex)" slot="activator"
                tooltip="Remover Responsável" color="red" class="ma-2" top fab dark small>remove</base-icon-button>

                <v-flex xs12><v-textarea label="Conduta" filled auto-grow rows="1"></v-textarea></v-flex>
                <v-flex xs12><v-textarea label="Nexo" filled auto-grow rows="1"></v-textarea></v-flex>
                <v-flex xs12><v-textarea label="Culpabilidade" filled auto-grow rows="1"></v-textarea></v-flex>
              </v-layout>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <base-icon-button v-on:click="addResponsavel(index)" slot="activator" tooltip="Adicionar Responsável" color="blue" top fab dark>add</base-icon-button>

        </v-layout>
      </v-expansion-panel-content>

    </v-expansion-panel>

    <base-icon-button v-on:click="addIrregularidade" slot="activator" tooltip="Adicionar Irregularidade" color="indigo" top fab dark>add</base-icon-button>

    <base-confirm-dialog ref="confirm"></base-confirm-dialog>
  </v-container>
</template>

<script>
import Vue from 'vue'

import BaseConfirmDialog from 'components/BaseConfirmDialog'
import BaseIconButton from 'components/BaseIconButton'

export default {
  name: 'FormMt',
  components: {
    BaseConfirmDialog,
    BaseIconButton
  },
  data () {
    return {
      irregularidades: [{ responsaveis: [] }]
    }
  },
  methods: {
    addIrregularidade () {
      this.irregularidades.push({ responsaveis: [] })
    },
    addResponsavel (index) {
      this.irregularidades[index].responsaveis.push({ })
    },
    async removeIrregularidade (index) {
      if (await this.$refs.confirm.open('Remover Irregularidade', 'Tem certeza de que deseja remover esta irregularidade?', { color: 'red' }))
        this.irregularidades.splice(index, 1)
    },
    async removeResponsavel (index, responsavelIndex) {
      if (await this.$refs.confirm.open('Remover Responsável', 'Tem certeza de que deseja remover este responsável?', { color: 'red' }))
        this.irregularidades[index].responsaveis.splice(responsavelIndex, 1)
    }
  }
}
</script>

<style scoped>

  .custom-expansion-panel {
    border-top: none !important;
  }

  .custom-expansion-panel >>> .v-expansion-panel__header {
    padding-left: 0px;
  }

</style>
