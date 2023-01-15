<template>
  <section class="user-details content-layout">
    <div>
      <label class="user-img-container pointer">
        <input hidden type="file" accept="image/.jpg, image/.jpeg, image/.png" @change="handleFile">
        <img v-if="user && imgUrl" :src="imgUrl" class="fit-img" alt="">
        <div v-else><user-portrait /></div>
      </label>
      <div v-if="user" class="user-info">
        <label>Profile</label>
        <h1>{{ user.fullname }}</h1>
        <small>{{ user.likedSongs.length }} liked songs</small>
      </div>
    </div>
  </section>

  <section class="user-collection content-layout">

    <ul class="station-library-list">
      <div v-if="!stations" class="skeleton-vqlfosng44v"></div>
      <div v-if="!stations" class="skeleton-7b7uvxywsks"></div>
      <div v-if="!stations" class="skeleton-7b7uvxywsks"></div>
      <div v-if="!stations" class="skeleton-7b7uvxywsks"></div>
      <div v-if="!stations" class="skeleton-7b7uvxywsks"></div>
      <div v-if="!stations" class="skeleton-7b7uvxywsks"></div>
      <div v-if="!stations" class="skeleton-7b7uvxywsks"></div>
      <div v-if="!stations" class="skeleton-7b7uvxywsks"></div>
      <div v-if="!stations" class="skeleton-7b7uvxywsks"></div>
      <liked-songs-card v-if="stations" />
      <station-preview v-for="station in stations" :station="station" :key="station?._id || 'error'" />
    </ul>

  </section>
</template>

<script>
import stationPreview from '../cmps/station-preview.vue'
import likedSongsCard from '../cmps/liked-songs-card.vue'
import searchIcon from '../assets/svgs/search-icon.vue'
import plusBtnSvg from '../assets/svgs/plus-btn-svg.vue'
import userPortrait from '../assets/svgs/user-portrait.vue'
import { uploadImg } from '../services/upload.service'

export default {
  data() {
    return {
      // stations: null
    }
  },
  computed: {
    user() {
      return this.$store.getters.watchedUser
    },
    userId() {
      return this.$route.params.id
    },
    imgUrl() {
      return this.$store.getters.loggedinUser?.profileImg
    },
    loggedInUser() {
      return this.$store.getters.loggedinUser
    },
    stations() {
      return this.$store.getters.userStations
    }
  },

  methods: {
    handleFile(ev) {
      let file
      if (ev.type === 'change') file = ev.target.files[0]
      this.onUploadFile(file)
    },
    async onUploadFile(file) {
      console.log('loading...')
      try {
        const res = await uploadImg(file)
        console.log('res.url', res.url)
        this.$store.commit({ type: 'updateUserImg', url: res.url })
        var user = JSON.parse(JSON.stringify(this.loggedInUser))
        this.$store.dispatch({ type: 'updateUser', user })
      } catch (err) {
        console.log('COULDNT UPDATE IMG')
        console.dir(err)
        throw err
      } finally {
        this.isLoading = false
      }
    },

  },
  watch: {
    userId: {
      handler() {
        if (this.userId) {
          this.$store.dispatch({ type: "loadAndWatchUser", userId: this.userId })
        }
      },
      immediate: true,
    },
  },

  components: {
    searchIcon,
    plusBtnSvg,
    userPortrait,
    stationPreview,
    likedSongsCard,
  }
}
</script>