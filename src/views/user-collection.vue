<template>
  <section class="user-collection">
    <station-list :stations="stations"/>
  </section>
</template>

<script>
  import { stationService } from '../services/station.service';
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
      getUserStations(){
        const user = this.$store.getters.loggedinUser
        const userStations = user.stations.map(async(currStation) => {
        const station = await stationService.getById(currStation._id)
          return station
        })
        Promise.all(userStations).then(res => {
          console.log(res);
          this.stations = res})
      }
    },

    components:{
      stationList,
    }
  }
</script>
