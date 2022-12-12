<template>
  <div class="picker-screen"> </div>
  <section class="station-picker">
    <div class="picker-header">
      <span class="pointer" @click="$emit('close')"><left-arrow-svg /></span> <span> Add to a playlist
      </span><span></span>
    </div>
    <button class="create-btn" @click="createStation">New Playlist</button>
    <div class="search-input">
      <input v-model="searchStr" @input="filterStations" type="search" placeholder="Find playlist">
      <search-icon />
    </div>

    <ul class="clean-list" v-if="filteredStations.length" :key="listKey">
      <li v-for="station in filteredStations" :key="station._id" @click="addToStation(station._id)"
        class="flex align-center pointer">
        <div class="img-container">
          <img
            :src="station.imgUrl?.medium || station.imgUrl || station.songs ? (station.songs[0]?.imgUrl?.medium || station.songs[0]?.imgUrl) : 'https://i.ibb.co/RChzLhY/2022-12-03-132853.jpg'"
            class="fit-img" />
        </div>
        <div>
          <h4>{{ station.name }}</h4>
          <p>by {{ station.owner.username }}</p>
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'

import searchIcon from '../assets/svgs/search-icon.vue'
import leftArrowSvg from '../assets/svgs/left-arrow-svg.vue'
import { stationService } from '../services/station.service'


export default {
  name: 'station-picker',
  props: ['user', 'song'],
  components: { searchIcon, leftArrowSvg },
  data() {
    return {
      searchStr: '',
      listKey: 0,
      stations: []
    }
  },
  computed: {

    filteredStations(){
      const regex = new RegExp(this.searchStr, 'i')
    return this.stations.filter(station => station && (regex.test(station.name) || regex.test(station.desc)))

    }
  },
  created() {
    this.getUserStations()
  },
  methods: {
    async getUserStations() {
      const userStationsIds = this.user.stations.filter(s => s.owner === this.user._id).map(s => s._id)
      console.log('USERSTATIONSIDS', userStationsIds)
      const userStationPrms = userStationsIds.map(id => stationService.getById(id))
      console.log('userStationsPrms', userStationPrms)
      var userStations = await Promise.all(userStationPrms)
      userStations = userStations.filter(station => station)
      console.log('userStations', userStations)
      this.stations = userStations

    }
    ,
    async addToStation(stationId) {
      console.log('ID', stationId)
      try {
        const editedStation = JSON.parse(JSON.stringify(this.stations.find(s => s._id === stationId)))
        editedStation.songs.push(this.song)
        await this.$store.dispatch({ type: 'updateStation', station: editedStation })
        showSuccessMsg('Added to playlist')
        this.$emit('close')
        this.$router.push(`/station/${stationId}`)



        // // this.loadStation()
        // // if (this.isCurrStationPlayed && this.isPlaying)
        // //   this.$store.commit({ type: 'updatePlayingOrder', songs: editedStation.songs })

      } catch (err) {
        console.log(err)
        showErrorMsg('Failed adding song to playlist')
      }

    },
    async createStation() {
      console.log('creating!')
      const newStation = { name: 'My Playlist #' + (this.user.stations.length + 1), songs: [this.song], followers: [] }
      const savedStation = await this.$store.dispatch({ type: 'addStation', station: newStation })
      this.$router.push('/station/' + savedStation._id)
      this.$emit('close')

    },
  },
  watch: {
    stations() {
      this.listKey++

    }
  }
}

</script>