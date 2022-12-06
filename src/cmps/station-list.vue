<template>
  <div class="station-list-container">
    <h1>{{ title }}</h1>
    <ul class="station-list">
      <li class="station-card" v-for="station in stations" :key="station._id" @click="goToStation(station._id)">
        <img :src="getStationImg(station)" alt="" class="station-img">
        <div class="card-details">
          <p class="station-title cut-text">
            {{ station.name }}
          </p>

          <!-- <pre>{{ station }}</pre> -->
          <!-- <p class="station-desc cut-text">
            {{ station.name }}
          </p>
          <p class="station-desc cut-text">
            The essential tracks, all in one playlist.
          </p> -->
          <p v-if="station.desc" class="station-desc cut-text">{{ station.desc }}</p>
          <p v-else class="station-desc cut-text">By {{ station.owner.username }}</p>
          <button v-if="(station.songs.length)" class="btn-play-playlist"
            @click.stop="toggleStation(station)"><pause-btn
              v-if="isCurrStationPlayed(station)" /><play-btn v-else /></button>

        </div>
      </li>
    </ul>

  </div>
</template>
  
<script>
//@click.stop="(!isPlaying) ? playStation(station) : toggleIsPlaying()"><pause-btn
import playBtn from '../assets/svgs/play-btn-svg.vue'
import pauseBtn from '../assets/svgs/media-player-stop.vue'
export default {

  props: {
    stations: {
      type: Array,
    },
    title: {
      type: String
    }
  },

  created() {
    this.$store.dispatch({ type: 'loadStations' })
  },
  methods: {
    toggleStation(station){
      if(!this.isCurrStationPlayed(station) && this.isPlaying ||
         !this.isCurrStationPlayed(station) && !this.isPlaying){
        this.playStation(station)
      } else this.toggleIsPlaying() 
    },

    getStationImg(station) {
      if (station.imgUrl) return station.imgUrl
      else if (station?.songs[0]?.imgUrl) return station.songs[0]?.imgUrl.medium
      else return 'https://i.ibb.co/RChzLhY/2022-12-03-132853.jpg'
    },

    goToStation(id) {
      this.$router.push({ path: `/station/${id}` })
    },

    playStation(station) {
      this.$store.commit({ type: 'playStation', station })
    },

    toggleIsPlaying() {
      this.$store.commit('toggleIsPlaying')
    },

    isCurrStationPlayed(station) {
      return (this.isPlaying && station._id === this.getPlayingStation._id)
    },
  },

  computed: {
    isPlaying() {
      return this.$store.getters.isPlaying
    },

    getPlayingStation() {
      return this.$store.getters.getPlayingStation
    },

    loggedInUser() {
      return this.$store.getters.loggedInUser
    }
  },

  components: {
    playBtn,
    pauseBtn
  }

}
</script>
  