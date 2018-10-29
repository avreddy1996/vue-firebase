<template>
  <div class="signup md-layout md-alignment-center-center" style="text-align: center;">
    <div class="md-layout-item md-size-100">
      <img src="../assets/logo.png" id="#photo">
    </div>
    <div class="md-size-50">
      <h3>let's create an account</h3>
      <md-field>
        <label>Email</label>
        <md-input v-model="email"></md-input>
        <md-icon>email</md-icon>
      </md-field>
      <md-field>
        <label>Password</label>
        <md-input v-model="password" type="password"></md-input>
      </md-field>
      <md-button class="md-primary md-raised" v-on:click="signup">{{loading?'Loading Pls. Wait':'Sign Up'}}</md-button>
      <p>Already have an account! <router-link to="/login">Click here</router-link></p>
      <h5 v-if="error">{{error}}</h5>
    </div>
  </div>
</template>
<script>
  import firebase from 'firebase'
  export default {
    name : 'signUp',
    data : function () {
      return {
        email : '',
        password : '',
        error : '',
        loading : false
      }
    },
    methods : {
      signup: function () {
        const self = this;
        const ref = firebase.storage().ref('logo.png');
        this.loading = true;
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
          function (user) {
            ref.getDownloadURL().then(function (url) {
              firebase.database().ref('users/' + user.user.uid).set({
                name: self.email,
                email: self.email,
                image: url,
              }).then(function (user) {
                self.$router.replace('/');
                self.loading = false;
              },function (err) {
                self.error = err;
                self.loading = false;
              })
            })
          },
          function (err) {
            self.error = err;
            self.loading = false;
          }
        )
      }
    }
  }
</script>
