<template>
  <v-container fluid>
    <v-card class="pb-3">
      <v-stepper v-bind:value="history.length" vertical class="elevation-0">
        <v-stepper-step v-for="state in history" v-bind:key="state" v-bind:complete="state != currentState" v-bind:step="getStateIndex(state)">
          {{ getStateTitle(state) }}
          <small v-if="answers.length >= getStateIndex(state)">{{ answers[getStateIndex(state) - 1] }}</small>
        </v-stepper-step>
      </v-stepper>
      <div class="pl-3">
        <v-btn v-for="option in currentStateOptions" v-bind:key="option.text" v-on:click="next(option.state, option.text)" >{{ option.text }}</v-btn>
        <v-btn v-if="history.length > 1" v-on:click="onBack" >voltar</v-btn>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import sm from 'services/statemachine.service'

export default {
  name: 'ViewWorkflow',
  data () {
    return {
      history: ['q-1'],
      answers: []
    }
  },
  methods: {
    next (state, answer) {
      this.history.push(state)
      this.answers.push(answer)

      window.setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 0)
    },
    getStateTitle (state) {
      return sm.getState(state).title
    },
    getStateIndex (state) {
      return this.history.findIndex(s => s === state) + 1
    },
    onBack () {
      this.history.pop()
      this.answers.pop()
    }
  },
  computed: {
    currentState () {
      return this.history[this.history.length-1]
    },
    currentStateOptions () {
      return sm.getStateActions(this.currentState)
    },
    currentStateTitle () {
      return this.getStateTitle(this.currentState)
    }
  }
}
</script>
