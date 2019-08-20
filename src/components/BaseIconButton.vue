<template>
  <div>
    <v-tooltip v-bind="{ top, right, bottom, left }" v-bind:disabled="!hasTooltip">
      <template v-slot:activator="{ on }">
        <v-btn v-on="{ ...$listeners, ...on }" v-bind="{ dark, disabled, fab, href, large, small, target, text, to }"
          v-bind:color="btnColor" v-bind:icon="!fab">
          <v-icon v-bind="{ dark }" v-bind:color="iconColor"><slot></slot></v-icon>
        </v-btn>
      </template>
      <span>{{ tooltip }}</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  name: 'BaseIconButton',
  props: {
    color: { type: String },
    dark: { type: Boolean },
    disabled: { type: Boolean },
    fab: { type: Boolean },
    large: { type: Boolean },
    small: { type: Boolean },
    text: { type: Boolean },
    tooltip: { type: String },

    // Link
    href: { type: String },
    target: { type: String },
    to: { type: String },

    // Position
    top: { type: String },
    right: { type: String },
    bottom: { type: String },
    left: { type: String },
  },
  computed: {
    btnColor () {
      return this.dark ? this.color : null
    },
    hasTooltip () {
      return Boolean(this.tooltip)
    },
    iconColor () {
      return this.dark ? null : this.color
    }
  }
}
</script>
