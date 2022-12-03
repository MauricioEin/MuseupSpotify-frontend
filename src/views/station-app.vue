<template>
  <section class="home-page">
    <station-list :stations="stations"/>
  </section>
</template>

<script>
import stationList from '../cmps/station-list.vue'
export default {

  computed: {

    stations() {
      return this.$store.getters.stations
    },
  },
  
  components:{
    stationList,
  }
}
</script>
