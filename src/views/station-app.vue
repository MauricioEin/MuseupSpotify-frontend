<template>
  <section class="home-page">
    <section class="s-home-header" v-if="isOnHomePage">
      <section class="greeting">
        Good {{ greeting }}
      </section>
      <section class="s-header-actions">
        <button>
          <gear-svg @click="togglePhoneMenu" />
        </button>
        <mini-menu ref="phoneMenu" v-if="isPhoneMenuOpen" @login="goToLogin" @logout="logout" @signup="goToSignup"
          @profile="goToProfile" :actions="phoneActions" />
      </section>
    </section>
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
import miniMenu from '../cmps/mini-menu.vue'

import gearSvg from '../assets/svgs/gear-svg.vue'


export default {

  data() {
    return {
      isPhoneMenuOpen: false,

    }
  },

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
    },
    isOnHomePage() {
      return this.$route.fullPath === '/station'
    },
    greeting() {
      const d = new Date()
      const h = d.getHours()
      if (h < 5 || h >= 22) return 'night'
      else if (h >= 5 && h < 12) return 'morning'
      else if (h >= 12 && h < 18) return 'afternoon'
      else if (h >= 18 && h < 22) return 'evening'
    },
    phoneActions() {
      return this.loggedinUser ? ['Profile', 'Logout'] : ['Login', 'Signup']
    },
  },

  methods: {
    stationsWithGenre(genre) {
      return this.$store.getters.stations.filter(station => station.category === genre)
    },
    openPhoneMenu() {
      this.isPhoneMenuOpen = true
    },
    closePhoneMenu() {
      this.isPhoneMenuOpen = false
    },
    togglePhoneMenu() {
      this.isPhoneMenuOpen = !this.isPhoneMenuOpen
    },
    goToLogin() {
      this.$router.push('/login')
    },
    goToSignup() {
      this.$router.push('/signup')
    },
    logout() {
      this.$store.dispatch({ type: 'logout' })
      this.$router.push('/')
    },
    goToProfile() {
      const id = this.loggedinUser._id
      this.$router.push(`/user/${id}`)
    },
  },

  watch: {
    $route() {
      this.closePhoneMenu()
    },
    loggedinUser() {
      this.closePhoneMenu()
    }
  },

  components: {
    stationList,
    gearSvg,
    miniMenu,
  }
}
</script>
