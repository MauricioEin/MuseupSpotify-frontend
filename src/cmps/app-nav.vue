<template>
  <section class="nav-container">
    <div class="logo">Spotify</div>
    <nav>
      <div class="app-nav flex column">
        <router-link to="/station">Home</router-link>
        <router-link to="/search">Search</router-link>
        <router-link to="/collection">Your Library</router-link>
      </div>
      <div class="user-nav flex column">
        <router-link @click="createStation" to="">Create Playlist</router-link>
        <router-link to="/collection/tracks">Liked Songs</router-link>
      </div>
    </nav>
    <hr>
    <ul class="user-stations clean-list">
      <li v-for="station in stations" :key="station._id">
        <router-link :to="'/station/' + station._id"> {{ station.name }}  </router-link>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  data() {
    return {
      stations: [
        { _id: 123, name: 'Ilan' }, { _id: 1234, name: 'Tomer' }, { _id: 1233, name: 'Mauricio' }
      ]
    }
  },
  methods: {
    async createStation() {
      console.log('creating!')
      const newStation = { name: 'My Playlist #' + (this.stations.length + 1), songs: [] }
      const savedStation = await this.$store.dispatch({ type: 'addStation', station: newStation })
      this.stations.push(savedStation) // ZMANI
      this.$router.push('/station/' + savedStation._id)
    }
  }
}
</script>