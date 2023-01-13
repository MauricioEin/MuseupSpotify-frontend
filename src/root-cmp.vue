<template>
  <user-msg />
  <section class="app-layout flex">
    <app-nav />
    <section class="main-layout">
      <app-header />
      <router-view />
      <footer class="app-footer">
        <media-player />
        <mobile-nav />
      </footer>
    </section>
  </section>
</template>

<script>


import { store } from './store/store'
import appHeader from './cmps/app-header.vue'
import appNav from './cmps/app-nav.vue'
import mobileNav from './cmps/mobile-nav.vue'
import userMsg from './cmps/user-msg.vue'
import { userService } from './services/user.service'
import mediaPlayer from './cmps/media-player.vue'

export default {

  created() {
    console.log('Vue App created')
    var user = userService.getLoggedinUser()

    if (!user) user = { _id: '', username: 'demo', fullname: 'Guest', likedSongs: [], stations: [] }
    this.$store.commit({ type: 'setLoggedinUser', user })
    this.$store.dispatch({ type: 'loadUserStations', user })

    const categories = ['user', 'others', 'trending', 'bestOf', 'focus', 'mood', 'popular']
    this.$store.dispatch({ type: 'filterStations', categories })
    this.$store.dispatch({ type: 'loadStations' })

  },
  components: {
    appHeader,
    userMsg,
    appNav,
    mobileNav,
    mediaPlayer,
  },
}
</script>
