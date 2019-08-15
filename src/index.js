import Vue from 'vue'
import { sync } from 'vuex-router-sync'

import App from './App'
import router from './router'
import store from 'store'
import vuetify from './vuetify'


sync(store, router)

new Vue({
  el: '#app',
  router,
  store,
  vuetify,
  template: '<App/>',
  components: { App }
})
