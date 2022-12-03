<template>
  <section class="user-details details-layout" v-if="user">
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

      <div class="user-img-container">
        <img v-if="imgUrl" :src="imgUrl" alt="">
        <div v-else><user-portrait /></div>
      </div>
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
      return this.user?.imgUrl
    }
  },
  components: {
    userPortrait,
  }
}
</script>