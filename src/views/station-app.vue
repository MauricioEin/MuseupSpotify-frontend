<template>
  <section class="home-page">
    <station-list :stations="stationsWithGenre('trending')" :title="'Trending now'" />
    <station-list :stations="stationsWithGenre('bestOf')" :title="'Best of 2022'" />
    <station-list v-if="(loggedinUser && userStations && userStations.length)" :stations="userStations"
      :title="'Your playlists'" />
    <station-list v-if="(otherUserStation && otherUserStation.length)" :stations="otherUserStation"
      :title="'Playlists by other users'" />
  </section>
</template>

<script>
import stationList from '../cmps/station-list.vue'
import { store } from '../store/store'
export default {

  computed: {
    stations() {
      return this.$store.getters.stations
    },
    userStations() {
      return this.$store.getters.stations.filter(station => {
        return station.owner._id === this.$store.getters.loggedinUser._id
      })
    },
    otherUserStation() {
      return this.$store.getters.stations.filter(station => {
        return (
          station.owner.username !== this.$store.getters.loggedinUser?.username &&
          station.owner.username !== 'MuseUp'
        )
      })
    },
    loggedinUser() {
      return this.$store.getters.loggedinUser
    }

  },

  methods: {
    stationsWithGenre(genre) {
      return this.$store.getters.stations.filter(station => station.category === genre)
    },
  },

  components: {
    stationList,
  }
}
</script>
