<template>
  <v-container fluid>

    <!-- Dados do Processo  -->
    <v-divider></v-divider>
    <v-subheader>Dados do Processo</v-subheader>
    <v-layout row wrap class="pl-5">
      <v-flex xs2>
        <v-select v-model="processoTipo" v-bind:items="listTipoProcesso" label="Tipo" box></v-select>
      </v-flex>
      <v-flex xs5>
        <v-text-field v-model="processoRepresentante" label="Representante" box></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row wrap class="pl-5">
      <v-flex xs4>
        <v-text-field v-model="editalContrato" label="Edital/Contrato" box></v-text-field>
      </v-flex>
      <v-flex xs10>
        <v-text-field v-model="objeto" label="Objeto" box></v-text-field>
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
        <v-combobox v-bind:value="computedAuditores" v-on:input="updateAuditores" v-bind:items="listAuditor" multiple hide-selected small-chips label="Auditores" box></v-combobox>
      </v-flex>
    </v-layout>

    <!-- Dados da Manifestação Técnica - Requisitos de Admissibilidade -->
    <v-divider inset class="mt-1"></v-divider>
    <v-subheader inset>Requisitos de Admissibilidade</v-subheader>
    <v-layout column class="pl-5">
      <v-checkbox v-for="(admissibilidade, index) in listAdmissibilidade"
        v-model="requisitosAdmissibilidade"
        v-bind:label="admissibilidade.text"
        v-bind:value="admissibilidade.value"
        v-bind:key="index"
        color="blue darken-2"></v-checkbox>
    </v-layout>

    <!-- Dados da Manifestação Técnica - Pressupostos -->
    <v-divider inset class="mt-1"></v-divider>
    <v-subheader inset>Pressupostos</v-subheader>
    <v-layout row wrap class="pl-5">
      <v-flex xs3>
        <v-checkbox v-model="pressupostoFumus" label="fumus boni iuris" class="italic-label" color="blue darken-2"></v-checkbox>
      </v-flex>
      <v-flex xs4>
        <v-select v-model="pressupostoPericulum" v-bind:items="listPericulum" label="periculum in mora " class="italic-label" box></v-select>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

import ApiService from 'services/api.service'

import { FORM_MTP, MTP, IRREGULARIDADES, PROCESSO } from 'store/namespaces'
import { START_VIEW } from 'store/action.types'
import {
  PUSH_IRREGULARIDADE, REMOVE_IRREGULARIDADE, SET_AUDITORES, SET_PRESENTE_FUMUS, SET_PRESENTE_PERICULUM,
  SET_IRREGULARIDADE_TITULO, SET_OBJETO_CODIGO, SET_OBJETO_DESCRICAO, SET_REPRESENTANTE, SET_REQUISITOS_PRESENTES, SET_TIPO
} from 'store/mutation.types'

export default {
  name: 'FormMtp',
  data () {
    return {
      listTipoProcesso: [],
      listAuditor: [],
      listAdmissibilidade: [],
      listPericulum: []
    }
  },
  computed: {
    ...mapGetters(`${FORM_MTP}/${IRREGULARIDADES}`, {
      irregularidades: 'titulos'
    }),
    ...mapGetters(`${FORM_MTP}/${MTP}`, [
      'auditores',
      'presenteFumus',
      'presentePericulum',
      'requisitosPresentes'
    ]),
    ...mapGetters(`${FORM_MTP}/${PROCESSO}`, [
      'objetoCodigo',
      'objetoDescricao',
      'representante',
      'tipo'
    ]),
    editalContrato: {
      get () { return this.objetoCodigo },
      set (editalContrato) { this.setEditalContrato(editalContrato) }
    },
    objeto: {
      get () { return this.objetoDescricao },
      set (objeto) { this.setObjeto(objeto) }
    },
    pressupostoFumus: {
      get () { return this.presenteFumus },
      set (presente) { this.setPresenteFumus(presente) }
    },
    pressupostoPericulum: {
      get () { return this.presentePericulum },
      set (presente) { this.setPresentePericulum(presente) }
    },
    processoRepresentante: {
      get () { return this.representante },
      set (tipo) { this.setRepresentante(tipo) }
    },
    processoTipo: {
      get () { return this.tipo },
      set (tipo) { this.setTipoProcesso(tipo) }
    },
    requisitosAdmissibilidade: {
      get () { return this.requisitosPresentes },
      set (requisitos) { this.setRequisitosPresentes(requisitos) }
    },
    computedAuditores () {
      return this.listAuditor.filter(auditor => this.auditores.includes(auditor.value))
    }
  },
  methods: {
    ...mapActions(FORM_MTP, {
      startView: START_VIEW,
    }),
    ...mapMutations(`${FORM_MTP}/${IRREGULARIDADES}`, {
      setIrregularidade: SET_IRREGULARIDADE_TITULO,
      addIrregularidade: PUSH_IRREGULARIDADE,
      removeIrregularidade: REMOVE_IRREGULARIDADE
    }),
    ...mapMutations(`${FORM_MTP}/${MTP}`, {
      setAuditores: SET_AUDITORES,
      setPresenteFumus: SET_PRESENTE_FUMUS,
      setPresentePericulum: SET_PRESENTE_PERICULUM,
      setRequisitosPresentes: SET_REQUISITOS_PRESENTES
    }),
    ...mapMutations(`${FORM_MTP}/${PROCESSO}`, {
      setEditalContrato: SET_OBJETO_CODIGO,
      setObjeto: SET_OBJETO_DESCRICAO,
      setRepresentante: SET_REPRESENTANTE,
      setTipoProcesso: SET_TIPO
    }),
    updateAuditores (auditores) {
      this.setAuditores(auditores.map(auditor => auditor.value))
    }
  },
  created () {
    ApiService.get('/processos/tipo/options').then(response => this.listTipoProcesso = response)
    ApiService.get('/auditores').then(response => {
      this.listAuditor = response.map(i => { return { text: i.nome, value: i._id } })
    })
    ApiService.get('/criterioslegais/admissibilidade').then(response => {
      this.listAdmissibilidade = response.map(i => { return { text: i.descricao.presente, value: i._id } })
    })
    ApiService.get('/processos/periculum/options').then(response => this.listPericulum = response)

    this.startView()
  }
}
</script>

<style scoped>

  .italic-label >>> .v-label {
    font-style: italic;
  }

</style>
