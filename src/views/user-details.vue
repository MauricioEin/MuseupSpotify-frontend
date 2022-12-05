<template>
  <section class="user-details content-layout" v-if="user">
    <!-- <h1>User Details - {{ user.fullname }}</h1>
    <h3>{{ user.username }} score: {{ user.score }}</h3>
    <ul>
      <li v-for="review in user.givenReviews" :key="review._id">
        {{ review.txt }}
        <router-link :to="`/user/${review.aboutUser._id}`">
          About {{ review.aboutUser.fullname }}
        </router-link>
      </li>
    </ul> -->
    <!-- <section class="user-info"> -->
    <div>

      <label class="user-img-container">
        <input hidden type="file" accept="image/.jpg, image/.jpeg, image/.png" @change="handleFile">
        <img v-if="imgUrl" :src="imgUrl" class="fit-img" alt="">
        <div v-else><user-portrait /></div>
      </label>
      <div class="user-info">
        <label>Profile</label>
        <h1>{{ user.fullname }}</h1>
        <small>{{ user.likedSongs.length }} liked songs</small>
      </div>
    </div>
  </section>

  <details>
    <summary>Full JSON</summary>
    <pre>{{ user }}</pre>
  </details>

  <!-- </section> -->
</template>

<script>
// import {userService} from '../services/user.service'
import userPortrait from '../assets/svgs/user-portrait.vue'
import { uploadImg } from '../services/upload.service'

export default {
  data() {
    return {
      // user: null
    }
  },
  async created() {
    // const user = await userService.getById(id)
    // this.user = user
  },
  watch: {
    userId: {
      handler() {
        if (this.userId) {
          this.$store.dispatch({ type: "loadAndWatchUser", userId: this.userId })
        }
      },
      immediate: true,
    },
  },
  computed: {
    user() {
      return this.$store.getters.watchedUser
    },
    userId() {
      return this.$route.params.id
    },
    imgUrl() {
      return this.$store.getters.loggedinUser?.profileImg
    },
    loggedInUser(){
      return this.$store.getters.loggedinUser
    }
  },

  methods:{
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
                this.$store.commit({type:'updateUserImg', url: res.url})
                
                // console.log(JSON.parse(JSON.stringify(this.loggedInUser)));
                var user = JSON.parse(JSON.stringify(this.loggedInUser))
                this.$store.dispatch({type:'updateUser', user})
                // user.profileImg = res.url

            } catch (err) {
                console.log('COULDNT UPDATE IMG')
                console.dir(err)
                throw err
            } finally {
                this.isLoading = false
            }
        },
  },

  components: {
    userPortrait,
  }
}
</script>