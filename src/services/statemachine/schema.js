import { QUESTION, FORM } from './state.type'

export default {
  initial_state: 'q-1',
  states: {
    'q-1': {
      type: QUESTION,
      title: 'Há pedido de cautelar?',
      actions: [
        { text: 'Sim', state: 'q-2' },
        { text: 'Não', state: 'q-3' }
      ]
    },
    'q-2': {
      type: QUESTION,
      title: 'Relator já se manifestou sobre os pressupostos da cautelar?',
      actions: [
        { text: 'Sim', state: 'q-4' },
        { text: 'Não', state: 'q-5' }
      ]
    },
    'q-3': {
      type: QUESTION,
      title: 'O relator já se manifestou sobre a admissibilidade da denuncia/representação?',
      actions: [
        { text: 'Sim', state: 'q-6' },
        { text: 'Não', state: 'f-mt' }
      ]
    },
    'q-4': {
      type: QUESTION,
      title: 'Cautelar deferida?',
      actions: [
        { text: 'Sim', state: 'q-7' },
        { text: 'Não', state: 'q-8' }
      ]
    },
    'q-5': {
      type: QUESTION,
      title: 'O relator já se manifestou sobre a admissibilidade da denuncia/representação?',
      actions: [
        { text: 'Sim', state: 'f-mt' },
        { text: 'Não', state: 'f-mt' }
      ]
    },
    'q-6': {
      type: QUESTION,
      title: 'já foi realizada a ITI?',
      actions: [
        { text: 'Sim', state: 'q-9' },
        { text: 'Não', state: 'q-10' }
      ]
    },
    'q-7': {
      type: QUESTION,
      title: 'Houve acatamento de decisão sem recurso, com saneamento das irregularidades?',
      actions: [
        { text: 'Sim', state: 'f-itc' },
        { text: 'Não', state: 'q-6' }
      ]
    },
    'q-8': {
      type: QUESTION,
      title: 'O relator já se manifestou sobre a admissibilidade da denuncia/representação?',
      actions: [
        { text: 'Sim', state: 'q-6' },
        { text: 'Não', state: 'f-mt' }
      ]
    },
    'q-9': {
      type: QUESTION,
      title: 'Os citados apresentaram defesa?',
      actions: [
        { text: 'Sim', state: 'q-11' },
        { text: 'Não', state: 'f-itc' }
      ]
    },
    'q-10': {
      type: QUESTION,
      title: 'Houve perda superveniente do objeto?',
      actions: [
        { text: 'Sim', state: 'f-itc' },
        { text: 'Não', state: 'q-12' }
      ]
    },
    'q-11': {
      type: QUESTION,
      title: 'Houve cancelamento/revogação do edital após citação?',
      actions: [
        { text: 'Sim', state: 'f-itc' },
        { text: 'Não', state: 'q-13' }
      ]
    },
    'q-12': {
      type: QUESTION,
      title: 'Há indicativos de irregularidades?',
      actions: [
        { text: 'Sim', state: 'q-14' },
        { text: 'Não', state: 'f-itc' }
      ]
    },
    'q-13': {
      type: QUESTION,
      title: 'Permanecem indicativos de irregularidades?',
      actions: [
        { text: 'Sim', state: 'f-itc' },
        { text: 'Não', state: 'f-itc' }
      ]
    },
    'q-14': {
      type: QUESTION,
      title: 'Entre os responsáveis existem chefes dos poderes estaduais?',
      actions: [
        { text: 'Sim', state: 'f-iti' },
        { text: 'Não', state: 'f-iti' }
      ]
    },

    'f-mt': {
      type: FORM,
      title: 'Formulário MT',
      actions: [
        { text: 'Homologado', state: 'q-6' }
      ]
    },
    'f-iti': {
      type: FORM,
      title: 'Formulário ITI',
      actions: [
        { text: 'Homologado', state: 'q-9' }
      ]
    },
    'f-itc': {
      type: FORM,
      title: 'Formulário ITC',
      actions: [ ]
    }
  }
}
