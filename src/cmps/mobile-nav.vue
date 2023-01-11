<template><section class="mobile-nav">

  <!-- preparation for mobile nav -->
  <ul class="clean-list flex">
        <li class="mobile-nav-btn">
          <router-link to="/station" class="flex column align-center">
            <home-btn-svg />
            <span class="light">Home</span>
          </router-link>
        </li>
        <li class="mobile-nav-btn">
          <router-link to="/search" class="flex column align-center">
            <search-btn-svg />
            <span class="light">Search</span>
          </router-link>
        </li>
        <li class="mobile-nav-btn">
          <router-link to="/collection" class="flex column align-center">
            <library-btn-svg />
            <span class="light">Your Library</span>
          </router-link>
        </li>
      </ul>
</section>

</template>

<script>
import logoSvg from '../assets/svgs/logo-svg.vue'
import searchBtnSvg from '../assets/svgs/search-btn-svg.vue'
import homeBtnSvg from '../assets/svgs/home-btn-svg.vue'
import libraryBtnSvg from '../assets/svgs/library-btn-svg.vue'
import plusBtnSvg from '../assets/svgs/plus-btn-svg.vue'
import heartBtnSvg from '../assets/svgs/heart-btn-svg.vue'

export default {
  components: { logoSvg, searchBtnSvg, homeBtnSvg, libraryBtnSvg, plusBtnSvg, heartBtnSvg },
  computed: {
    // stations() {
    //   return this.$store.getters.stations
    // },
    loggedinUser() {
      return this.$store.getters.loggedinUser
    }
  },
  methods: {
    async createStation() {
      console.log('creating!')
      const newStation = { name: 'My Playlist #' + (this.loggedinUser.stations.length + 1), songs: [], followers: [] }
      const savedStation = await this.$store.dispatch({ type: 'addStation', station: newStation })
      this.$router.push('/station/' + savedStation._id)
    },

  }
}
</script>