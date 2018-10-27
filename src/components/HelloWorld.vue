<template>
  <div v-if="loading" style="margin-top: 50px">
    <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
  </div>
  <div v-else>
    <div class="page-container">
      <md-app md-waterfall md-mode="fixed" class="height-100">
        <md-app-toolbar class="md-primary md-elevation-2">
          <span class="md-title"></span>
        </md-app-toolbar>
        <md-app-drawer md-permanent="full" class="md-layout-item md-size-20 app-drawer">
          <md-app-toolbar class="md-primary" md-elevation="2">
            My Dairy
          </md-app-toolbar>
          <div style="position: relative;">
            <img src="../assets/bg.jpg" alt="Background" style="width: 100%;"/>
            <div class="avatar-image">
              <md-avatar class="md-large md-elevation-4" style="margin: 4px auto;">
                <img :src="user.image" alt="People" style="background: #fff;">
              </md-avatar>
              <h5 class="avatar-text">{{user.name}}</h5>
            </div>
          </div>
          <div style="flex: 1;overflow-x: auto;" class="md-scrollbar">
            <v-calendar :attributes='attrs' @dayclick='dayClicked'></v-calendar>
          </div>
          <md-divider></md-divider>
          <md-list>
            <md-list-item @click="logout">
              <md-icon>power_settings_new</md-icon>
              <span class="md-list-item-text">Sign Out</span>
            </md-list-item>
          </md-list>
        </md-app-drawer>
        <md-app-content>
          <div class="md-layout">
            <div class="md-layout-item md-size-50">
              Enter dairy of {{selectedDate.toLocaleDateString("en-US")}}
            </div>
            <md-field class="md-layout-item md-size-80">
              <label>Textarea</label>
              <md-textarea v-model="textarea"></md-textarea>
            </md-field>
            <md-button class="md-primary md-raised" @click="updateDairy">Save</md-button>
          </div>
        </md-app-content>
      </md-app>
    </div>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import Vue from 'vue';
  import { setupCalendar, Calendar} from 'v-calendar'
  import 'v-calendar/lib/v-calendar.min.css';

  // Remember to setup calendar (passing in defaults if needed)
  setupCalendar({
    firstDayOfWeek: 2,  // Monday,
    // ...other defaults
  });

  // Register component(s)
  Vue.component('v-calendar', Calendar);

  export default {
    name: 'HelloWorld',
    components: {Calendar},
    data () {
      return {
        msg: 'Welcome to Your Vue.js App ',
        user : {},
        name : '',
        textarea : '',
        selectedDate : new Date(),
        loading: true,
      }
    },
    computed : {
      attrs() {
        let dairy = this.getUserDairy();
        dairy.push(
          {
            key: 'today',
            highlight: {
              backgroundColor: '#ff8080',
              // Other properties are available too, like `height` & `borderRadius`
            },
            dates: new Date(),
          }
          );
        console.log(dairy);
        return dairy;
      }
    },
    methods : {
      logout : function () {
        const self = this;
        firebase.auth().signOut().then(function () {
          self.$router.replace('login');
        })
      },
      updateUser : function () {
        let userId = firebase.auth().currentUser.uid;
        firebase.database().ref('users/'+userId).set({
          name : this.name
        })
      },
      dayClicked : function(day){
        this.selectedDate = day.date;
        console.log(this.selectedDate)
      },
      updateDairy : function () {
        let userId = firebase.auth().currentUser.uid;
        firebase.database().ref('users/'+userId+'/dairy/'+this.getDateString(this.selectedDate)).set({
          content : this.textarea
        }).then((data)=>{
          this.textarea = '';
          this.user.dairy[this.getDateString(this.selectedDate)]=this.textarea;
        })
      },
      getDateString: function(date){
        let toDate = date?date:new Date();
        return (toDate.getMonth()+1)+'-'+toDate.getDate()+'-'+toDate.getFullYear();
      },
      getUserDairy: function(){
        let arr = [];
        if(this.user.dairy){
          Object.keys(this.user.dairy).forEach((key)=>{
            console.log('date',key,new Date(key));
            arr.push({
              dates : new Date(key),
              dot : {
                backgroundColor : '#398fac',
              },
              popover : {
                label : this.user.dairy[key].content.slice(0,10)
              }
            })
          })
        }
        return arr;
      }
    },
    created(){
      const self = this;
      let user;
      let uid = firebase.auth().currentUser.uid;
      firebase.database().ref('users/'+uid).once('value').then(function (snapshot) {
        var user = snapshot.val() && snapshot.val() || firebase.auth().currentUser.email;
        self.user = user;
        self.loading = false;
      })
    },

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
  .height-100{
    height: 100vh;
  }
  .app-drawer{
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .avatar-image{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }
  .avatar-text{
    padding: 4px 8px;
    background: #fff;
    -webkit-border-radius: 100rem;
    -moz-border-radius: 100rem;
    border-radius: 100rem;
    margin: 4px 0;
  }
  .c-day-content{
    cursor: pointer;
  }
</style>
