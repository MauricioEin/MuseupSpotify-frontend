<template>
  <section class="user-collection">
    <station-list :stations="stations"/>
  </section>
</template>

<script>
  import { stationService } from '../services/station.service'
  import stationList from '../cmps/station-list.vue'
  export default {

    data(){
      return{
        stations:[],
      }
    },

    created(){
      this.getUserStations()
    },

    methods:{
      async getUserStations(){
        const user = this.$store.getters.loggedinUser
        const userStations = user.stations.map(async(currStation) => {
          const station = await stationService.getById(currStation._id)
          return station
        })
        const stations = await Promise.all(userStations)
        this.stations = stations
      }
    },

    components:{
      stationList,
    }
  }
</script>
