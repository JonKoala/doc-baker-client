<template>
  <v-container grid-list-lg fluid class="py-4">

    <v-divider></v-divider>
    <v-subheader>irregularidades</v-subheader>
    <v-layout row wrap class="pl-5">
      <v-flex v-for="(irregularidade, index) in irregularidades" v-bind:key="index" xs8>
        <v-text-field
          v-model="irregularidade.text"
          v-on:click:append="removeIrregularidade(index)"
          v-bind:append-icon="(irregularidades.length > 1) ? 'cancel' : null"
          label="Descrição da irregularidade" hide-details box
        ></v-text-field>
      </v-flex>
      <base-icon-button v-on:click="addIrregularidade" slot="activator" tooltip="Adicionar" color="indigo" class="mt-2" top fab dark>add</base-icon-button>
    </v-layout>

    <template v-if="showRequisitos">
      <v-divider class="mt-4"></v-divider>
      <v-subheader>Requisitos de Admissibilidade</v-subheader>
      <v-layout column class="pl-5">
        <v-checkbox v-for="admissibilidade in selectOptions.requisitosAdmissibilidade"
          v-model="requisitosPresentes"
          v-bind:label="admissibilidade.text"
          v-bind:value="admissibilidade.value"
          v-bind:key="admissibilidade.value"
          color="blue darken-2" hide-details></v-checkbox>
      </v-layout>
    </template>

    <template v-if="showPressupostos">
      <v-divider class="mt-4"></v-divider>
      <v-subheader>Pressupostos Cautelares</v-subheader>
      <v-layout row wrap class="pl-5">
        <v-flex xs3>
          <v-checkbox v-model="presenteFumus" label="fumus boni iuris" class="italic-label" color="blue darken-2" hide-details></v-checkbox>
        </v-flex>
        <v-flex xs4>
          <v-select v-model="presentePericulum" v-bind:items="selectOptions.periculum" label="periculum in mora" class="italic-label" hide-details box>
          </v-select>
        </v-flex>
      </v-layout>
    </template>

    <v-divider class="mt-4"></v-divider>
    <v-subheader>Auditores</v-subheader>
    <v-layout row wrap class="pl-5">
      <v-flex xs12>
        <v-combobox v-model="auditores" v-bind:items="selectOptions.auditores" multiple  label="Nomes" hide-selected small-chips hide-details box></v-combobox>
      </v-flex>
    </v-layout>

    <v-divider inset class="my-4"></v-divider>
    <v-layout justify-end row wrap class="pl-5">
      <v-btn v-on:click="createDoc" v-bind:disabled="isLoading" v-bind:loading="isLoading">GERAR DOC</v-btn>
      <v-btn v-on:click="saveData" v-bind:disabled="isLoading" v-bind:loading="isLoading">SALVAR</v-btn>
    </v-layout>

    <v-snackbar v-model="isNotifying" v-bind:timeout="3000" bottom>{{ noteMessage }}</v-snackbar>

  </v-container>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { mapFields, mapMultiRowFields } from 'vuex-map-fields'

import { FORM_MTP, MTP } from 'store/namespaces'
import { SAVE, START } from 'store/action.types'
import { PUSH_IRREGULARIDADE, REMOVE_IRREGULARIDADE } from 'store/mutation.types'

import BaseIconButton from 'components/BaseIconButton'

export default {
  name: 'FormMtp',
  components: {
    BaseIconButton
  },
  data () {
    return {
      isNotifying: false,
      noteMessage: null
    }
  },
  computed: {
    ...mapFields(`${FORM_MTP}/${MTP}`, [
      'auditores',
      'pressupostos.presenteFumus',
      'pressupostos.presentePericulum',
      'requisitosPresentes'
    ]),
    ...mapGetters(`${FORM_MTP}`, [
      'paramId',
      'form',
      'isLoading',
      'processoField'
    ]),
    ...mapMultiRowFields(`${FORM_MTP}/${MTP}`, [
      'irregularidades'
    ]),
    bakingLink () {
      return `${process.env['DOCBAKER_API_URL']}/bakery/bake?template=MTP&processo=${this.paramId}`
    },
    selectOptions () {
      var options = this.$store.getters[`${FORM_MTP}/selectOptions`]

      var incisoToIgnore = (this.processoField('requerente.isPessoaFisica')) ? 'V' : 'IV'
      return {
        requisitosAdmissibilidade: options.requisitosAdmissibilidade
          .filter(r => r.inciso != incisoToIgnore)
          .map(r => { return { text: r.inciso + ' - ' + r.descricao.generico, value: r._id } }),
        auditores: options.auditores.map(a => { return { text: a.nome, value: a._id } }),
        periculum: options.periculum
      }
    },
    showRequisitos () {
      return ['f-mtp-1', 'f-mtp-3'].includes(this.form)
    },
    showPressupostos () {
      return ['f-mtp-1', 'f-mtp-2'].includes(this.form)
    }
  },
  methods: {
    ...mapMutations(`${FORM_MTP}/${MTP}`, {
      addIrregularidade: PUSH_IRREGULARIDADE,
      removeIrregularidade: REMOVE_IRREGULARIDADE
    }),
    async createDoc () {
      if (await this.saveData())
        window.location.href = this.bakingLink
    },
    saveData () {
      return this.$store.dispatch(`${FORM_MTP}/${SAVE}`)
      .then(() => {
        this.noteMessage = 'Formulário salvo com sucesso!'
        return true
      }).catch(err => {
        this.noteMessage = 'Ocorreu um erro ao tentar salvar o processo'
        console.log(`${err.response.data.type}: ${err.response.data.message}`)
        return false
      }).finally(() => {
        this.isNotifying = true
      })
    },
  },
  created () {
    this.$store.dispatch(`${FORM_MTP}/${START}`)
  }
}
</script>

<style scoped>

  .italic-label >>> .v-label {
    font-style: italic;
    padding-right: 10px;
  }

</style>
