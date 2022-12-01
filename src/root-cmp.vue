<template>
  <user-msg />
  <!-- <app-header /> -->
  <section class="app-layout flex">
    <app-nav />
    <section class="main-layout">
      <app-header />
      <router-view />
      <media-player/>
    </section>
  </section>
</template>

<script>


import { store } from './store/store'
import appHeader from './cmps/app-header.vue'
import appNav from './cmps/app-nav.vue'
import userMsg from './cmps/user-msg.vue'
import { userService } from './services/user.service'
import mediaPlayer from './cmps/media-player.vue'

export default {

  created() {
    console.log('Vue App created')
    var user = userService.getLoggedinUser()
    // if (!user) user={_id:'demo', name: 'demo', likedSongs:[], followedStations:[]}
    
    if (user) store.commit({ type: 'setLoggedinUser', user })
    this.$store.dispatch({type:'loadStations'})
  },
  components: {
    appHeader,
    userMsg,
    appNav,
    mediaPlayer,
  },
}
</script>