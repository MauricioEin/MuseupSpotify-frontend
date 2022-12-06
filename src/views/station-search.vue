<template>
  <section class="station-search">
    <section class="station-search-header">
      <main-search />
    </section>
    <main-search-list v-if="searchedSongs.length" :songs="searchedSongs" />
  </section>
</template>

<script>
import mainSearch from '../cmps/main-search.vue';
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
    mainSearchList,
    mainSearch,

  }
}
</script>
