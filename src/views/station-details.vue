<template>
  <section v-if="station" class="station-details">
    <section class="station-preview flex">
      <div class="station-img-container">
        <img :src="stationImg" v-if="stationImg" alt="">
        <!-- <div v-else> -->
        <music-note-svg v-else />
        <!-- <pencil-svg /> -->
        <!-- </div> -->
      </div>
      <div class="station-summary">
        <p class="summary-title">PLAYLIST</p>
        <h1 class="pointer" @click="isEdit = true">{{ station.name }}</h1>
        <p class="mini-dashboard"> {{station.owner?.username}} | likes | {{ station.likedByUsers?.length }} songs, <span class="light">total
            time</span></p>
      </div>
    </section>

    <station-edit v-if="isEdit" :name="station.name" :desc="station.desc" :imgUrl="stationImg" @close="isEdit = false"/>

    <section class="playlist-actions">
      <button class="btn-play-green" v-if="station.songs.length">
        <play-btn />
      </button>
      <button @click="openStationMenu" class="btn-playlist-more-options">
        <more-options-svg @click.stop="toggleStationMenu" />
        <station-menu v-if="isStationMenuOpen" @queue="" @remove="removeStation" @follow="follow"
          @edit="isEdit = true" />
      </button>
    </section>


    <song-list-header />

    <song-list v-if="station.songs.length" :songs="station.songs" />
    <div v-else style="padding: 10px 20px">Add some songs</div>

  </section>
</template>






<script>
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { stationService } from '../services/station.service'
import { getActionRemoveStation, getActionUpdateStation } from '../store/station.store'
import songList from '../cmps/song-list.vue'
import songListHeader from '../cmps/song-list-header.vue'
import stationMenu from '../cmps/station-menu.vue'
import stationEdit from '../cmps/station-edit.vue'

import playBtn from '../assets/svgs/play-btn-svg.vue'
import moreOptionsSvg from '../assets/svgs/more-options-svg.vue'
import pencilSvg from '../assets/svgs/pencil-svg.vue'
import musicNoteSvg from '../assets/svgs/music-note-svg.vue'

export default {
  data() {
    return {
      station: null,
      isStationMenuOpen: false,
      isEdit: false
    }
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedinUser
    },
    stations() {
      return this.$store.getters.stations
    },
    stationImg() {
      return this.station.imgUrl || this.station.songs[0]?.imgUrl
    },
    stationId() {
      const id = this.$route.params.id || this.station?._id
      return id
    },
    isFollowed() {
      return this.loggedInUser.stations.some(station => station._id === this.stationId)
    }
  },
  mounted() {
    window.addEventListener('click', () => this.isStationMenuOpen = false);
    this.loadStation()
  },
  methods: {
    async follow() {
      const actionStr = this.isFollowed ? 'unfollow' : 'follow'
      try {
        await this.$store.dispatch({ type: 'followStation', station: this.station, isToFollow: !this.isFollowed })
        showSuccessMsg('Station ' + actionStr + 'ed')
      } catch (err) {
        console.error(err)
        showErrorMsg('Cannot ' + actionStr + ' station')
      }
    },
    async removeStation() {
      try {
        await this.$store.dispatch(getActionRemoveStation(this.station._id))
        showSuccessMsg('Station removed')
        this.$router.push('/station')

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
        showSuccessMsg('Station updated')

      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot update station')
      }
    },
    async loadStation() {
      this.station = JSON.parse(JSON.stringify(await stationService.getById(this.stationId)))
      console.log('station', this.station)
    },
    toggleStationMenu() {
      this.isStationMenuOpen = !this.isStationMenuOpen
    }
  },
  watch: {
    stationId() {
      this.loadStation()
    }
  },
  components: {
    songList,
    stationMenu,
    songListHeader,
    stationEdit,
    playBtn,
    moreOptionsSvg,
    pencilSvg,
    musicNoteSvg,
  }


}
</script>
