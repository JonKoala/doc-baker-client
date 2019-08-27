<template>
  <v-container fluid class="d-flex" style="height: 100%">
    <v-row dense>

      <v-col>
        <v-card ref="workflowContainer" class="scrollable-container">
          <div class="scrollable-content pb-3">

            <v-row>
              <workflow-viewer v-if="workflow.length > 0" v-bind:value="workflow"></workflow-viewer>
            </v-row>

            <v-row justify="start" class="mx-3" dense>
              <template v-if="options">
                <v-btn v-for="option in options.map(o => o.text)" v-bind:key="option" v-on:click="takeAction(option)" class="mr-5">{{ option }}</v-btn>
              </template>
              <v-spacer></v-spacer>
              <v-btn v-if="workflow.length > 1" v-on:click="undoAction" >voltar</v-btn>
            </v-row>

          </div>
        </v-card>
      </v-col>

      <v-col v-on:webkitTransitionEnd="scrollToBottom" v-on:transitionend="scrollToBottom" class="form" v-bind:class="{ 'showing': showingForm }">
        <v-card class="scrollable-container">
          <div class="scrollable-content">
            <component v-bind:is="formToShow" ></component>
          </div>
        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'

import { VIEW_PROCESSO_EDIT } from 'store/namespaces'
import { START, TAKE_ACTION, UNDO_ACTION } from 'store/action.types'

import FormIti from 'components/FormIti'
import FormMt from 'components/FormMt'
import FormMtp from 'components/FormMtp'
import WorkflowViewer from 'components/WorkflowViewer'

export default {
  name: 'ViewProcessoEdit',
  components: {
    WorkflowViewer
  },
  data () {
    return {
      formToShow: null
    }
  },
  computed: {
    ...mapGetters(VIEW_PROCESSO_EDIT, [
      'options',
      'workflow',
      'workflowState'
    ]),
    showingForm () {
      return this.formToShow != null
    }
  },
  methods: {
    async scrollToBottom () {
      await Vue.nextTick()
      this.$refs.workflowContainer.$el.scrollTo(0, this.$refs.workflowContainer.$el.scrollHeight)
    },
    async takeAction (action) {
      await this.$store.dispatch(`${VIEW_PROCESSO_EDIT}/${TAKE_ACTION}`, action)
      this.updateFormVisibility()
      this.scrollToBottom()
    },
    async undoAction () {
      await this.$store.dispatch(`${VIEW_PROCESSO_EDIT}/${UNDO_ACTION}`)
      this.updateFormVisibility()
      this.scrollToBottom()
    },
    updateFormVisibility () {

      switch (this.workflowState) {
        case 'f-mtp-1':
        case 'f-mtp-2':
        case 'f-mtp-3':
          this.formToShow = FormMtp
          break;
        case 'f-mt':
          this.formToShow = FormMt
          break
        case 'f-iti':
          this.formToShow = FormIti
          break;
        default:
          this.formToShow = null
          break;
      }
    }
  },
  async mounted () {
    await this.$store.dispatch(`${VIEW_PROCESSO_EDIT}/${START}`)
    this.updateFormVisibility()
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
