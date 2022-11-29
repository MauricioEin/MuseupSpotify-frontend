<template>
  <div class="container home">
    <ul class="station-list">
      <li v-for="station in stations" :key="station._id">
        <p>
          {{  station.name  }}
        </p>
        <p>
          Songs: {{  station.songs.length  }}
        </p>
        <router-link :to="'station/'  +  station._id">Details</router-link>
        <button @click="removeStation(station._id)">x</button>
        <button @click="updateStation(station)">Update</button>
      </li>
    </ul>
    <hr />
    <form @submit.prevent="addStation()">
      <h2>Add station</h2>
      <input type="text" v-model="stationToAdd.name" />
      <button>Save</button>
    </form>
  </div>
</template>

<script>
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { stationService } from '../services/station.service'
import { getActionRemoveStation, getActionUpdateStation } from '../store/station.store'
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
  }


}
</script>
