<template>
  <header class="app-header details-layout">
    <!-- <nav>
      <router-link to="/">
        <span role="img" aria-label="logo">🙏</span>
      </router-link>
      <router-link to="/car">Cars</router-link>
      <router-link to="/station">Stations</router-link>
      <router-link to="/review">Reviews</router-link>
      <router-link to="/chat">Chat</router-link>
      <router-link to="/login">Login / Signup</router-link>
    </nav> -->
    <nav class="flex">
      <button>←</button>
      <button>→</button>
      <main-search v-if="isOnSearchPage" />
    </nav>
    <section class="loggedin-user" v-if="loggedInUser">
      <router-link :to="`/user/${loggedInUser._id}`">
        {{ loggedInUser.fullname }}
      </router-link>
      <span>{{ loggedInUser.score.toLocaleString() }}</span>
    </section>
  </header>
</template>
<script>
import mainSearch from './main-search.vue';
export default {
  data() {
    return {

    }
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedinUser
    },
    isOnSearchPage() {
      return (this.$route.fullPath === '/search')
    }
  },
  components: {
    mainSearch
  },
  watch: {

  }
}
</script>