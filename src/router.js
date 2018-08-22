import Vue from 'vue'
import VueRouter from 'vue-router'

import ViewHome from 'views/ViewHome'
import ViewProcessoEdit from 'views/ViewProcessoEdit'
import ViewProcessoNew from 'views/ViewProcessoNew.vue'


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
      component: ViewProcessoNew
    },
    {
      name: 'editProcesso',
      path: '/processo/:id',
      component: ViewProcessoEdit
    }
  ],
  mode: 'history'
})
