import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import { sync } from 'vuex-router-sync'

import 'vuetify/src/stylus/app.styl'

import App from './App'
import router from './router'
import store from 'store'


Vue.use(Vuetify)
sync(store, router)

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
