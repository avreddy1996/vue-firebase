<template>
  <div class="login md-layout md-gutter md-alignment-center">
    <div class="md-layout-item md-size-100">
      <img src="../assets/logo.png" class="md-size-100">
    </div>
    <div class="md-size-50">
      <h4>Login</h4>
      <md-field>
        <label>Email</label>
        <md-input v-model="email"></md-input>
        <md-icon>email</md-icon>
      </md-field>
      <md-field>
        <label>Password</label>
        <md-input v-model="password" type="password"></md-input>
      </md-field>
      <md-button class="md-primary md-raised" v-on:click="signin">{{this.loading?'loading wait':'Login'}}</md-button>
      <p>Don't have an account yet? <router-link to="/signup">Click here</router-link></p>
    </div>
  </div>
</template>
<script>
  import firebase from 'firebase'


  export default {
    name: 'login',
    data: function() {
      return {
        email: '',
        password: '',
        loading : false
      }
    },
    methods : {
      signin : function () {
        const self = this;
        this.loading = true;
        firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
          function (user) {
            self.$router.replace('/');
          },
          function (err) {
            alert('error');
            console.log(err);
          }
        );
      }
    }
  }
</script>
