<template>
  <header ref="header" class="app-header content-layout">
    <div class="flex">

      <nav class="flex">
        <button class="btn-go-back" @click="this.$router.go(-1)"><btn-go-back /></button>
        <button class="btn-go-next" @click="this.$router.go(1)"><btn-go-next /></button>
        <main-search v-if="isOnSearchPage" />
      </nav>

      <section @click="toggleMenu" class="loggedin-user flex" v-if="(loggedInUser && loggedInUser._id !== 'demo')">
        <div class="user-img-container">
          <img v-if="imgSrc" :src="imgSrc" class="fit-img" alt="">
          <div v-else>
            <user-portrait />
          </div>
        </div>
        <span>{{ loggedInUser.fullname }}</span>
        <menu-arrow-down />
        <mini-menu @profile="goToProfile" @logOut="logout" :actions="['Profile', 'Log out']" v-if="isMenuOpen"
          style="transform: translateY(40%); top: 0; right: 0;" />
      </section>

      <section class="header-login-signup" v-else>
        <button class="btn-signup" @click="goToSignup">Sign up</button>
        <button class="btn-login" @click="goToLogin">Log in</button>
      </section>

    </div>
  </header>
</template>
<script>
import mainSearch from './main-search.vue'
import miniMenu from './mini-menu.vue'

import btnGoBack from '../assets/svgs/btn-go-back.vue'
import btnGoNext from '../assets/svgs/btn-go-next.vue'
import userPortrait from '../assets/svgs/user-portrait.vue'
import menuArrowDown from '../assets/svgs/menu-arrow-down.vue'
import gearSvg from '../assets/svgs/gear-svg.vue'

export default {
  data() {
    return {
      isMenuOpen: false,
    }
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedinUser
    },
    isOnSearchPage() {
      return (this.$route.fullPath === '/search')
    },
    isOnHomePage() {
      return this.$route.fullPath === '/station'
    },
    imgSrc() {
      return this.loggedInUser?.profileImg
    },

  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    },
    openMenu() {
      this.isMenuOpen = true
    },
    closeMenu() {
      this.isMenuOpen = false
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
      const id = this.loggedInUser._id
      this.$router.push(`/user/${id}`)
    },

  },
  components: {
    mainSearch,
    btnGoBack,
    btnGoNext,
    userPortrait,
    menuArrowDown,
    miniMenu,
    gearSvg
  },
}
</script>