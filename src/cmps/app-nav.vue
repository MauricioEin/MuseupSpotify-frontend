<template>
  <section class="nav-container">
    <div class="logo" to="/station"><svg style="width: 42px; height: 42px;" viewBox="0 0 170 170">
        <path
          d="m83.996 0.277c-46.249 0-83.743 37.493-83.743 83.742 0 46.251 37.494 83.741 83.743 83.741 46.254 0 83.744-37.49 83.744-83.741 0-46.246-37.49-83.738-83.745-83.738l0.001-0.004zm38.404 120.78c-1.5 2.46-4.72 3.24-7.18 1.73-19.662-12.01-44.414-14.73-73.564-8.07-2.809 0.64-5.609-1.12-6.249-3.93-0.643-2.81 1.11-5.61 3.926-6.25 31.9-7.291 59.263-4.15 81.337 9.34 2.46 1.51 3.24 4.72 1.73 7.18zm10.25-22.805c-1.89 3.075-5.91 4.045-8.98 2.155-22.51-13.839-56.823-17.846-83.448-9.764-3.453 1.043-7.1-0.903-8.148-4.35-1.04-3.453 0.907-7.093 4.354-8.143 30.413-9.228 68.222-4.758 94.072 11.127 3.07 1.89 4.04 5.91 2.15 8.976v-0.001zm0.88-23.744c-26.99-16.031-71.52-17.505-97.289-9.684-4.138 1.255-8.514-1.081-9.768-5.219-1.254-4.14 1.08-8.513 5.221-9.771 29.581-8.98 78.756-7.245 109.83 11.202 3.73 2.209 4.95 7.016 2.74 10.733-2.2 3.722-7.02 4.949-10.73 2.739z " />
      </svg>
      <span>Spotify</span>
    </div>
    <nav class="permanent-nav">
      <ul class="app-nav clean-list">
        <li>
          <router-link to="/station"><svg>
              <path
                d="M12.5 3.247a1 1 0 00-1 0L4 7.577V20h4.5v-6a1 1 0 011-1h5a1 1 0 011 1v6H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 013 0l7.5 4.33a2 2 0 011 1.732V21a1 1 0 01-1 1h-6.5a1 1 0 01-1-1v-6h-3v6a1 1 0 01-1 1H3a1 1 0 01-1-1V7.577a2 2 0 011-1.732l7.5-4.33z">
              </path>
            </svg>
            <span>Home</span>
          </router-link>
        </li>
        <li>
          <router-link to="/search"><svg>
              <path
                d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 101.414-1.414l-4.344-4.344a9.157 9.157 0 002.077-5.816c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.279c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.28z">
              </path>
            </svg>
            <span>Search</span>
          </router-link>
        </li>
        <li>
          <router-link to="/collection"><svg>
              <path
                d="M14.5 2.134a1 1 0 011 0l6 3.464a1 1 0 01.5.866V21a1 1 0 01-1 1h-6a1 1 0 01-1-1V3a1 1 0 01.5-.866zM16 4.732V20h4V7.041l-4-2.309zM3 22a1 1 0 01-1-1V3a1 1 0 012 0v18a1 1 0 01-1 1zm6 0a1 1 0 01-1-1V3a1 1 0 012 0v18a1 1 0 01-1 1z">
              </path>
            </svg>
            <span>Your Library</span>
          </router-link>
        </li>
      </ul>
      <div class="user-nav flex column">
        <router-link @click="createStation" to="">
          <div class="nav-btn flex align-center justify-center">
            <svg role="img" aria-hidden="true" viewBox="0 0 16 16">
              <path
                d="M15.25 8a.75.75 0 01-.75.75H8.75v5.75a.75.75 0 01-1.5 0V8.75H1.5a.75.75 0 010-1.5h5.75V1.5a.75.75 0 011.5 0v5.75h5.75a.75.75 0 01.75.75z">
              </path>
            </svg>
          </div>
          <span>Create Playlist</span>
        </router-link>
        <router-link to="/collection/tracks">
          <div class="nav-btn heart-btn flex align-center justify-center"><svg role="img" height="12" width="12" aria-hidden="true"
              viewBox="0 0 16 16" class="Svg-sc-ytk21e-0 uPxdw">
              <path
                d="M15.724 4.22A4.313 4.313 0 0012.192.814a4.269 4.269 0 00-3.622 1.13.837.837 0 01-1.14 0 4.272 4.272 0 00-6.21 5.855l5.916 7.05a1.128 1.128 0 001.727 0l5.916-7.05a4.228 4.228 0 00.945-3.577z">
              </path>
            </svg></div>
          <span>Liked Songs</span>
        </router-link>
      </div>
    </nav>
    <ul class="user-stations clean-list">
      <hr>
      <li v-for="station in stations" :key="station._id">
        <router-link :to="'/station/' + station._id"> {{ station.name }} </router-link>
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