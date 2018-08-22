<template>
  <v-container fluid class="pa-0">
    <v-stepper v-bind:value="latestStep.index" v-bind:key="latestStep.index" vertical class="elevation-0">
      <v-stepper-step v-for="step in steps" v-bind:key="step.index" v-bind:complete="latestStep.index > step.index" v-bind:step="step.index">
        {{ step.title }}
        <small>{{ step.action }}</small>
      </v-stepper-step>
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
  }
}
</script>
