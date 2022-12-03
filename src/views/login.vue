<template>
  <div class="login-page">
    <div>
      <!-- <h3>
        Loggedin User:
        {{ loggedinUser.username }}
        <button @click="doLogout">Logout</button>
      </h3> -->
      <h2>Login</h2>
      <form @submit.prevent="doLogin">
        <!-- <select v-model="loginCred.username">
          <option value="">Select User</option>
          <option v-for="user in users" :key="user._id" :value="user.username">{{ user.fullname }}</option>
        </select> -->
        <label>
          Username
          <input v-model="loginCred.username" type="text" placeholder="Username" required>
        </label>
        <label>
          Password
          <input v-model="loginCred.password" type="password" placeholder="Password" required>
        </label>
        <button>Login</button>
      </form>
    </div>
    <hr />
    <details>
      <summary>
        Admin Section
      </summary>
      <ul>
        <li v-for="user in users" :key="user._id">
          <pre>{{ user }}</pre>
          <button @click="removeUser(user._id)">x</button>
        </li>
      </ul>
    </details>
  </div>
</template>

<script>
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
export default {
  name: 'login',
  data() {
    return {
      loginCred: { username: 'muki', password: '123' },
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
        this.$router.push('/')
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