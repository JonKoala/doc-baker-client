<template>
  <v-container fluid>
    <v-card class="pb-3">
      <v-stepper vertical class="elevation-0">
        <v-stepper-step v-for="step in workflowSteps" v-bind:key="step.state" v-bind:complete="step.index < workflowCurrentStep.index" v-bind:step="step.index">
          {{ step.title }}
          <small>{{ step.action }}</small>
        </v-stepper-step>
      </v-stepper>
      <v-layout  justify-space-between class="px-3">
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

import { FETCH_PROJETO, TAKE_WORKFLOW_ACTION, UNDO_WORKFLOW_LATEST_ACTION } from 'store/actions.type'

export default {
  name: 'ViewWorkflow',
  async created () {
    await this.$store.dispatch(FETCH_PROJETO, this.$route.params.id)
    this.scrollBottom()
  },
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
  }
}
</script>
