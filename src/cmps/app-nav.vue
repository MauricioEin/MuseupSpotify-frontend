<template>
  <section class="nav-container">
    <div class="logo" to="/station">
      <logo-svg /> <span>Spotify</span>
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
        <router-link @click="createStation" to="">
          <div class="nav-btn flex align-center justify-center">
            <plus-btn-svg />
          </div>
          <span>Create Playlist</span>
        </router-link>
        <router-link to="/collection/tracks">
          <div class="nav-btn heart-btn flex align-center justify-center">
            <heart-btn-svg />
          </div>
          <span>Liked Songs</span>
        </router-link>
      </div>
    </nav>
    <hr>
    <ul class="user-stations clean-list">
      <li v-for="station in stations" :key="station._id">
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

export default {
  components: { logoSvg, searchBtnSvg, homeBtnSvg, libraryBtnSvg, plusBtnSvg, heartBtnSvg },
  data() {
    return {
      stations: [
        { _id: 123, name: 'Ilan', songs: [] }, { _id: 1234, name: 'Tomer', songs: [] }, { _id: 1233, name: 'Mauricio', songs: [] }
      ]
    }
  },
  methods: {
    async createStation() {
      console.log('creating!')
      const newStation = { name: 'My Playlist #' + (this.stations.length + 1), songs: [] }
      const savedStation = await this.$store.dispatch({ type: 'addStation', station: newStation })
      this.stations.unshift(savedStation) // ZMANI
      this.$router.push('/station/' + savedStation._id)
    }
  }
}
</script>