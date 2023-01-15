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
        <button @click="createStation">
          <plus-btn-svg />
        </button>
      </div>

    </section>
    <ul class="station-library-list">
      <div v-if="!stations" class="skeleton-vqlfosng44v"></div>
      <div v-if="!stations" class="skeleton-7b7uvxywsks"></div>
      <div v-if="!stations" class="skeleton-7b7uvxywsks"></div>
      <div v-if="!stations" class="skeleton-7b7uvxywsks"></div>
      <div v-if="!stations" class="skeleton-7b7uvxywsks"></div>
      <div v-if="!stations" class="skeleton-7b7uvxywsks"></div>
      <div v-if="!stations" class="skeleton-7b7uvxywsks"></div>
      <div v-if="!stations" class="skeleton-7b7uvxywsks"></div>
      <div v-if="!stations" class="skeleton-7b7uvxywsks"></div>
      <div v-if="!stations" class="skeleton-7b7uvxywsks"></div>
      <div v-if="!stations" class="skeleton-7b7uvxywsks"></div>
      <div v-if="!stations" class="skeleton-7b7uvxywsks"></div>
      <div v-if="!stations" class="skeleton-7b7uvxywsks"></div>
      <div v-if="!stations" class="skeleton-7b7uvxywsks"></div>
      <div v-if="!stations" class="skeleton-7b7uvxywsks"></div>
      <div v-if="!stations" class="skeleton-7b7uvxywsks"></div>
      <div v-if="!stations" class="skeleton-7b7uvxywsks"></div>
      <div v-if="!stations" class="skeleton-7b7uvxywsks"></div>
      <div v-if="!stations" class="skeleton-7b7uvxywsks"></div>
      <div v-if="!stations" class="skeleton-7b7uvxywsks"></div>
      <div v-if="!stations" class="skeleton-7b7uvxywsks"></div>
      <liked-songs-card v-if="loggedinUser._id !== 'demo' && stations" />
      <station-preview v-for="station in stations" :station="station" :key="station?._id || 'error'" />
    </ul>

    <login-modal :action="'start adding playlists'" v-if="!loggedinUser || !loggedinUser._id" />
    <login-modal :action="'create new stations'"
      v-if="isCreating && (!loggedinUser || !loggedinUser._id || loggedinUser._id === 'guest')" />

  </section>
</template>

<script>
import { stationService } from '../services/station.service'
import { socketService } from '../services/socket.service'
import stationList from '../cmps/station-list.vue'
import stationPreview from '../cmps/station-preview.vue'
import likedSongsCard from '../cmps/liked-songs-card.vue'
import loginModal from '../cmps/login-modal.vue'

import searchIcon from '../assets/svgs/search-icon.vue'
import plusBtnSvg from '../assets/svgs/plus-btn-svg.vue'
import userPortrait from '../assets/svgs/user-portrait.vue'

export default {

  data() {
    return {
      isCreating: false
    }
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
    },
    stations() {
      return this.$store.getters.userStations
    }
  }, watch: {
    stations() {
    }
  },
  methods: {
    async createStation() {
      this.isCreating = true
      if (!this.loggedinUser || !this.loggedinUser._id || this.loggedinUser._id === 'guest') return
      const newStation = { name: 'My Playlist #' + (this.loggedinUser.stations.length + 1), songs: [], followers: [] }
      const savedStation = await this.$store.dispatch({ type: 'addStation', station: newStation })
      socketService.emit('station-added', savedStation)
      this.$router.push('/station/' + savedStation._id)
    },
  },
  watch: {
    loggedinUser() {
      console.log('changed')
      if (this.loggedinUser._id === 'guest') this.isCreating = false
    }
  },
  components: {
    stationList,
    searchIcon,
    plusBtnSvg,
    userPortrait,
    stationPreview,
    likedSongsCard,
    loginModal
  },
}
</script>
