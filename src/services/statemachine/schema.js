import { QUESTION, FORM } from './state.type'

export default {
  key: 'worlflow',
  initial: 'q-1',
  states: {
    'q-1': {
      data: {
        type: QUESTION,
        text: 'Há pedido de cautelar?'
      },
      on: {
        true: 'q-2',
        false: 'q-3'
      }
    },
    'q-2': {
      data: {
        type: QUESTION,
        text: 'Relator já se manifestou sobre os pressupostos da cautelar?'
      },
      on: {
        true: 'q-4',
        false: 'q-5'
      }
    },
    'q-3': {
      data: {
        type: QUESTION,
        text: 'O relator já se manifestou sobre a admissibilidade da denuncia/representação?'
      },
      on: {
        true: 'q-6',
        false: 'f-mt'
      }
    },
    'q-4': {
      data: {
        type: QUESTION,
        text: 'Cautelar deferida?'
      },
      on: {
        true: 'q-7',
        false: 'q-8'
      }
    },
    'q-5': {
      data: {
        type: QUESTION,
        text: 'O relator já se manifestou sobre a admissibilidade da denuncia/representação?'
      },
      on: {
        true: 'f-mt',
        false: 'f-mt'
      }
    },
    'q-6': {
      data: {
        type: QUESTION,
        text: 'já foi realizada a ITI?'
      },
      on: {
        true: 'q-9',
        false: 'q-10'
      }
    },
    'q-7': {
      data: {
        type: QUESTION,
        text: 'Houve acatamento de decisão sem recurso, com saneamento das irregularidades?'
      },
      on: {
        true: 'f-itc',
        false: 'q-6'
      }
    },
    'q-8': {
      data: {
        type: QUESTION,
        text: 'O relator já se manifestou sobre a admissibilidade da denuncia/representação?'
      },
      on: {
        true: 'q-6',
        false: 'f-mt'
      }
    },
    'q-9': {
      data: {
        type: QUESTION,
        text: 'Os citados apresentaram defesa?'
      },
      on: {
        true: 'q-11',
        false: 'f-itc'
      }
    },
    'q-10': {
      data: {
        type: QUESTION,
        text: 'Houve perda superveniente do objeto?'
      },
      on: {
        true: 'f-itc',
        false: 'q-12'
      }
    },
    'q-11': {
      data: {
        type: QUESTION,
        text: 'Houve cancelamento/revogação do edital após citação?'
      },
      on: {
        true: 'f-itc',
        false: 'q-13'
      }
    },
    'q-12': {
      data: {
        type: QUESTION,
        text: 'Há indicativos de irregularidades?'
      },
      on: {
        true: 'q-14',
        false: 'f-itc'
      }
    },
    'q-13': {
      data: {
        type: QUESTION,
        text: 'Permanecem indicativos de irregularidades?'
      },
      on: {
        true: 'f-itc',
        false: 'f-itc'
      }
    },
    'q-14': {
      data: {
        type: QUESTION,
        text: 'Entre os responsáveis existem chefes dos poderes estaduais?'
      },
      on: {
        true: 'f-iti',
        false: 'f-iti'
      }
    },

    'f-mt': {
      data: {
        type: FORM,
        title: 'Formulário MT'
      },
      on: {
        homologado: 'q-6'
      }
    },
    'f-iti': {
      data: {
        type: FORM,
        title: 'Formulário ITI'
      },
      on: {
        homologado: 'q-9'
      }
    },
    'f-itc': {
      data: {
        type: FORM,
        title: 'Formulário ITC'
      }
    }
  }
}
