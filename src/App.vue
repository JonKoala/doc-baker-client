<template>
  <v-app id="app" light>
    <v-app-bar app fixed clipped-left>
      <v-toolbar-title><v-icon style="transform:rotate(-45deg)" >local_pizza</v-icon><span class="pl-2">DOC BAKER</span></v-toolbar-title>
      <v-spacer></v-spacer>
      <base-icon-button to="/" tooltip="home" bottom>home</base-icon-button>
      <base-icon-button to="/processo" tooltip="novo processo" bottom class="pr-2">create_new_folder</base-icon-button>
    </v-app-bar>
    <v-content>
      <v-slide-x-transition mode="out-in">
        <router-view class="mt-0"></router-view>
      </v-slide-x-transition>
    </v-content>
  </v-app>
</template>

<script>
import BaseIconButton from 'components/BaseIconButton'

export default {
  name: 'App',
  components: {
    BaseIconButton
  }
}
</script>
