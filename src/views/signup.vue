<template>
  <section class="signup-page">
    <form @submit.prevent="doSignup">
      <h2>Signup</h2>
      <label>Full name</label>
      <input type="text" v-model="signupCred.fullname" placeholder="Your full name" />
      <label>Username</label>
      <input type="text" v-model="signupCred.username" placeholder="Username" />
      <label>Password</label>
      <input type="password" v-model="signupCred.password" placeholder="Password" />
      <button>Signup</button>
    </form>
    <!-- <details>
      <summary>
        Admin Section
      </summary>
      <ul>
        <li v-for="user in users" :key="user._id">
          <pre>{{ user }}</pre>
          <button @click="removeUser(user._id)">x</button>
        </li>
      </ul>
    </details> -->
  </section>
</template>

<script>
export default {
  name: 'signup',
  data() {
    return {
      signupCred: { username: '', password: '', fullname: '' },
    }
  },
  created() {
  },
  methods: {
    async doLogin() {
      if (!this.loginCred.username) {
        this.msg = 'Please enter username/password'
        return
      }
      try {
        await this.$store.dispatch({ type: "login", userCred: this.loginCred })
        this.$router.push('/')
      } catch (err) {
        console.log(err)
        this.msg = 'Failed to login'
      }
    },
    async doSignup() {
      if (!this.signupCred.fullname || !this.signupCred.password || !this.signupCred.username) {
        this.msg = 'Please fill up the form'
        return
      }
      await this.$store.dispatch({ type: 'signup', userCred: this.signupCred })
      this.$router.push('/')

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