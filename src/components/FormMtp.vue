<template>
  <v-container fluid class="pb-3">

    <!-- Dados do Processo  -->
    <v-divider></v-divider>
    <v-subheader>Dados do Processo</v-subheader>
    <v-layout row wrap class="pl-5">
      <v-flex xs2>
        <v-select v-model="tipo" v-bind:items="listTipo" label="Tipo" box></v-select>
      </v-flex>
      <v-flex xs4>
        <v-text-field v-model="editalContrato" hint="... o <b>[EDITAL/CONTRATO]</b> conteria os seguintes vícios ..." label="Edital/Contrato" box></v-text-field>
      </v-flex>
      <v-flex xs10>
        <v-text-field v-model="objeto" hint="... o objeto refere-se a <b>[OBJETO]</b> ..." label="Objeto" box></v-text-field>
      </v-flex>
      <v-flex xs5>
        <v-text-field v-model="representanteNome" hint="Trata-se de representação proposta por <b>[REPRESENTANTE]</b> ..." label="Representante" box></v-text-field>
      </v-flex>
      <v-flex xs2>
        <v-select v-model="representanteIsPessoaFisica" v-bind:items="listTipoPessoa" label="Pessoa" box></v-select>
      </v-flex>
    </v-layout>

    <!-- Dados do Processo - irregularidades -->
    <v-divider inset class="mt-1"></v-divider>
    <v-subheader inset>irregularidades</v-subheader>
    <v-layout row wrap class="pl-5">
      <v-flex v-for="(irregularidade, index) in irregularidades" v-bind:key="index" xs7>
        <v-text-field
          v-bind:value="irregularidade"
          v-on:input="setIrregularidade({ index, titulo: $event })"
          v-on:click:append="removeIrregularidade(index)"
          v-bind:append-icon="(irregularidades.length > 1) ? 'cancel' : null"
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


    <!-- Dados da Manifestação Técnica -->
    <v-divider class="mt-3"></v-divider>
    <v-subheader>Dados da Manifestação Técnica</v-subheader>
    <v-layout row wrap class="pl-5">
      <v-flex xs12>
        <v-combobox v-model="auditores" v-bind:items="listAuditor" multiple hide-selected small-chips label="Auditores" box></v-combobox>
      </v-flex>
    </v-layout>

    <!-- Dados da Manifestação Técnica - Requisitos de Admissibilidade -->
    <template v-if="showRequisitos">
      <v-divider inset class="mt-1"></v-divider>
      <v-subheader inset>Requisitos de Admissibilidade</v-subheader>
      <v-layout column class="pl-5">
        <v-checkbox v-for="admissibilidade in filteredListAdmissibilidade"
          v-model="requisitosAdmissibilidade"
          v-bind:label="admissibilidade.text"
          v-bind:value="admissibilidade.value"
          v-bind:key="admissibilidade.value"
          color="blue darken-2"></v-checkbox>
      </v-layout>
    </template>

    <!-- Dados da Manifestação Técnica - Pressupostos -->
    <template v-if="showPressupostos">
      <v-divider inset class="mt-1"></v-divider>
      <v-subheader inset>Pressupostos</v-subheader>
      <v-layout row wrap class="pl-5">
        <v-flex xs3>
          <v-checkbox v-model="fumusBoniIuris" label="fumus boni iuris" class="italic-label" color="blue darken-2"></v-checkbox>
        </v-flex>
        <v-flex xs4>
          <v-select v-model="periculumInMora" v-bind:items="listPericulum" label="periculum in mora " class="italic-label" box></v-select>
        </v-flex>
      </v-layout>
    </template>

    <v-divider class="my-3"></v-divider>
    <v-layout justify-end row wrap class="pl-5">
      <v-btn v-bind:href="bakingLink">GERAR DOC</v-btn>
      <v-btn v-on:click="saveForm" v-bind:disabled="isLoading" v-bind:loading="isLoading">SALVAR</v-btn>
    </v-layout>

    <v-snackbar v-model="isNotifying" v-bind:timeout="3000" bottom>{{ noteMessage }}</v-snackbar>

  </v-container>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

import ApiService from 'services/api.service'

import { FORM_MTP, MTP, IRREGULARIDADES, PROCESSO } from 'store/namespaces'
import { SAVE_MTP, START_VIEW } from 'store/action.types'
import {
  PUSH_IRREGULARIDADE, REMOVE_IRREGULARIDADE, SET_AUDITORES, SET_PRESENTE_FUMUS, SET_PRESENTE_PERICULUM, SET_IRREGULARIDADE_TITULO,
  SET_OBJETO_CODIGO, SET_OBJETO_DESCRICAO, SET_REPRESENTANTE_NOME, SET_REPRESENTANTE_PESSOA_FISICA, SET_REQUISITOS_PRESENTES, SET_TIPO
} from 'store/mutation.types'

export default {
  name: 'FormMtp',
  data () {
    return {
      listTipo: [],
      listTipoPessoa: [{ text: 'Física', value: true }, { text: 'Jurídica', value: false }],
      listAuditor: [],
      listAdmissibilidade: [],
      listPericulum: [],

      isNotifying: false,
      noteMessage: null
    }
  },
  computed: {
    ...mapGetters(`${FORM_MTP}`, [
      'paramId',
      'form',
      'isLoading'
    ]),
    ...mapGetters(`${FORM_MTP}/${IRREGULARIDADES}`, {
      irregularidades: 'titulos'
    }),
    tipo: {
      get () { return this.$store.getters[`${FORM_MTP}/${PROCESSO}/tipo`] },
      set (value) { this.$store.commit(`${FORM_MTP}/${PROCESSO}/${SET_TIPO}`, value) }
    },
    representanteNome: {
      get () { return this.$store.getters[`${FORM_MTP}/${PROCESSO}/representanteNome`] },
      set (value) { this.$store.commit(`${FORM_MTP}/${PROCESSO}/${SET_REPRESENTANTE_NOME}`, value) }
    },
    representanteIsPessoaFisica: {
      get () { return this.$store.getters[`${FORM_MTP}/${PROCESSO}/representanteIsPessoaFisica`] },
      set (value) { this.$store.commit(`${FORM_MTP}/${PROCESSO}/${SET_REPRESENTANTE_PESSOA_FISICA}`, value) }
    },
    editalContrato: {
      get () { return this.$store.getters[`${FORM_MTP}/${PROCESSO}/objetoCodigo`] },
      set (value) { this.$store.commit(`${FORM_MTP}/${PROCESSO}/${SET_OBJETO_CODIGO}`, value) }
    },
    objeto: {
      get () { return this.$store.getters[`${FORM_MTP}/${PROCESSO}/objetoDescricao`] },
      set (value) { this.$store.commit(`${FORM_MTP}/${PROCESSO}/${SET_OBJETO_DESCRICAO}`, value) }
    },
    auditores: {
      get () { return this.listAuditor.filter(auditor => this.$store.getters[`${FORM_MTP}/${MTP}/auditores`].includes(auditor.value)) },
      set (value) { this.$store.commit(`${FORM_MTP}/${MTP}/${SET_AUDITORES}`, value.map(auditor => auditor.value)) }
    },
    requisitosAdmissibilidade: {
      get () { return this.$store.getters[`${FORM_MTP}/${MTP}/requisitosPresentes`] },
      set (value) { this.$store.commit(`${FORM_MTP}/${MTP}/${SET_REQUISITOS_PRESENTES}`, value) }
    },
    fumusBoniIuris: {
      get () { return this.$store.getters[`${FORM_MTP}/${MTP}/presenteFumus`] },
      set (value) { this.$store.commit(`${FORM_MTP}/${MTP}/${SET_PRESENTE_FUMUS}`, value) }
    },
    fumusBoniIuris: {
      get () { return this.$store.getters[`${FORM_MTP}/${MTP}/presenteFumus`] },
      set (value) { this.$store.commit(`${FORM_MTP}/${MTP}/${SET_PRESENTE_FUMUS}`, value) }
    },
    periculumInMora: {
      get () { return this.$store.getters[`${FORM_MTP}/${MTP}/presentePericulum`] },
      set (value) { this.$store.commit(`${FORM_MTP}/${MTP}/${SET_PRESENTE_PERICULUM}`, value) }
    },
    bakingLink () {
      return `${process.env['DOCBAKER_API_URL']}/bakery/bake?template=MTP&processo=${this.paramId}`
    },
    filteredListAdmissibilidade () {
      var incisoToIgnore = (this.representanteIsPessoaFisica) ? 'V' : 'IV'
      return this.listAdmissibilidade.filter(a => a.inciso != incisoToIgnore)
    },
    showRequisitos () {
      return ['f-mtp-1', 'f-mtp-3'].includes(this.form)
    },
    showPressupostos () {
      return ['f-mtp-1', 'f-mtp-2'].includes(this.form)
    }
  },
  methods: {
    ...mapMutations(`${FORM_MTP}/${IRREGULARIDADES}`, {
      setIrregularidade: SET_IRREGULARIDADE_TITULO,
      addIrregularidade: PUSH_IRREGULARIDADE,
      removeIrregularidade: REMOVE_IRREGULARIDADE
    }),
    async saveForm () {

      try {
        this.$store.dispatch(`${FORM_MTP}/${SAVE_MTP}`)
        this.noteMessage = 'Formulário salvo com sucesso!'
      } catch (err) {
        this.noteMessage = 'Ocorreu um erro ao tentar salvar o processo'
        console.log(err)
      } finally {
        this.isNotifying = true
      }
    }
  },
  created () {
    ApiService.get('/processos/tipo/options').then(response => this.listTipo = response)
    ApiService.get('/auditores').then(response => {
      this.listAuditor = response.map(i => { return { text: i.nome, value: i._id } })
    })
    ApiService.get('/criterioslegais/admissibilidade').then(response => {
      this.listAdmissibilidade = response.map(i => { return { text: i.inciso + ' - ' + i.descricao.generico, value: i._id, inciso: i.inciso } })
    })
    ApiService.get('/processos/periculum/options').then(response => this.listPericulum = response)

    this.$store.dispatch(`${FORM_MTP}/${START_VIEW}`)
  }
}
</script>

<style scoped>

  .italic-label >>> .v-label {
    font-style: italic;
  }

</style>
