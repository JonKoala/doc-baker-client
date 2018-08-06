import Vue from 'vue'
import VueRouter from 'vue-router'

import ViewHome from 'views/ViewHome'
import ViewWorkflow from 'views/ViewWorkflow'


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
      name: 'workflow',
      path: '/workflow/:id',
      component: ViewWorkflow
    }
  ],
  mode: 'history'
})
