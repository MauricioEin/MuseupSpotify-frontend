<template>
  <section class="station-details">
    <section class="station-preview">
      <img :src="stationToAdd.imgUrl" alt="">
      <label>PLAYLIST</label>
      <h1>{{ stationToAdd.name }}</h1>
      <label>{{ this.stationToAdd.songs.length }} songs</label>
    </section>
    <section>
      Actions
    </section>
    <song-list v-if="this.stationToAdd.songs" :songs="stationToAdd.songs" />
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
      stationToAdd: stationService.getEmptyStation()
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
  created() {
    this.$store.dispatch({ type: 'loadStations' })
  },
  methods: {
    async addStation() {
      try {
        await this.$store.dispatch({ type: 'addStation', station: this.stationToAdd })
        showSuccessMsg('Station added')
        this.stationToAdd = stationService.getEmptyStation()
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
