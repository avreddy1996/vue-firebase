import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import SignUp from '@/components/SignUp'

Vue.use(Router)

let router =  new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
      meta : {
        requiresAuth : true
      }
    },
    {
      path: '/login',
      name : 'Login',
      component :Login
    },
    {
      path : '/signup',
      name : 'SignUp',
      component : SignUp
    }
  ]
})

router.beforeEach((to, from, next) => {
  let isUser = firebase.auth().currentUser;
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if(requiresAuth && !isUser ) next('login')
  else if (to.path === '/login' && isUser) next('')
  else next()

})

export default router;
