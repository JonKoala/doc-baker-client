<template>
  <v-form v-model="isFormValid">

    <v-container fluid>

      <v-subheader>Irregularidades</v-subheader>
      <v-row class="ml-0">
        <v-col v-for="(irregularidade, index) in irregularidades" v-bind:key="index" cols="8">
          <v-text-field
            v-model="irregularidade.text" v-bind:rules="[NotBlank]"
            v-on:click:append="removeIrregularidade(index)"
            v-bind:append-icon="(irregularidades.length > 1) ? 'cancel' : null"
            label="Descrição da irregularidade" hide-details filled>
          </v-text-field>
        </v-col>
        <base-icon-button v-on:click="addIrregularidade" tooltip="Adicionar" color="indigo" class="mt-2" top fab dark>add</base-icon-button>
      </v-row>

      <template v-if="showAdmissibilidade">
        <v-divider class="mt-4"></v-divider>
        <v-subheader>Requisitos de Admissibilidade</v-subheader>
        <v-checkbox v-for="admissibilidade in selectOptions.admissibilidade"
          v-model="requisitosPresentes"
          v-bind:label="admissibilidade.text"
          v-bind:value="admissibilidade.value"
          v-bind:key="admissibilidade.value"
          color="blue darken-2" class="pl-4" multiple hide-details>
        </v-checkbox>
      </template>

      <template v-if="showCautelar">
        <v-divider class="mt-5"></v-divider>
        <v-subheader>Pressupostos Cautelares</v-subheader>
        <v-row class="ml-0">
          <v-col cols="3" class="pl-4">
            <v-checkbox v-model="presenteFumus" label="fumus boni iuris" class="italic-label" color="blue darken-2" hide-details></v-checkbox>
          </v-col>
          <v-col cols="3">
            <v-select v-model="presentePericulum" v-bind:rules="[NotBlank]"
              v-bind:items="selectOptions.periculum"
              label="periculum in mora" class="italic-label" hide-details filled>
            </v-select>
          </v-col>
        </v-row>
      </template>

      <v-divider class="mt-4"></v-divider>
      <v-subheader>Auditores</v-subheader>
      <v-autocomplete v-model="auditores" v-bind:rules="[NotEmpty]"
        v-bind:items="selectOptions.auditores" multiple
        label="Nomes" no-data-text="Auditor não encontrado" class="pl-4" hide-details filled>
      </v-autocomplete>

      <v-row justify="end" class="pt-8 mx-0">
        <v-btn v-on:click="createDoc" v-bind:disabled="!isBakeable" v-bind:loading="isLoading">GERAR DOC</v-btn>
        <v-btn v-on:click="saveData" v-bind:disabled="isLoading" v-bind:loading="isLoading" class="mx-5">SALVAR</v-btn>
      </v-row>

    </v-container>

    <v-snackbar v-model="isNotifying" v-bind:timeout="3000" bottom>{{ noteMessage }}</v-snackbar>

  </v-form>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { mapFields, mapMultiRowFields } from 'vuex-map-fields'

import { FORM_MTP, MTP } from 'store/namespaces'
import { SAVE, START } from 'store/action.types'
import { PUSH_IRREGULARIDADE, REMOVE_IRREGULARIDADE } from 'store/mutation.types'

import { NotBlank, NotEmpty } from 'services/form.rules'

import BaseIconButton from 'components/BaseIconButton'

export default {
  name: 'FormMtp',
  components: {
    BaseIconButton
  },
  data () {
    return {
      test: [],
      NotBlank,
      NotEmpty,

      isFormValid: false,
      isNotifying: false,
      noteMessage: null
    }
  },
  computed: {
    ...mapFields(`${FORM_MTP}/${MTP}`, [
      'auditores',
      'cautelar.presenteFumus',
      'cautelar.presentePericulum',
      'admissibilidade.requisitosPresentes'
    ]),
    ...mapGetters(FORM_MTP, [
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
    isBakeable () {
      return !this.isLoading && this.isFormValid
    },
    selectOptions () {
      var options = this.$store.getters[`${FORM_MTP}/selectOptions`]

      var incisoToIgnore = (this.processoField('requerente.isPessoaFisica')) ? 'V' : 'IV'
      return {
        admissibilidade: options.admissibilidade
          .filter(r => r.inciso != incisoToIgnore)
          .map(r => { return { text: r.inciso + ' - ' + r.descricao.generico, value: r._id } }),
        auditores: options.auditores.map(a => { return { text: a.nome, value: a._id } }),
        periculum: options.periculum
      }
    },
    showAdmissibilidade () {
      return ['f-mtp-1', 'f-mtp-3'].includes(this.form)
    },
    showCautelar () {
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
        this.noteMessage = 'Ocorreu um erro ao tentar salvar o processo...'
        console.log(`${err.response.data.type}: ${err.response.data.message}`)
        return false
      }).finally(() => {
        this.isNotifying = true
      })
    }
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
