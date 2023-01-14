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
          :visualData="visualData" @profile="goToProfile" :actions="phoneActions"
          @closeMenu="isPhoneMenuOpen = false" />
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
      <station-list v-if="(loggedinUser?._id && loggedinUser?._id !== 'demo' && loggedinUser?._id !== 'guest' && filteredStations.user?.length)"
        :stations="filteredStations.user" :title="'Your playlists'" />
      <station-list v-if="(filteredStations.others?.length)" :stations="filteredStations.others"
        :title="'Playlists by MuseUp users'" />
    </section>
  </section>
</template>

<script>
import stationList from '../cmps/station-list.vue'
import miniMenu from '../cmps/mini-menu.vue'

import gearSvg from '../assets/svgs/gear-svg.vue'
import { socketService } from '../services/socket.service'


export default {

  data() {
    return {
      isPhoneMenuOpen: false,
      categories: ['user', 'others', 'trending', 'bestOf', 'focus', 'mood', 'popular'],
    }
  },

  computed: {
    filteredStations() {
      return this.$store.getters.filteredStations

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

    visualData() {
      return {
        imgUrl: this.loggedinUser.profileImg,
        text1: 'Hi ' + (this.loggedinUser.username === 'demo' ? 'guest' : this.loggedinUser.username )+ ',',
        text2: 'Good ' + this.greeting + '!'
      }
    }
  },

  methods: {
    test() {
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), 3000)
      })
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
      this.$router.go('/station')
    },
    goToProfile() {
      const id = this.loggedinUser._id
      this.$router.push(`/user/${id}`)
    },
  },
  async created() {
    // await this.loadHomeStations()
    socketService.on('station-created', (savedStation) => {
      this.$store.commit({ type: 'addFilteredStation', station: savedStation })
    })
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
