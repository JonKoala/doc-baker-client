<template>
  <v-container fluid>
    <v-card v-if="workflowSteps.length > 0" class="pb-3">
      <v-stepper v-bind:value="workflowCurrentStep.index" v-bind:key="workflowCurrentStep.index" vertical class="elevation-0">
        <v-stepper-step v-for="step in workflowSteps" v-bind:key="step.index" v-bind:complete="workflowCurrentStep.index > step.index" v-bind:step="step.index">
          {{ step.title }}
          <small>{{ step.action }}</small>
        </v-stepper-step>
      </v-stepper>
      <v-layout justify-space-between class="px-3">
        <div>
          <v-btn v-for="option in workflowCurrentStep.options" v-bind:key="option" v-on:click="optionClick(option)" >{{ option }}</v-btn>
        </div>
        <v-btn style="float: right" v-if="workflowSteps.length > 1" v-on:click="undoClick" >voltar</v-btn>
      </v-layout>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

import { FETCH_PROCESSO, TAKE_WORKFLOW_ACTION, UNDO_WORKFLOW_LATEST_ACTION } from 'store/actions.type'
import { RESET_PROCESSO_STATE, RESET_WORKFLOW_STATE } from 'store/mutations.type'

export default {
  name: 'ViewEditProcesso',
  computed: {
    ...mapGetters([
      'workflowSteps',
      'workflowCurrentStep'
    ])
  },
  methods: {
    async optionClick (option) {
      await this.$store.dispatch(TAKE_WORKFLOW_ACTION, option)
      this.scrollBottom()
    },
    scrollBottom () {
      window.setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 0)
    },
    async undoClick () {
      await this.$store.dispatch(UNDO_WORKFLOW_LATEST_ACTION)
      this.scrollBottom()
    }
  },
  async created () {
    this.$store.commit(RESET_PROCESSO_STATE)
    this.$store.commit(RESET_WORKFLOW_STATE)

    await this.$store.dispatch(FETCH_PROCESSO, this.$route.params.id)
    this.scrollBottom()
  }
}
</script>
