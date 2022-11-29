<template>
DETAILSSSSS
</template>

<script>
import {showErrorMsg, showSuccessMsg} from '../services/event-bus.service'
import {stationService} from '../services/station.service'
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
    this.$store.dispatch({type: 'loadStations'})
  },
  methods: {
    async addStation() {
      try {
        await this.$store.dispatch({type: 'addStation', station: this.stationToAdd})
        showSuccessMsg('Station added')
        this.stationToAdd = stationService.getEmptyStation()
      } catch(err) {
        console.log(err)
        showErrorMsg('Cannot add station')
      }
    },
    async removeStation(stationId) {
      try {
        await this.$store.dispatch(getActionRemoveStation(stationId))
        showSuccessMsg('Station removed')

      } catch(err) {
        console.log(err)
        showErrorMsg('Cannot remove station')
      }
    },
    async updateStation(station) {
      try {
        station = {...station}
        station.name = prompt('New name?', station.name)
        await this.$store.dispatch(getActionUpdateStation(station))
        showSuccessMsg('Station removed')

      } catch(err) {
        console.log(err)
        showErrorMsg('Cannot remove station')
      }
    }
  }

  
}
</script>
