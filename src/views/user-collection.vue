<template>
  <div class="container home">
    <h1>Playlists</h1>
    <ul class="station-list">
      <li class="station-card" v-for="station in stations" :key="station._id">
        <img src="https://i.scdn.co/image/ab67706f0000000262a2b2b0d95d902b307837d2" alt="">
        <div class="card-details">
          <p class="station-title cut-text" >
            {{  station.name  }}
          </p>
          <p class="station-desc cut-text">
            {{  station.name  }}
          </p >
          <p class="station-desc cut-text">
            The essential tracks, all in one playlist.
          </p >
          <button class="play-playlist-btn"><play-btn/></button>
          
          <!-- <router-link :to="'station/'  +  station._id">Details</router-link>
          <button @click="removeStation(station._id)">x</button>
          <button @click="updateStation(station)">Update</button> -->
        </div>
      </li>
    </ul>
    <!-- <hr />
    <form @submit.prevent="addStation()">
      <h2>Add station</h2>
      <input type="text" v-model="stationToAdd.name" />
      <button>Save</button>
    </form> -->
  </div>
</template>

<script>
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { stationService } from '../services/station.service'
import { getActionRemoveStation, getActionUpdateStation } from '../store/station.store'
import playBtn from '../assets/svgs/play-btn-svg.vue'
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
    },

  },
  components:{
    playBtn,
  }


}
</script>
