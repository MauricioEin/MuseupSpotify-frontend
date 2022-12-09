<template>
  <div class="skeleton-7b7uvxywsk" v-if="!stations"></div>
  <div class="card-loader flex" v-if="!stations">
    <div>
      <div class="skeleton-7b7uvxywsks"></div>
    </div>
    <div>
      <div class="skeleton-7b7uvxywsks"></div>
    </div>
    <div>
      <div class="skeleton-7b7uvxywsks"></div>
    </div>
    <div>
      <div class="skeleton-7b7uvxywsks"></div>
    </div>
    <div>
      <div class="skeleton-7b7uvxywsks"></div>
    </div>
    <div>
      <div class="skeleton-7b7uvxywsks"></div>
    </div>
  </div>
  <div class="station-list-container" v-if="(stations && stations.length)">
    <div class="station-list-head">
      <h1>{{ title }}</h1>
      <button @click.stop="goToStationLibrary" v-if="isIntersecting">Show all</button>
    </div>

    <ul class="station-list">
      <li ref="stationCard" class="station-card" v-for="station in stations" :key="station._id"
        @click="goToStation(station._id)">
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
          <p v-if="station.desc" class="station-desc">{{ station.desc }}</p>
          <p v-else class="station-desc cut-text">By {{ station.owner.username }}</p>
          <button v-if="(station.firstSong)" class="btn-play-playlist" @click.stop="toggleStation(station)">
            <pause-btn v-if="isCurrStationPlayed(station)" />
            <play-btn v-else />
          </button>

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

  data() {
    return {
      isIntersecting: false,

    }
  },

  async created() {
    await this.$store.dispatch({ type: 'loadStations' })
    this.resizeList()
  },
  methods: {
    toggleStation(station) {
      if (!this.isCurrStationPlayed(station) && this.isPlaying ||
        !this.isCurrStationPlayed(station) && !this.isPlaying) {
        this.playStation(station)
      } else this.toggleIsPlaying()
    },

    getStationImg(station) {
      if (station.imgUrl) return station.imgUrl
      else if (station?.firstSong?.imgUrl) return station.firstSong?.imgUrl.medium
      else return 'https://i.ibb.co/RChzLhY/2022-12-03-132853.jpg'
    },

    goToStation(id) {
      this.$router.push({ path: `/station/${id}` })
    },

    goToStationLibrary() {
      this.$router.push({ path: 'collection/all' })
    },

    playStation(station) {
      this.$store.commit({ type: 'toggleIsPlaying' })
      this.$store.commit({ type: 'playSong', song: JSON.parse(JSON.stringify(station.firstSong)), stationId:station._id })
      this.$store.dispatch({ type: 'playFromHomePage', station })
    },

    toggleIsPlaying() {
      this.$store.commit('toggleIsPlaying')
    },

    isCurrStationPlayed(station) {
      return (this.isPlaying && station._id === this.getPlayingStation._id)
    },
    resizeList() {
      // if(this.title !== 'Trending now') return
      // console.log('RESIZING',this.title, 'num of stations:', this.stations.length)
      if (window.innerWidth < 860) {
        this.isIntersecting = false
        if (!this.$refs.stationCard?.length) return
        this.$refs.stationCard.forEach(elStation => {
          elStation.style.display = 'list-item'
        })
      } else {
        this.isIntersecting = false
        // console.log('hi1', this.isIntersecting)
        // console.log('stationcard:', this.$refs.stationCard)
        if (!this.$refs.stationCard?.length) return
        // console.log('hi2')

        this.$refs.stationCard.forEach(elStation => {

          elStation.style.display = 'list-item'
          const rect = elStation.getClientRects()[0]

          if (rect.right > window.innerWidth - 14) {
            this.isIntersecting = true
            elStation.style.display = 'none'
          }
        })
        // console.log('hi3')

      }
      this.$emit('doneResize')
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
    },

  },

  mounted() {
    window.addEventListener('resize', this.resizeList)
  },

  unmounted() {
    window.removeEventListener('resize', this.resizeList)
  },
  watch: {
    stations() {
      if (!this.stations.length) return
      this.resizeList()
    }
  }
  ,

  // watch: {
  //   station
  // }

  components: {
    playBtn,
    pauseBtn
  }

}
</script>
  