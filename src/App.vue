<template>
  <v-app id="app" light>
    <v-toolbar app fixed clipped-left>
      <v-toolbar-title><v-icon style="transform:rotate(-45deg)" >local_pizza</v-icon><span class="pl-2">DOC BAKER</span></v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-slide-x-transition mode="out-in">
        <router-view class="mt-0"></router-view>
      </v-slide-x-transition>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App'
}
</script>
