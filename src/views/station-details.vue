<template >
  <section v-if="station" class="station-details content-layout">
    <section class="station-preview flex full" ref="preview">
      <img-uploader class="uploader-img" :imgSrc="stationImg" @saved="url => updateStation({ imgUrl: url })" />
      <img class="mobile-img" :src="stationImg" alt="">

      <div class="station-summary">
        <p class="summary-title">PLAYLIST</p>
        <h1 class="pointer" @click="isEdit = true">{{ station.name }}</h1>
        <p class="station-desc pointer light" v-if="station.desc" @click="isEdit = true">{{ station.desc }}</p>
        <p class="mini-dashboard"> {{ station.owner?.username || 'anonymous' }} • {{ station.followers?.length || 0 }}
          likes • {{ station.songs.length }} songs<span v-if="station.songs.length">, <span class="light">{{ totalTime
          }}</span></span></p>
      </div>
    </section>


    <station-edit v-if="isEdit" :station="station" :altImg="stationImg" @close="isEdit = false" @save="updateStation" />

    <section class="song-list-container content-layout" ref="list">
      <section class="playlist-actions"
        :class="{ 'flex justify-end': !station.songs.length, 'flex space-between': station.songs.length }">
        <button class="btn-play-green" v-if="station.songs.length"
          @click.stop="(isCurrStationPlayed && isPlaying) ? toggleIsPlaying() : playStation()">
          <pause-btn v-if="isCurrStationPlayed && isPlaying" />
          <play-btn v-else />
        </button>

        <div v-if="station" class="flex option-btns">
          <div class="btn-follow" @click="follow">
            <heart-btn-svg v-if="isFollowed" class="followed" />
            <heart-empty-svg v-else />
          </div>

          <button @click="openStationMenu" class="btn-more">
            <more-options-svg @click.stop="toggleStationMenu" />
            <station-menu v-if="isStationMenuOpen" @queue="queueStation" @remove="removeStation" @follow="follow"
              @edit="isEdit = true" @removeStationQueue="removeQueue(station)" :isFollowed="isFollowed"
              :isQueued="isStationQueued" />
          </button>
        </div>
      </section>
      <song-list v-if="station.songs.length" :songs="station.songs" :isClickOutside="isStationMenuOpen"
        :loggedInUser="loggedInUser" @songClicked="songClicked" @saveSong="saveSong" @removeSong="removeSong"
        @play="playStation" @reorder="reorderSongs" @addToPlaylist="song => { isPickerOpen = true; songToAdd = song }"
        @queueSong="queueSong" @removeQueue="removeQueue" />

      <!-- <h3 v-else> <hr>Let's find something for your playlist </h3> -->
      <!-- <section > -->
      <station-song-search v-if="!station.songs.length || isSearchOpen" :isStationEmpty="!station.songs.length"
        @closeSearch="closeSearch" :key="stationId" />
      <button v-else @click="openSearch" class="btn-find-more">Find more</button>
    </section>
    <station-search-list @addSongToStation="addSongToStation" v-if="searchedSongs" :songs="searchedSongs" />
    <!-- </section> -->
    <!-- <station-picker v-if="isPickerOpen" :user="loggedInUser" @close="isPickerOpen = false" /> -->

    <station-picker v-if="isPickerOpen" :isOpen="isPickerOpen" :user="loggedInUser" :song="songToAdd"
      @close="isPickerOpen = false" />
    <div @click.stop="isPickerOpen = false" class="picker-screen" :class="{ 'shown': isPickerOpen }"></div>

  </section>
  <!-- <pre>{{ station }}</pre> -->
</template>


<script>
import { FastAverageColor } from 'fast-average-color'

import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { stationService } from '../services/station.service'
import { getActionRemoveStation, getActionUpdateStation } from '../store/station.store'
import songList from '../cmps/song-list.vue'
import songListHeader from '../cmps/song-list-header.vue'
import stationMenu from '../cmps/station-menu.vue'
import stationEdit from '../cmps/station-edit.vue'
import stationSongSearch from '../cmps/station-song-search.vue'
import stationSearchList from '../cmps/station-search-list.vue'
import imgUploader from '../cmps/img-uploader.vue'
import stationPicker from '../cmps/station-picker.vue'

import playBtn from '../assets/svgs/play-btn-svg.vue'
import moreOptionsSvg from '../assets/svgs/more-options-svg.vue'
import pencilSvg from '../assets/svgs/pencil-svg.vue'
import musicNoteSvg from '../assets/svgs/music-note-svg.vue'
import heartEmptySvg from '../assets/svgs/heart-empty-svg.vue'
import heartBtnSvg from '../assets/svgs/heart-btn-svg.vue'
import pauseBtn from '../assets/svgs/media-player-stop.vue'
import { socketService } from '../services/socket.service'

export default {
  data() {
    return {
      station: null,
      isStationMenuOpen: false,
      isEdit: false,
      isSearchOpen: true,
      isImgHover: false,
      isStationQueued: false,
      isPickerOpen: false,
      songToAdd: {}
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
      return this.station?.imgUrl || this.station?.songs[0]?.imgUrl.medium || this.station?.songs[0]?.imgUrl
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
    },
    isPlaying() {
      return this.$store.getters.isPlaying
    },

    getPlayingStation() {
      return this.$store.getters.getPlayingStation
    },
    playingSongIdx() {
      return this.$store.getters.getPlayingSongIdx
    },
    isCurrStationPlayed() {
      return this.station._id === this.getPlayingStation._id
    },
    // getStyle() {
    //   // if (window.innerWidth < 750) return

    //   const prop = this.station?.length ? 'space-between' : 'end'
    //   debugger
    //   return { 'justify-content': prop }
    // }
  },
  async mounted() {
    socketService.on('station-updated', station => {
      // console.log('newStation', station)
      // this.$store.commit({ type: 'updateStation', station })
      this.loadStation()
    })

    window.addEventListener('click', this.closeMenu)
    await this.loadStation()
    this.getAvgClr()
    socketService.on('update-station', station => {
      this.$store.commit({ type: 'updateStation', station })
      console.log('Station updated by someone else', station);
    })
  },
  unmounted() {
    window.removeEventListener('click', this.closeMenu)
    this.$store.commit({ type: 'clearCurrStation' })
    // socketService.on('add-song', song)
  },
  methods: {
    songClicked(idx) {
      this.isStationMenuOpen = false
      console.log('playing')
      if (window.innerWidth < 860) {
        this.playStation(idx)
      }
    },
    removeQueue(item) {
      console.log(item);
      if (!item.songs) {
        this.$store.commit({ type: 'removeQueue', item })
      } else {
        this.isStationQueued = !this.isStationQueued
        this.$store.commit({ type: 'removeQueue', item: item.songs })
      }
    },
    queueStation() {
      this.isStationQueued = !this.isStationQueued
      this.$store.commit({ type: 'queueStation', station: this.station.songs })
    },
    queueSong(song) {
      console.log(song);
      try {
        this.$store.commit({ type: 'queueSong', song })
        showSuccessMsg('Queued')
      } catch (err) {
        console.log(err);
      }
    },
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
      if (this.station.owner._id !== this.loggedInUser._id) {
        showErrorMsg('Not your station')
        return
      }
      try {
        await this.$store.dispatch(getActionRemoveStation(this.station._id))
        await this.$store.dispatch({ type: 'updateUser', user: this.loggedInUser })
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
        const res = await this.$store.dispatch(getActionUpdateStation(editedStation))
        socketService.emit('update-station', res)

        if (this.station.name !== editedStation.name)
          await this.$store.commit({ type: 'updateUsersStation', editedStation })
        showSuccessMsg('Station updated')
        this.loadStation()
        this.$store.dispatch({ type: 'updateUser', user: this.loggedInUser })
      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot update station')
      }
    },
    async loadStation() {
      this.station = JSON.parse(JSON.stringify(await stationService.getById(this.stationId)))
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
        const res = await this.$store.dispatch(getActionUpdateStation(editedStation))
        socketService.emit('update-station', res)
        showSuccessMsg('Added to playlist')

        console.log('Emitting from front');

        this.loadStation()
        if (this.isCurrStationPlayed && this.isPlaying)
          this.$store.commit({ type: 'updatePlayingOrder', songs: editedStation.songs })

      } catch (err) {
        console.log(err)
        showErrorMsg('Failed adding song to playlist')
      }
    },
    playStation(idx) {
      if (this.isCurrStationPlayed && (idx === undefined || idx === this.playingSongIdx)) return this.toggleIsPlaying()
      console.log('got here with', idx, this.playingSongIdx, 'station', this.station,)
      this.$store.commit({ type: 'playStation', station: this.station, idx: idx || 0 })
    },
    saveSong(song) {
      this.$store.dispatch({ type: 'saveSong', song })
    },
    toggleIsPlaying() {
      this.$store.commit('toggleIsPlaying')
    },
    async removeSong(song) {
      try {
        const editedStation = JSON.parse(JSON.stringify(this.station))
        const idx = editedStation.songs.findIndex(s => s.id === song.id)
        editedStation.songs.splice(idx, 1)
        const res = await this.$store.dispatch(getActionUpdateStation(editedStation))
        socketService.emit('update-station', res)
        showSuccessMsg('Removed from playlist')
        this.loadStation()
        if (this.isCurrStationPlayed && this.isPlaying)
          this.$store.commit({ type: 'updatePlayingOrder', songs: editedStation.songs })

      } catch (err) {
        console.log(err)
        showErrorMsg('Failed removing song from playlist')
      }
    },
    closeMenu() {
      this.isStationMenuOpen = false
    },
    async getAvgClr() {
      const fac = new FastAverageColor()
      var clr = { hex: '#535353' }
      try {
        clr = await fac.getColorAsync(this.stationImg)
      } catch (err) { console.log(err) }
      finally {
        this.$refs.preview.style.backgroundColor = clr.hex
        this.$refs.list.style.backgroundColor = clr.hex
        // this.$store.commit({ type: 'setAvgClr', clr })
      }
    },
    reorderSongs(reorderedStation) {
      this.updateStation(reorderedStation)
      if (this.isCurrStationPlayed && this.isPlaying) {
        this.$store.commit({ type: 'updatePlayingOrder', songs: reorderedStation.songs })
      }
    }

  },
  watch: {
    stationId() {
      this.loadStation()
    },
    station() {
      this.$store.commit({ type: 'setCurrStation', station: this.station })
    },
    stationImg() {
      this.getAvgClr()

    }
  },
  components: {
    songList,
    stationMenu,
    songListHeader,
    stationEdit,
    imgUploader,
    stationSongSearch,
    stationSearchList,
    moreOptionsSvg,
    pencilSvg,
    musicNoteSvg,
    heartEmptySvg,
    heartBtnSvg,
    playBtn,
    pauseBtn,
    stationPicker
  }


}
</script>
