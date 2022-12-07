<template>
  <div class="picker-background"></div>
  <section class="station-picker">
    <div class="picker-header">
      <span class="pointer" @click="$emit('close')">back </span> <span> Add to playlist </span><span></span>
    </div>
    <button class="create-btn" @click="createStation">New Playlist</button>
    <div class="search-input">
      <input v-model="searchStr" type="search" placeholder="Find playlist">
      <search-icon />
    </div>
    <ul class="clean-list">
      <li v-for="station in stations" :key="station._id" @click="addToStation(station._id)"
        class="flex align-center pointer">
        <div class="img-container">
          <img :src="station.imgUrl || station.songs[0]?.imgUrl?.medium || station.songs[0]?.imgUrl" class="fit-img" />
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

export default {
  name: 'login',
  props: ['user', 'song'],
  components: { searchIcon },
  data() {
    return {
    }
  },
  computed: {
    stations() {
      const userStations = this.user.stations.filter(s => s.owner === this.user._id).map(s => s._id)
      return this.$store.getters.stations.filter(s => userStations.includes(s._id))
    },
  },
  created() {
  },
  methods: {
    async addToStation(stationId) {
      try {
        const editedStation = JSON.parse(JSON.stringify(this.stations.find(s => s._id === stationId)))
        editedStation.songs.push(this.song)
        await this.$store.dispatch({type:'updateStation',station:editedStation})
        showSuccessMsg('Added to playlist')
        this.$emit('close')

        // this.loadStation()
        // if (this.isCurrStationPlayed && this.isPlaying)
        //   this.$store.commit({ type: 'updatePlayingOrder', songs: editedStation.songs })

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

    }
  }
}

</script>