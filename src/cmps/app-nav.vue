<template>
  <section class="nav-container">
    <div class="logo pointer" @click="$router.push('/station')">
      <logo-svg /> <span>MuseUp</span>
    </div>
    <nav class="permanent-nav">
      <ul class="app-nav clean-list">
        <li>
          <router-link to="/station">
            <home-btn-svg />
            <span>Home</span>
          </router-link>
        </li>
        <li>
          <router-link to="/search">
            <search-btn-svg />
            <span>Search</span>
          </router-link>
        </li>
        <li>
          <router-link to="/collection">
            <library-btn-svg />
            <span>Your Library</span>
          </router-link>
        </li>
      </ul>
      <div class="user-nav flex column">
        <router-link @click="createStation" to="" class="create">
          <div class="btn-nav flex align-center justify-center">
            <plus-btn-svg />
          </div>
          <span>Create Playlist</span>
        </router-link>
        <router-link to="/collection/tracks">
          <div class="btn-nav btn-heart flex align-center justify-center">
            <heart-btn-svg />
          </div>
          <span>Liked Songs</span>
        </router-link>
      </div>
    </nav>
    <hr>
    <ul v-if="loggedinUser" class="user-stations clean-list">
      <li v-for="station in loggedinUser.stations" :key="station._id">
        <router-link :to="'/station/' + station._id" class="light flex align-center"> {{ station.name }} </router-link>
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
import { socketService } from '../services/socket.service'

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
      socketService.emit('station-added', savedStation)
      this.$router.push('/station/' + savedStation._id)
    },

  }
}
</script>