<template>
  <section class="station-search">
    <main-search-list :songs="searchedSongs" />
  </section>
</template>

<script>
import mainSearchList from '../cmps/main-search-list.vue';
export default {
  data() {
    return {
    }
  },
  computed: {
    searchedSongs() {
      return this.$store.getters.searchedSongs
    }
  },
  components: {
    mainSearchList
  }
}
</script>
