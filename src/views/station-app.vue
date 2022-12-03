<template>
  <station-list :stations="stations"/>
  <!-- <div class="container home">
    <h1>Home</h1>
    <ul class="station-list">
      <li class="station-card" v-for="station in stations" :key="station._id">
        <img :src="getStationImg(station)" alt="" class="station-img">
        <div class="card-details">
          <p class="station-title cut-text" >
            {{  station.name  }}
          </p>
          <p class="station-desc cut-text">
            {{  station.name  }}
          </p >
          <p class="station-desc cut-text">
            The essential tracks, all in one playlist.
          </p >
          <button class="play-playlist-btn"><play-btn/></button>
          
        
        </div>
      </li>
    </ul> -->
    <!-- <hr />
    <form @submit.prevent="addStation()">
      <h2>Add station</h2>
      <input type="text" v-model="stationToAdd.name" />
      <button>Save</button>
    </form> -->
  <!-- </div> -->
</template>

<script>
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { stationService } from '../services/station.service'
import { getActionRemoveStation, getActionUpdateStation } from '../store/station.store'
import playBtn from '../assets/svgs/play-btn-svg.vue'
import stationList from '../cmps/station-list.vue'
export default {
  data() {
    return {
      stationToAdd: stationService.getEmptyStation()
    }
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedinUser
    },
    stations() {
      return this.$store.getters.stations
    },

  },
  created() {
    this.$store.dispatch({ type: 'loadStations' })
  },
  methods: {
    async addStation() {
      try {
        await this.$store.dispatch({ type: 'addStation', station: this.stationToAdd })
        showSuccessMsg('Station added')
        this.stationToAdd = stationService.getEmptyStation()
      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot add station')
      }
    },
    async removeStation(stationId) {
      try {
        await this.$store.dispatch(getActionRemoveStation(stationId))
        showSuccessMsg('Station removed')
        
      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot remove station')
      }
    },
    async updateStation(station) {
      try {
        station = { ...station }
        station.name = prompt('New name?', station.name)
        await this.$store.dispatch(getActionUpdateStation(station))
        showSuccessMsg('Station removed')

      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot remove station')
      }
    },

    getStationImg(station){
      if(station.imgUrl)return station.imgUrl  
      else if(station.songs[0]?.imgUrl) return station.songs[0]?.imgUrl
      else return 'https://i.ibb.co/RChzLhY/2022-12-03-132853.jpg'
    },

  },
  components:{
    playBtn,
    stationList,
  }


}
</script>
