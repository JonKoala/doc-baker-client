import Vue from 'vue'
import VueRouter from 'vue-router'

import ViewHome from 'views/ViewHome'
import ViewEditProcesso from 'views/ViewEditProcesso'
import ViewNewProcesso from 'views/ViewNewProcesso.vue'


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
      name: 'newProcesso',
      path: '/processo',
      component: ViewNewProcesso
    },
    {
      name: 'editProcesso',
      path: '/processo/:id',
      component: ViewEditProcesso
    }
  ],
  mode: 'history'
})
