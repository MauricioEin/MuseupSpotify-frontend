<template>
  <section class="station-search">
    <section class="station-search-header">
      <main-search />
    </section>
    <main-search-list v-if="searchedSongs.length" :songs="searchedSongs"
      @addToStation="song => { isPickerOpen = true; songToAdd = song }" />

    <search-category-list v-else />

    <station-picker v-if="isPickerOpen" :isOpen="isPickerOpen" :user="loggedInUser" :song="songToAdd"
      @close="isPickerOpen = false" />
    <div @click.stop="isPickerOpen = false" class="picker-screen" :class="{ 'shown': isPickerOpen }"></div>

  </section>
</template>

<script>
import mainSearch from '../cmps/main-search.vue'
import mainSearchList from '../cmps/main-search-list.vue'
import stationPicker from '../cmps/station-picker.vue'
import searchCategoryList from '../cmps/search-category-list.vue'

export default {
  data() {
    return {
      isPickerOpen: false,
      songToAdd: {}
    }
  },
  computed: {
    searchedSongs() {
      return this.$store.getters.searchedSongs
    },
    loggedInUser() {
      return this.$store.getters.loggedinUser
    },

  },
  components: {
    mainSearchList,
    mainSearch,
    stationPicker,
    searchCategoryList
  }
}
</script>
