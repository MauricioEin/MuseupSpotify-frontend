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
            <button class="play-playlist-btn" @click.stop="(!isPlayed) ? playStation(station) :  toggleIsPlayed()" ><pause-btn v-if="isCurrStationPlayed(station)"/><play-btn v-else/></button>
         
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

      isCurrStationPlayed(station){
        const miniStation = station.songs.map(song => {
            const { title, imgUrl, youtubeId } = song
            return {
                title,
                imgUrl: imgUrl.medium,
                youtubeId,
            }
        })

        const stringedStore =(JSON.stringify(this.getPlayingStation))
        const stringedMini = (JSON.stringify(miniStation))
      
        if(this.isPlayed && stringedStore == stringedMini){
            return true
        }   return false
      },
    },

    computed:{
        isPlayed(){
            return this.$store.getters.isPlayed
        },

        getPlayingStation(){
            return this.$store.getters.getPlayingStation
        }
    },

    components:{
      playBtn,
      pauseBtn
    }

  }
  </script>
  