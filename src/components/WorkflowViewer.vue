<template>
  <v-container fluid class="pa-0">
    <v-stepper v-bind:value="latestStep.index + 1" v-on:change="emitStepChange" vertical class="elevation-0 pa-0">
      <template v-for="step in steps">
        <v-stepper-step v-bind:key="step.index" v-bind:step="step.index" v-bind:complete="false" class="workflow-step">
          {{ step.title }}
          <small>{{ step.action }}</small>
        </v-stepper-step>
        <v-stepper-content v-bind:step="step.index"></v-stepper-content>
      </template>
    </v-stepper>
  </v-container>
</template>

<script>
import stateMachine from 'services/statemachine.service'

export default {
  name: 'WorkflowViewer',
  props: {
    value: { type: Array, required: true }
  },
  computed: {
    steps () {
      return this.value.map((step, index) => {
        return {
          ...step,
          index: index + 1,
          title: stateMachine.getState(step['state'])['title']
        }
      })
    },
    latestStep () {
      return this.steps[this.steps.length - 1]
    }
  },
  methods: {
    emitStepChange () {
      var type = stateMachine.getState(this.latestStep.state).type
      this.$emit('step-change', { ...this.latestStep, type })
    }
  }
}
</script>

<style scoped>

  .workflow-step >>> .v-stepper__step__step {
    background-color: #1976d2 !important;
    border-color: #1976d2 !important;
  }

  .workflow-step >>> .v-stepper__label {
    color: black !important;
  }

</style>
