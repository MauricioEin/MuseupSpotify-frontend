<template>
  <!-- <section class="home-page" v-if="isLoaded"> -->
  <section class="home-page">
    <section class="s-home-header full" v-if="isOnHomePage">
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
    <section class="user-cards" v-if="(loggedinUser._id !== 'demo')">
      <section class="greeting">
        Good {{ greeting }}
      </section>
    </section>
    <section class="categories">
      <station-list :stations="filteredStations.trending" :title="'Trending now'" />
      <station-list :stations="filteredStations.bestOf" :title="'Best of 2022'" />
      <station-list :stations="filteredStations.mood" :title="'Mood'" />
      <station-list :stations="filteredStations.popular" :title="'Popular around you'" />
      <station-list :stations="filteredStations.focus" :title="'Best for Focus'" />
      <station-list v-if="(loggedinUser && userStations && userStations.length)" :stations="filteredStations.user"
        :title="'Your playlists'" />
      <station-list v-if="(otherUserStation && otherUserStation.length)" :stations="filteredStations.others"
        :title="'Playlists by other users'" />
    </section>
  </section>
  <!-- <section class="loader" v-else>
    Loading...
    <img src="../assets/gifs/loader3.gif" alt="">
  </section> -->
</template>

<script>
import stationList from '../cmps/station-list.vue'
import miniMenu from '../cmps/mini-menu.vue'

import gearSvg from '../assets/svgs/gear-svg.vue'


export default {

  data() {
    return {
      isPhoneMenuOpen: false,
      categories: ['user', 'others', 'trending', 'bestOf', 'focus', 'mood', 'popular'],
      filteredStations: {},
    }
  },

  computed: {
    stations() {
      return this.$store.getters.stations
    },
    userStations() {
      // return this.$store.getters.userStations
      return this.$store.getters.stations//.filter(station => {
      //   return station.owner._id === this.$store.getters.loggedinUser._id
      // })
    },
    otherUserStation() {
      // return this.$store.getters.otherUserStations
      return this.$store.getters.stations //.filter(station => {
      //   return (
      //     station.owner.username !== this.$store.getters.loggedinUser?.username &&
      //     station.owner.username !== 'MuseUp'
      //   )
      // })
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
      return this.loggedinUser?._id !== 'demo' ? ['Profile', 'Logout'] : ['Login', 'Signup']
    },

    isLoaded() {
      return (this.filteredStations.trending?.length) ? false : true
    },

    // filteredStations() {
    //   return this.$store.getters.filteredStations
    // },
  },

  methods: {
    test() {
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), 3000)
      })
    },

    async loadHomeStations() {
      const delay = this.$store.getters.filteredStations.trending ? 0 : 500
      setTimeout(() => {
        this.filteredStations = this.$store.getters.filteredStations
        console.log('this stations:', this.filteredStations)
      }, delay)
      // console.log('Hello', this.isLoaded, this.filteredStations);
    },
    stationsWithGenre(genre) {
      // this.$store.dispatch({ type: 'filterGenre', genre })
      return this.$store.getters.stations//.filter(station => station.category === genre)
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
      this.$router.go()
    },
    goToProfile() {
      const id = this.loggedinUser._id
      this.$router.push(`/user/${id}`)
    },
  },
  created() {
    this.loadHomeStations()
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
