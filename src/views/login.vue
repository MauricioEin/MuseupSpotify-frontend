<template>
  <section class="login-page">
    <form @submit.prevent="doLogin">
      <h2>Login</h2>
      <label>Username</label>
      <input v-model="loginCred.username" type="text" placeholder="Username" required>
      <label>Password</label>
      <input v-model="loginCred.password" type="password" placeholder="Password" required>
      <button>Login</button>
    </form>
  </section>
</template>

<script>
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
export default {
  name: 'login',
  data() {
    return {
      loginCred: { username: '', password: '' },
    }
  },
  computed: {
    users() {
      return this.$store.getters.users
    },
  },
  created() {
  },
  methods: {
    async doLogin() {
      if (!this.loginCred.username) {
        // this.msg = 'Please enter username/password'
        showErrorMsg('Please enter valid username/password')
        return
      }
      try {
        await this.$store.dispatch({ type: "login", userCred: this.loginCred })
        this.$router.push('/station')
        showSuccessMsg('Welcome back!')
      } catch (err) {
        console.log(err)
        // this.msg = 'Failed to login'
        showErrorMsg('Failed to login')
      }
    },
    loadUsers() {
      this.$store.dispatch({ type: "loadUsers" })
    },
    async removeUser(userId) {
      try {
        await this.$store.dispatch({ type: "removeUser", userId })
        this.msg = 'User removed'
      } catch (err) {
        this.msg = 'Failed to remove user'
      }
    }
  }
}
</script>