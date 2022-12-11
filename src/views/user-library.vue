<template>
  <section class="user-collection content-layout">
    <section class="user-library-header">
      <div class="flex align-center">
        <div class="user-img-container">
          <img :src="imgSrc" alt="" v-if="imgSrc">
          <user-portrait v-else />
        </div>
        <h1>Your Library</h1>
      </div>

      <div class="library-actions">
        <!-- <button>
          <search-icon />
        </button> -->
        <button @click="createStation">
          <plus-btn-svg />
        </button>
      </div>

    </section>
    <!-- <station-list :stations="stations" /> -->
    <ul class="station-library-list">
      <div v-if="!stations.length" class="skeleton-vqlfosng44v"></div>
      <div v-if="!stations.length" class="skeleton-7b7uvxywsks"></div>
      <div v-if="!stations.length" class="skeleton-7b7uvxywsks"></div>
      <div v-if="!stations.length" class="skeleton-7b7uvxywsks"></div>
      <div v-if="!stations.length" class="skeleton-7b7uvxywsks"></div>
      <div v-if="!stations.length" class="skeleton-7b7uvxywsks"></div>
      <div v-if="!stations.length" class="skeleton-7b7uvxywsks"></div>
      <div v-if="!stations.length" class="skeleton-7b7uvxywsks"></div>
      <div v-if="!stations.length" class="skeleton-7b7uvxywsks"></div>
      <div v-if="!stations.length" class="skeleton-7b7uvxywsks"></div>
      <div v-if="!stations.length" class="skeleton-7b7uvxywsks"></div>
      <liked-songs-card v-if="loggedinUser._id !== 'demo' && stations.length" />
      <station-preview v-for="station in stations" :station="station" :key="station?._id || 'error'" />
    </ul>
  </section>
</template>

<script>
import { stationService } from '../services/station.service'
import { socketService } from '../services/socket.service'
import stationList from '../cmps/station-list.vue'
import stationPreview from '../cmps/station-preview.vue'
import likedSongsCard from '../cmps/liked-songs-card.vue'

import searchIcon from '../assets/svgs/search-icon.vue'
import plusBtnSvg from '../assets/svgs/plus-btn-svg.vue'
import userPortrait from '../assets/svgs/user-portrait.vue'

export default {

  data() {
    return {
      stations: [],
    }
  },

  created() {
    this.getUserStations()
  },

  methods: {
    async getUserStations() {
      const user = this.$store.getters.loggedinUser
      const userStations = user.stations.map(async (currStation) => {
        const station = await stationService.getById(currStation._id)
        return station
      })
      const stations = await Promise.all(userStations)
      console.log('stations', stations)
      this.stations = stations
    },
    async createStation() {
      console.log('creating!')
      const newStation = { name: 'My Playlist #' + (this.loggedinUser.stations.length + 1), songs: [], followers: [] }
      const savedStation = await this.$store.dispatch({ type: 'addStation', station: newStation })
      socketService.emit('station-added', savedStation)
      this.$router.push('/station/' + savedStation._id)
    },
  },

  components: {
    stationList,
    searchIcon,
    plusBtnSvg,
    userPortrait,
    stationPreview,
    likedSongsCard
  },

  computed: {
    loggedinUser() {
      return this.$store.getters.loggedinUser
    },
    userSongs() {
      return this.loggedinUser?.songs
    },
    imgSrc() {
      return this.loggedinUser?.profileImg
    }
  }
}
</script>
