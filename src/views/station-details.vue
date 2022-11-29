<template>
  <section v-if="station" class="station-details">
    <section class="station-preview">
      <img :src="station.imgUrl" alt="">
      <label>PLAYLIST</label>
      <h1>{{ station.name }}</h1>
      <label>{{ this.station.songs.length }} songs</label>
    </section>
    <section>
      PLAY | MORE
    </section>
    <section class="song-list-header flex">
      <div class="list-song-index">#</div>
      <div class="list-song-title"><small>Title</small></div>
      <div class="list-song-date"><small>Date Added</small></div>
      <div class="list-song-length"><small>Time:</small></div>
    </section>
    <hr>
    <song-list v-if="station.songs.length" :songs="station.songs" />
    <div v-else>Add some songs</div>
  </section>
</template>

<script>
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { stationService } from '../services/station.service'
import { getActionRemoveStation, getActionUpdateStation } from '../store/station.store'
import songList from '../cmps/song-list.vue'
export default {
  data() {
    return {
      station: null,
    }
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedinUser
    },
    stations() {
      return this.$store.getters.stations
    }
  },
  mounted() {
    // this.$store.dispatch({ type: 'loadStations' })
    const stationId = this.$route.params.id
    stationService.getById(stationId).then(station => this.station = station)
  },
  methods: {
    async addStation() {
      try {
        await this.$store.dispatch({ type: 'addStation', station: this.stationToAdd })
        showSuccessMsg('Station added')
        this.station = stationService.getEmptyStation()
      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot add station')
      }
    },
    async removeStation(stationId) {
      try {
        await this.$store.dispatch(getActionRemoveStation(stationId))
        showSuccessMsg('Station removed')

      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot remove station')
      }
    },
    async updateStation(station) {
      try {
        station = { ...station }
        station.name = prompt('New name?', station.name)
        await this.$store.dispatch(getActionUpdateStation(station))
        showSuccessMsg('Station removed')

      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot remove station')
      }
    }
  },
  components: {
    songList
  }


}
</script>
