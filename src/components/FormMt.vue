<template>
  <v-container fluid class="pb-3">

    <!-- Dados do Processo  -->
    <v-divider></v-divider>
    <v-subheader>Dados do Processo</v-subheader>
    <v-layout row wrap class="pl-5">
      <v-flex xs5>
        <v-text-field hint="Trata-se de representação proposta por <b>[REPRESENTANTE]</b> ..." label="Representante" box></v-text-field>
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
          <v-flex xs7>
            <v-text-field label="Título" box></v-text-field>
          </v-flex>
          <v-tooltip top>
            <v-btn v-on:click="removeIrregularidade(index)" fab dark slot="activator" color="red">
              <v-icon dark>remove</v-icon>
            </v-btn>
            <span>Remover Irregularidade</span>
          </v-tooltip>
          <v-flex xs12>
            <v-textarea label="Base Legal" box auto-grow rows="1"></v-textarea>
          </v-flex>

          <!-- reponsaveis -->
          <v-expansion-panel expand class="elevation-0">
            <v-expansion-panel-content v-for="(responsavel, responsavelIndex) in irregularidade.responsaveis" v-bind:key="responsavelIndex" hide-actions class="custom-expansion-panel">
              <div slot="header">
                <v-divider></v-divider>
                <v-subheader>{{ responsavelIndex+1 }}° Responsável</v-subheader>
              </div>
              <v-layout row wrap class="pl-5">
                <v-flex xs7 class="pa-0"><v-text-field label="Responsável" box></v-text-field></v-flex>
                <v-tooltip top>
                  <v-btn v-on:click="removeResponsavel(index, responsavelIndex)" fab dark slot="activator" color="red">
                    <v-icon dark>remove</v-icon>
                  </v-btn>
                  <span>Remover Responsável</span>
                </v-tooltip>
                <v-flex xs12><v-textarea label="Conduta" box auto-grow rows="1"></v-textarea></v-flex>
                <v-flex xs12><v-textarea label="Nexo" box auto-grow rows="1"></v-textarea></v-flex>
                <v-flex xs12><v-textarea label="Culpabilidade" box auto-grow rows="1"></v-textarea></v-flex>
              </v-layout>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-tooltip top>
            <v-btn v-on:click="addResponsavel(index)" fab dark slot="activator" color="blue">
              <v-icon dark>add</v-icon>
            </v-btn>
            <span>Adicionar Responsável</span>
          </v-tooltip>

        </v-layout>
      </v-expansion-panel-content>

    </v-expansion-panel>

    <v-tooltip top>
      <v-btn v-on:click="addIrregularidade" fab dark slot="activator" color="indigo">
        <v-icon dark>add</v-icon>
      </v-btn>
      <span>Adicionar Irregularidade</span>
    </v-tooltip>

  </v-container>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'FormIti',
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
    removeIrregularidade (index) {
      this.irregularidades.splice(index, 1)
    },
    removeResponsavel (index, responsavelIndex) {
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
