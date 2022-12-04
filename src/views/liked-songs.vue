<template>
  <section class="liked-songs station-details content-layout">
    <section class="station-preview flex full">
      <div class="img-container">
        <img src="../assets/img/likedSongs.png" class="fit-img" />
      </div>

      <div class="station-summary">
        <p class="summary-title">PLAYLIST</p>
        <h1>Liked Songs</h1>
        <p class="mini-dashboard"> <span class="username">{{ user.username }} </span> • {{ user.likedSongs.length }} songs </p>
      </div>
    </section>

    <section class="song-list-container content-layout">
      <section class="playlist-actions">
        <button class="btn-play-green" v-if="user.likedSongs.length"
          @click.stop="(isCurrStationPlayed && isPlayed) ? toggleIsPlayed() : playStation()">
          <pause-btn v-if="isCurrStationPlayed && isPlayed" />
          <play-btn v-else />
        </button>
      </section>
      <song-list v-if="user.likedSongs?.length" :songs="user.likedSongs" :loggedInUser="user" @saveSong="saveSong"
        @play="playStation" :isLikedSongs="true" />
      <!--  -->
    </section>

  </section>
</template>

<script>

import songList from '../cmps/song-list.vue'


import pauseBtn from '../assets/svgs/media-player-stop.vue'
import playBtn from '../assets/svgs/play-btn-svg.vue'

export default {
  components: {
    songList,
    playBtn,
    pauseBtn,

  },
  data() {
    return {

    }
  },
  computed: {
    user() {
      // console.log('SONGS:',)
      return this.$store.getters.loggedinUser
    },
    isPlayed() {
      return this.$store.getters.isPlayed
    },
    getPlayingStation() {
      return this.$store.getters.getPlayingStation
    },
    isCurrStationPlayed() {
      return this.getPlayingStation._id === this.user._id
    },
    playingSongIdx() {
      return this.$store.getters.getPlayingSongIdx
    },
    station() {
      return { _id: this.user._id, songs: [...this.user.likedSongs] }
    }
  },
  methods: {
    playStation(idx) {
      console.log('playing')
      if (this.isCurrStationPlayed && (idx === undefined || idx === this.playingSongIdx)) return this.toggleIsPlayed()
      console.log('got here with', idx, this.playingSongIdx, 'station:', this.station,)
      this.$store.commit({ type: 'playStation', station: this.station, idx: idx || 0 })
    },
    toggleIsPlayed() {
      this.$store.commit('toggleIsPlayed')
    },
    saveSong(song) {
      console.log('saving', song)
      this.$store.dispatch({ type: 'saveSong', song })
    },

  },
}
</script>
