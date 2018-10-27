// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase'
import { setupCalendar } from 'v-calendar/lib/v-calendar.min'
import 'v-calendar/lib/v-calendar.min.css'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
Vue.config.productionTip = false;

/*============ Initialising v-calendar =========*/
Vue.use(setupCalendar, {
  firstDayOfWeek: 2,  // Monday
});
/*============ End of initialising v-calendar ===*/
/*============ Initialising firebase ===========*/
var config = {
  apiKey: "AIzaSyBgRsCDz6PEyTCHVf-7ftdLlJdtik4CSmA",
  authDomain: "vuejs-firebase-78186.firebaseapp.com",
  databaseURL: "https://vuejs-firebase-78186.firebaseio.com",
  projectId: "vuejs-firebase-78186",
  storageBucket: "gs://vuejs-firebase-78186.appspot.com",
  messagingSenderId: "379261341537"
};
firebase.initializeApp(config);
/*========== end of Initialising firebase ===========*/
let app;
/*========== for initialising vue material ==========*/
Vue.use(VueMaterial)
/*========== end of initialising vue material ========*/
firebase.auth().onAuthStateChanged(function (user) {
  if(!app){
    app = new Vue({
      el: '#app',
      router,
      components: { App },
      template: '<App/>'
    })
  }
})
