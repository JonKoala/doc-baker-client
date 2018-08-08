<template>
  <v-container fluid>
    <v-card class="pb-3">
      <v-stepper vertical class="elevation-0">
        <v-stepper-step v-for="step in workflowSteps" v-bind:key="step.state" v-bind:complete="step.index < workflowCurrentStep.index" v-bind:step="step.index">
          {{ step.title }}
          <small>{{ step.action }}</small>
        </v-stepper-step>
      </v-stepper>
      <div class="fluid px-3">
        <v-btn v-for="option in workflowCurrentStep.options" v-bind:key="option" v-on:click="optionClick(option)" >{{ option }}</v-btn>
        <v-btn style="float: right" v-if="workflowSteps.length > 1" v-on:click="undoClick" >voltar</v-btn>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

import { TAKE_WORKFLOW_ACTION, UNDO_WORKFLOW_LATEST_ACTION } from 'store/actions.type'

export default {
  name: 'ViewWorkflow',
  computed: {
    ...mapGetters([
      'workflowSteps',
      'workflowCurrentStep'
    ]),
  },
  methods: {
    optionClick (option) {
      this.$store.dispatch(TAKE_WORKFLOW_ACTION, option)
      this.scrollBottom()
    },
    scrollBottom () {
      window.setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 0)
    },
    undoClick () {
      this.$store.dispatch(UNDO_WORKFLOW_LATEST_ACTION)
      this.scrollBottom()
    }
  }
}
</script>
