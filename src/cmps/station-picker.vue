<template>
  <section class="login-page">
    <hr>
    <div class="picker-header flex space-between">
      <span class="pointer" @click="$emit('close')">back </span> <span> | Add to playlist | </span><span></span></div>
    <button @click="createPlaylist">New Playlist</button>
    <input placeholder="Find playlist">
    <ul class="clean-list">
      <li v-for="station in stations" :key="station._id" @click="addToStation(station._id)">
        {{ station }}
      </li>
    </ul>
  </section>
</template>

<script>
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
export default {
  name: 'login',
  props: ['user'],
  data() {
    return {
    }
  },
  computed: {
    stations() {
      return this.user.stations.filter(s => s.owner === this.user.username) ///TOCHANGE
    },
  },
  created() {
  },
  methods: {
    addToStation(stationId){

    },
    createPlaylist(){

    }
  }
}

</script>