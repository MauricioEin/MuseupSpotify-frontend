<template>
    <div class="container home">
      <h1>Playlists</h1>
      <ul class="station-list">
        <li class="station-card" v-for="station in stations" :key="station._id" @click="goToStation(station._id)">
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
            <button class="play-playlist-btn" @click.stop="(!isPlayed) ? playStation(station) :  toggleIsPlayed()" ><play-btn v-if="!isPlayed"/><pause-btn v-else/></button>
         
          </div>
        </li>
      </ul>
      
    </div>
  </template>
  
  <script>

  import playBtn from '../assets/svgs/play-btn-svg.vue'
  import pauseBtn from '../assets/svgs/media-player-stop.vue'
  export default {
   
    props:{
        stations:{
            type: Array,
        }
    },
    
    created() {
      this.$store.dispatch({ type: 'loadStations' })
    },
    methods: {
      getStationImg(station){
        if(station.imgUrl) return station.imgUrl  
        else if(station.songs[0]?.imgUrl) return station.songs[0]?.imgUrl
        else return 'https://i.ibb.co/RChzLhY/2022-12-03-132853.jpg'
      },
      
      goToStation(id){
        this.$router.push({ path: `/station/${id}` })
      },
      
      playStation(station) {
      this.$store.commit({ type: 'playStation', station })
      },

      toggleIsPlayed(){
        this.$store.commit('toggleIsPlayed')
      },
    
    },

    computed:{
        isPlayed(){
            return this.$store.getters.isPlayed
        }
    },

    components:{
      playBtn,
      pauseBtn
    }

  }
  </script>
  