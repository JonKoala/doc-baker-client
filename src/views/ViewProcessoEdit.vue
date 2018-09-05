<template>
  <v-container fluid fill-height grid-list-md>
    <v-layout v-if="workflow.length > 0">
      <v-flex>
        <v-card ref="workflowContainer" class="scrollable-container">
          <div class="scrollable-content pb-3">
            <workflow-viewer v-bind:value="workflow" v-on:step-change="updateFormVisibility"></workflow-viewer>
            <v-layout justify-space-between class="px-3">
              <div>
                <v-btn v-for="option in options.map(o => o.text)" v-bind:key="option" v-on:click="takeAction(option)" >{{ option }}</v-btn>
              </div>
              <v-btn v-if="workflow.length > 1" v-on:click="undoAction" >voltar</v-btn>
            </v-layout>
          </div>
        </v-card>
      </v-flex>
      <v-flex v-on:webkitTransitionEnd="scrollToBottom" v-on:transitionend="scrollToBottom" class="form" v-bind:class="{ 'showing': showingForm }">
        <v-card class="scrollable-container">
          <div class="scrollable-content">
            <form-mtp></form-mtp>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'

import { FORM } from 'services/statemachine/state.type'
import { VIEW_PROCESSO_EDIT } from 'store/namespaces'
import { START_VIEW, TAKE_ACTION, UNDO_ACTION } from 'store/action.types'

import FormMtp from 'components/FormMtp'
import WorkflowViewer from 'components/WorkflowViewer'

export default {
  name: 'ViewProcessoEdit',
  components: {
    FormMtp,
    WorkflowViewer
  },
  data () {
    return {
      showingForm: false
    }
  },
  computed: {
    ...mapGetters(VIEW_PROCESSO_EDIT, [
      'workflow',
      'options'
    ])
  },
  methods: {
    async scrollToBottom () {
      await Vue.nextTick()
      this.$refs.workflowContainer.$el.scrollTo(0, this.$refs.workflowContainer.$el.scrollHeight)
    },
    async takeAction (action) {
      await this.$store.dispatch(`${VIEW_PROCESSO_EDIT}/${TAKE_ACTION}`, action)
      this.scrollToBottom()
    },
    async undoAction () {
      await this.$store.dispatch(`${VIEW_PROCESSO_EDIT}/${UNDO_ACTION}`)
      this.scrollToBottom()
    },
    updateFormVisibility (step) {
      this.showingForm = (step.type === FORM)
    }
  },
  async mounted () {
    await this.$store.dispatch(`${VIEW_PROCESSO_EDIT}/${START_VIEW}`)
    this.scrollToBottom()
  }
}
</script>

<style scoped>

  .scrollable-container {
    position: relative;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .scrollable-content {
    position: absolute;
    width: 100%;
  }

  .form {
    transition: opacity .2s ease-in-out, flex-grow .5s ease-in-out .2s;
    flex-grow: 0;
    opacity: 0;
  }

  .form.showing {
    transition: flex-grow .5s ease-in-out, opacity .2s ease-in-out .5s;
    flex-grow: 3;
    opacity: 1;
  }

</style>
