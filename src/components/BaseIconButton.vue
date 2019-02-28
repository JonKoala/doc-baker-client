<template>
  <v-tooltip v-bind="{top, right, bottom, left}" v-bind:disabled="!hasTooltip">
    <v-btn v-on="$listeners" v-bind="{dark, disabled, fab, flat, href, large, small, target, to}" v-bind:color="btnColor" v-bind:icon="!fab"
    slot="activator" class="ma-0">
      <v-icon v-bind="{dark}" v-bind:color="iconColor"><slot></slot></v-icon>
    </v-btn>
    <span>{{ tooltip }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'BaseIconButton',
  props: {
    color: { type: String },
    dark: { type: Boolean },
    disabled: { type: Boolean },
    fab: { type: Boolean },
    flat: { type: Boolean },
    large: { type: Boolean },
    small: { type: Boolean },
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
