<template>
    <li class="song-preview" @click.stop="$emit('clicked', song.id)"
        :class="{ clicked: isClicked, playing: isOnPlayer }">
        <span class="column-drag-handle" @mousedown="isDragged = true" @mouseup="isDragged = false"
            :class="{ dragged: isDragged }">&#x2630;</span>

        <!-- <div class="song-preview-info"> -->
        <div class="song-index">
            <img v-if="isOnPlayer && isPlayerOn" src="../assets/gifs/equaliser-animated.gif" />
            <span v-else class="artist-name"> {{ index + 1 }} </span>

            <div v-if="isOnPlayer && isPlayerOn" @click.stop="pauseSong">
                <media-player-stop />
            </div>
            <div v-else @click.stop="$emit('play')" title="Play song">
                <play-btn-svg />
            </div>
        </div>
        <div class="song-img-container">
            <img :src="imgUrl" alt="">
        </div>
        <div class="song-title">
            <span class="artist-name"> {{ song.title.slice(0, titleBreakIdx) }}</span>
            {{ song.title.slice(titleBreakIdx) }}
        </div>
        <!-- </div> -->
        <div class="song-created-at">{{ dateAdded }}</div>
        <div class="song-preview-actions">
            <button class="btn-like-song" @click="onMiniMenu('saveSong')" :class="{ liked: isLiked }">
                <heart-btn-svg v-if="isLiked" class="liked" />
                <heart-empty-svg v-else />
            </button>
            <div class="song-length">{{ song.length }}</div>
            <button class="btn-more" @click="toggleMiniMenu">
                <more-options-svg />
                <mini-menu v-if="isMiniMenu && isClicked" ref="miniMenu" :actions="songActions"
                    @saveToYourLikedSongs="onMiniMenu('saveSong')" @removeFromPlaylist="onMiniMenu('removeSong')"
                    @removeFromYourLikedSongs="onMiniMenu('saveSong')" @addToQueue="onMiniMenu('queueSong')"
                    @removeFromQueue="onMiniMenu('removeQueue')" @AddToAPlaylist="onMiniMenu('addToPlaylist')" />
            </button>
        </div>
    </li>


</template>

<script>
import { utilService } from '../services/util.service'

import heartEmptySvg from '../assets/svgs/heart-empty-svg.vue'
import heartBtnSvg from '../assets/svgs/heart-btn-svg.vue'
import moreOptionsSvg from '../assets/svgs/more-options-svg.vue'
import playBtnSvg from '../assets/svgs/play-btn-svg.vue'
import mediaPlayerStop from '../assets/svgs/media-player-stop.vue'

import miniMenu from '../cmps/mini-menu.vue'


export default {
    props: {
        song: {
            type: Object
        },
        index: {
            type: Number
        },
        clickedSong: {
            type: String
        },
        isLikedSongs: { type: Boolean },
        // playingSong: {
        //     type: String
        // },
        loggedInUser: { type: Object },
        dropKey: { type: Number }
    },
    emits: ['clicked'],
    data() {
        return {
            isMiniMenu: false,
            isDragged: false,
            isQueued: false,
            // isPlaying: false,
        }
    },
    created() {
        window.addEventListener('click', this.emitClicked)
    },
    unmounted() {
        window.removeEventListener('click', this.emitClicked)

    },
    computed: {
        dateAdded() {
            return utilService.daysAgo(this.song.createdAt)
            // const d = new Date(this.song.createdAt)
            // return d.toLocaleDateString('he-IL')
        },
        imgUrl() {
            return this.song.imgUrl.medium || this.song.imgUrl
        },
        isClicked() {
            return this.clickedSong === this.song.id
        },
        isOnPlayer() {
            return this.nowPlayingSong.youtubeId === this.song.id
        },
        isLiked() {
            return this.loggedInUser.likedSongs.some(song => song.id === this.song.id)
        },
        songActions() {
            const songActions = ['Add to queue', this.isLiked ? 'Remove from your Liked Songs' : 'Save to your Liked Songs', 'Add to a playlist', 'Remove from playlist', 'Share']
            if (this.isLikedSongs) songActions.splice(3, 1)
            if (this.isQueued) songActions.splice(0, 1, 'Remove from queue')
            return songActions
        },
        nowPlayingSong() {
            return this.$store.getters.playingSong
        },
        isPlayerOn() {
            return this.$store.getters.isPlaying
        },
        titleBreakIdx() {
            var idx = this.song.title.indexOf('-')
            if (idx === -1) idx = this.song.title.indexOf('|')
            return idx === -1 ? 0 : idx
        },

    }, methods: {
        toggleMiniMenu() {
            this.isMiniMenu = !this.isMiniMenu
        },
        onMiniMenu(action) {
            this.isMiniMenu = false
            console.log(this.isQueued);
            console.log(action)
            this.$emit('songAction', action)
            if (action = 'addToQueue') this.isQueued = !this.isQueued
            console.log(this.isQueued);
        },
        // playSong() {
        //     this.$store.commit({ type: 'toggleIsPlaying' })
        //     this.$store.commit({ type: 'playSong', song: JSON.parse(JSON.stringify(this.song)) })
        // },
        pauseSong() {
            this.$store.commit({ type: 'toggleIsPlaying' })
        },
        emitClicked() {
            this.$emit('clicked', '')
        },
        mouseEvent() {
            console.log('yes!')
        }


    },
    watch: {
        isClicked() {
            if (!this.isClicked) this.isMiniMenu = false
        },
        dropKey() {
            this.isDragged = false
        }
    },
    components: {
        heartEmptySvg,
        heartBtnSvg,
        moreOptionsSvg,
        playBtnSvg,
        mediaPlayerStop,

        miniMenu
    }
}

</script>

<style lang="scss" scoped>

</style>