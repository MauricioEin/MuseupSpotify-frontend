<template>
  <section v-if="station" class="station-details details-layout">


    <section class="station-preview flex full">

      <img-uploader :imgSrc="stationImg" @saved="url => updateStation({ imgUrl: url })" />

      <div class="station-summary">
        <p class="summary-title">PLAYLIST</p>
        <h1 class="pointer" @click="isEdit = true">{{ station.name }}</h1>
        <p class="station-desc pointer light" v-if="station.desc" @click="isEdit = true">{{ station.desc }}</p>
        <p class="mini-dashboard"> {{ station.owner?.username || 'anonymous' }} | {{ station.followers?.length || 0 }}
          likes | {{ station.songs.length }} songs, <span class="light">{{ totalTime }}</span></p>
      </div>
    </section>

    <station-edit v-if="isEdit" :station="station" :altImg="stationImg" @close="isEdit = false" @save="updateStation" />

    <section class="playlist-actions">
      <button class="btn-play-green" v-if="station.songs.length">
        <play-btn />
      </button>
      <button @click="openStationMenu" class="btn-playlist-more-options">
        <more-options-svg @click.stop="toggleStationMenu" />
        <station-menu v-if="isStationMenuOpen" @queue="" @remove="removeStation" @follow="follow" @edit="isEdit = true"
          :isFollowed="isFollowed" />
      </button>
    </section>


    <song-list-header v-if="station.songs.length" />

    <song-list v-if="station.songs.length" :songs="station.songs" />

    <button v-if="(!isSearchOpen)" @click="openSearch" class="btn-find-more">Find more</button>
    <section v-else>
      <station-song-search @closeSearch="closeSearch" />
      <station-song-list @addSongToStation="addSongToStation" v-if="searchedSongs" :songs="searchedSongs" />
    </section>

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
import stationSongSearch from '../cmps/station-song-search.vue'
import stationSongList from '../cmps/station-song-list.vue'
import imgUploader from '../cmps/img-uploader.vue'

import playBtn from '../assets/svgs/play-btn-svg.vue'
import moreOptionsSvg from '../assets/svgs/more-options-svg.vue'
import pencilSvg from '../assets/svgs/pencil-svg.vue'
import musicNoteSvg from '../assets/svgs/music-note-svg.vue'

export default {
  data() {
    return {
      station: null,
      isStationMenuOpen: false,
      isEdit: false,
      isSearchOpen: false,
      isImgHover: false

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
      return this.station.imgUrl || this.station.songs[0]?.imgUrl.high || this.station.songs[0]?.imgUrl
    },
    stationId() {
      const id = this.$route.params.id || this.station?._id
      return id
    },
    isFollowed() {
      return this.loggedInUser.stations.some(station => station._id === this.stationId)
    },
    searchedSongs() {
      return this.$store.getters.searchedSongs
    },
    totalTime() {
      const time = this.station.songs.reduce((acc, song) => {
        const t = song.length.split(':')
        if (t.length > 2) {
          acc.hour += +t[0]
          acc.min += +t[1]
          acc.sec += +t[2]
        } else {
          acc.min += +t[0]
          acc.sec += +t[1]
        }
        return acc
      }, { sec: 0, min: 0, hour: 0 })

      while (time.sec > 60) {
        time.sec -= 60
        time.min++
      }

      while (time.min > 60) {
        time.min -= 60
        time.hour++
      }

      if (time.hour) return `${time.hour} hr ${time.min} min`
      else return `${time.min} min ${time.sec} sec`
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
    async updateStation(editedStation) {
      try {
        editedStation = { ...this.station, ...editedStation }
        await this.$store.dispatch(getActionUpdateStation(editedStation))
        showSuccessMsg('Station updated')
        this.loadStation()

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
    },
    openSearch() {
      this.isSearchOpen = true
    },
    closeSearch() {
      this.isSearchOpen = false
    },
    async addSongToStation(song) {
      try {
        const editedStation = JSON.parse(JSON.stringify(this.station))
        editedStation.songs.push(song)
        await this.$store.dispatch(getActionUpdateStation(editedStation))
        showSuccessMsg('Added to playlist')
        this.loadStation()
      } catch {
        console.log(err)
        showErrorMsg('Failed adding song to station')
      }
    }
  },
  watch: {
    stationId() {
      this.loadStation()
    },
    station() {
      this.$store.commit({ type: 'setCurrStation', station: this.station })
      this.closeSearch()
    }
  },
  unmounted() {
    this.$store.commit({ type: 'clearCurrStation' })
  },
  components: {
    songList,
    stationMenu,
    songListHeader,
    stationEdit,
    imgUploader,
    playBtn,
    moreOptionsSvg,
    pencilSvg,
    musicNoteSvg,
    stationSongSearch,
    stationSongList,
  }


}
</script>
