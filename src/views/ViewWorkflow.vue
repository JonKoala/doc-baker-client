<template>
  <div>
    <div v-for="state in history" v-bind:key="state">{{ getText(state) }}</div>
    <v-btn v-for="option in options" v-bind:key="option" v-on:click="next(option)" >{{ option }}</v-btn>
  </div>
</template>

<script>
import sm from 'services/statemachine.service'

export default {
  name: 'ViewWorkflow',
  data () {
    return {
      history: ['q-1']
    }
  },
  methods: {
    next (state) {
      var nextState = sm.transition(this.current, state)
      this.history.push(nextState)
    },
    getText (state) {
      return (sm.getStateType(state) === 'question') ? sm.getStateData(state).text : sm.getStateData(state).title
    },
    getOptions (state) {
      return sm.getOptions(state)
    }
  },
  computed: {
    current () {
      return this.history[this.history.length-1]
    },
    options () {
      return sm.getStateOptions(this.current)
    }
  }
}
</script>
