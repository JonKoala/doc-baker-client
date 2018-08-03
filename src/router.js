import Vue from 'vue'
import VueRouter from 'vue-router'

import ViewHome from 'views/ViewHome'


Vue.use(VueRouter)

export default new VueRouter({
  routes:
  [
    {
      name: 'home',
      path: '/',
      component: ViewHome
    }
  ],
  mode: 'history'
})
