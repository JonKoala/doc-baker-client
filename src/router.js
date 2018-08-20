import Vue from 'vue'
import VueRouter from 'vue-router'

import ViewHome from 'views/ViewHome'
import ViewEditProcesso from 'views/ViewEditProcesso'


Vue.use(VueRouter)

export default new VueRouter({
  routes:
  [
    {
      name: 'home',
      path: '/',
      component: ViewHome
    },
    {
      name: 'processo',
      path: '/processo/:id',
      component: ViewEditProcesso
    }
  ],
  mode: 'history'
})
