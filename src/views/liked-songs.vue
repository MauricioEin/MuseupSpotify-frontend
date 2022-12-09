<template>
  <section class="liked-songs station-details content-layout">
    <section class="station-preview flex full">
      <div class="img-container">
        <img src="../assets/img/likedSongs.png" class="fit-img" />
      </div>

      <div class="station-summary">
        <p class="summary-title">PLAYLIST</p>
        <h1>Liked Songs</h1>
        <p class="mini-dashboard">
        <div v-if="user?.profileImg" class="user-img-container">
          <img class="fit-img" :src="userImg" alt="">
        </div>

        <span class="username">{{ user.username }}</span>
        &nbsp;&nbsp;•&nbsp;&nbsp;
        {{ songsCount }}
        </p>
      </div>
    </section>

    <section class="song-list-container content-layout">
      <section class="playlist-actions">
        <button class="btn-play-green" v-if="user.likedSongs.length"
          @click.stop="(isCurrStationPlayed && isPlaying) ? toggleIsPlaying() : playStation()">
          <pause-btn v-if="isCurrStationPlayed && isPlaying" />
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
    isPlaying() {
      return this.$store.getters.isPlaying
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
    },
    songsCount() {
      const count = this.user.likedSongs.length
      return `${count} ${count === 1 ? 'song' : 'songs'}`
    },
    userImg() {
      return this.user.profileImg || './src/assets/svgs/user-portrait.vue'
    }
  },
  methods: {
    playStation(idx) {
      console.log('playing')
      if (this.isCurrStationPlayed && (idx === undefined || idx === this.playingSongIdx)) return this.toggleIsPlaying()
      console.log('got here with', idx, this.playingSongIdx, 'station:', this.station,)
      this.$store.commit({ type: 'playStation', station: this.station, idx: idx || 0 })
    },
    toggleIsPlaying() {
      this.$store.commit('toggleIsPlaying')
    },
    saveSong(song) {
      console.log('saving', song)
      this.$store.dispatch({ type: 'saveSong', song })
    },

  },
}
</script>
