<template>
  <v-app id="app" light>
    <v-toolbar app fixed clipped-left>
      <v-toolbar-title>DOC BAKER</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout style="max-width:100%" justify-center align-start>
          <v-slide-x-transition mode="out-in">
            <router-view class="mt-0"></router-view>
          </v-slide-x-transition>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App'
}
</script>
