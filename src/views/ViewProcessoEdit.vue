<template>
  <v-container fluid fill-height grid-list-md>
    <v-layout v-if="workflow.length > 0">
      <v-flex>
        <v-card ref="workflowContainer" class="scrollable-container">
          <div class="scrollable-content pb-3">
            <workflow-viewer v-bind:value="workflow" v-on:step-change="updateFormVisibility"></workflow-viewer>
            <v-layout justify-space-between class="px-3">
              <div>
                <v-btn v-for="option in workflowOptions.map(o => o.text)" v-bind:key="option" v-on:click="takeWorkflowAction(option)" >{{ option }}</v-btn>
              </div>
              <v-btn v-if="workflow.length > 1" v-on:click="undoWorkflowAction" >voltar</v-btn>
            </v-layout>
          </div>
        </v-card>
      </v-flex>
      <v-flex ref="formContainer" v-on:webkitTransitionEnd="scrollToBottom" v-on:transitionend="scrollToBottom"
      class="form" v-bind:class="{ 'showing': showingForm }">
        <v-card v-if="workflow.length > 0" class="pb-3" height="100%">
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'

import { FORM } from 'services/statemachine/state.type'
import { FETCH_PROCESSO, TAKE_WORKFLOW_ACTION, UNDO_WORKFLOW_LATEST_ACTION } from 'store/actions.type'
import { RESET_PROCESSO_STATE, RESET_WORKFLOW_STATE } from 'store/mutations.type'

import WorkflowViewer from 'components/WorkflowViewer'

export default {
  name: 'ViewProcessoEdit',
  components: {
    WorkflowViewer
  },
  data () {
    return {
      showingForm: false
    }
  },
  computed: {
    ...mapGetters([
      'workflow',
      'workflowOptions'
    ])
  },
  methods: {
    async scrollToBottom () {
      await Vue.nextTick()
      this.$refs.workflowContainer.$el.scrollTo(0, this.$refs.workflowContainer.$el.scrollHeight)
    },
    async takeWorkflowAction (option) {
      await this.$store.dispatch(TAKE_WORKFLOW_ACTION, option)
      this.scrollToBottom()
    },
    async undoWorkflowAction () {
      await this.$store.dispatch(UNDO_WORKFLOW_LATEST_ACTION)
      this.scrollToBottom()
    },
    updateFormVisibility (step) {
      this.showingForm = (step.type === FORM)
    }
  },
  created () {
    this.$store.commit(RESET_PROCESSO_STATE)
    this.$store.commit(RESET_WORKFLOW_STATE)
  },
  async mounted () {
    await this.$store.dispatch(FETCH_PROCESSO, this.$route.params.id)
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
