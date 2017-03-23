import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '@/components/MainPage'
import Admin from '@/components/Admin'
import Logger from '@/components/Logger'
import Login from '@/components/Login'
import Registration from '@/components/Registration'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MainPage',
      component: MainPage
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/registration',
        name: 'Registration',
        component: Registration
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin,
      children: [
        { path: 'logger', component: Logger }
      ]
    }
  ]
})
