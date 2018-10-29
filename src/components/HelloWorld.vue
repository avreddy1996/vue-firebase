<template>
  <div v-if="loading" style="text-align: center;margin-top: 50px">
    <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
  </div>
  <div v-else>
    <div class="page-container">
      <md-app md-waterfall md-mode="fixed" class="height-100">
        <md-app-toolbar class="md-primary">
          <span class="md-title"></span>
        </md-app-toolbar>
        <md-app-drawer md-permanent="full" class="md-layout-item md-size-20 app-drawer">
          <md-app-toolbar class="md-primary">
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
          <div style="flex: 1;overflow-x: auto;margin: 4px 0;" class="md-scrollbar">
            <v-calendar :attributes='attrs' @dayclick='dayClicked' :theme-styles="themeStyles"></v-calendar>
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
          <div class="paper">
            <div class="dairy-header">
              <div class="md-layout md-alignment-bottom-space-between">
                <h6>{{getMonthText(this.selectedDate)}}</h6>
                <h6 style="font-weight: bold;">{{this.selectedDate.getFullYear()}}</h6>
              </div>
              <md-divider></md-divider>
              <div>
                <h5><span class="">{{this.selectedDate.getDate()}}</span> {{getDateText(this.selectedDate)}}</h5>
              </div>
            </div>
            <div class="dairy-content">
              <textarea v-model="textarea" title="dairy content" style="width: 100%;" rows="10" placeholder="There is no content for this date, Click here to add some :)"></textarea>
            </div>
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
        isEmailVerified : false,
        selectedDate : new Date(),
        loading: true,
        themeStyles : {
          wrapper: {
            border: '0',
            borderRadius: '5px',
            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.14), 0 6px 20px 0 rgba(0, 0, 0, 0.13)'
          },
          dayCellNotInMonth: {
            opacity: 0,
            pointerEvents: 'none'
          }
        }
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
              boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.14), 0 6px 20px 0 rgba(0, 0, 0, 0.13)'
              // Other properties are available too, like `height` & `borderRadius`
            },
            contentStyle: {
              color: 'white',
              boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.14), 0 6px 20px 0 rgba(0, 0, 0, 0.13)'
              // White text
            },
            dates: new Date(),
          },
          {
            key:'selected',
            highlight: {
              borderColor: '#ff8080',
              borderWidth : '2px',
              borderRadius : '50%'
            },
            dates : new Date(this.selectedDate)
          }
          );
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
        this.textarea = (this.user.dairy && this.user.dairy[this.getDateString(this.selectedDate)]) ? this.user.dairy[this.getDateString(this.selectedDate)].content:'';
      },
      updateDairy : function () {
        let userId = firebase.auth().currentUser.uid;
        const self = this;
        firebase.database().ref('users/'+userId+'/dairy/'+this.getDateString(this.selectedDate)).set({
          content : this.textarea
        }).then((data)=>{
          if(self.user.dairy){
            self.user.dairy[self.getDateString(self.selectedDate)] = self.textarea.toString();
          }else{
            self.user.dairy = {
              [self.getDateString(self.selectedDate)]:{
                'content' : self.textarea.toString()
            }
            }
          }
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
            arr.push({
              dates : new Date(key),
              dot : {
                backgroundColor : '#398fac',
              },
              popover : {
                label : this.user.dairy[key].content?this.user.dairy[key].content.slice(0,10):''
              }
            })
          })
        }
        return arr;
      },
      getMonthText: function(date){
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[date.getMonth()];
      },
      getDateText : function (date) {
        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[date.getDay()];
      }
    },
    created(){
      const self = this;
      let user;
      let uid = firebase.auth().currentUser.uid;
      firebase.database().ref('users/'+uid).once('value').then(function (snapshot) {
        self.isEmailVerified = firebase.auth().currentUser.emailVerified;
        var user = snapshot.val() && snapshot.val() || firebase.auth().currentUser.email;
        self.user = user;
        self.textarea = (user.dairy && user.dairy[self.getDateString(self.selectedDate)] && user.dairy[self.getDateString(self.selectedDate)].content)?user.dairy[self.getDateString(self.selectedDate)].content:'';
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
  .paper{
    padding: 1rem;
    width: 100%;
    -webkit-box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    -moz-box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  }
  .dairy-header h6{
    margin: 10px 0;
    font-size: 1.5rem;
    font-weight: 400;
  }
  .dairy-header h5{
    margin: 15px 0;
    font-size: 1.2rem;
    font-weight: 400;
    color: #828282;
  }
  .dairy-header h5 span{
    font-size: 2.2rem;
    color: #000;
  }
  .dairy-content textarea{
    min-height: 200px;
    line-height: 30px;
    text-align: justify;
    background: linear-gradient(transparent, transparent 29px, #000 29px);
    -webkit-background-size: 30px 30px;
    background-size: 30px 30px;
    border: none;
  }
</style>
