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
      <!-- <img-uploader></img-uploader> -->
      <label for="upload">
        Upload Image
        <input hidden id="upload" type="file" accept="image/.jpg, image/.jpeg, image/.png" @change="handleFile" />
      </label>

      <button>Signup</button>
    </form>
  </section>
</template>

<script>
import imgUploader from "../cmps/img-uploader.vue";
import { uploadImg } from "../services/upload.service";
export default {
  name: 'signup',
  data() {
    return {
      signupCred: { username: '', password: '', fullname: '', profileImg: ''},
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
    },

    handleFile(ev) {
            console.log('ev', ev)
            let file
            if (ev.type === 'change') file = ev.target.files[0]
            console.log('file', file)
            this.onUploadFile(file)
        },
        async onUploadFile(file) {
            // this.isLoading = true
            console.log('loading...')
            try {
                const res = await uploadImg(file)
                console.log('res.url', res.url)
                // this.editedStation.imgUrl = res.url
                // this.$emit('saved', res.url)
                this.signupCred.profileImg = res.url
            } catch (err) {
                console.log('COULDNT UPDATE IMG')
                console.dir(err)
                throw err
            } finally {
                this.isLoading = false
            }
        },
  },

  components:{
    imgUploader
  }
}
</script>