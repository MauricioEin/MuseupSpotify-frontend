<!-- TODO: erase things from debugging: YTState, clickImg(), playBtn ref -->



<template>
    <section class="media-player" :class="fullClass" ref="player" @touchstart="startTouch" @touchend="endTouch">
        <div class="playing-from" v-if="isFullscreen">
            <span>Playing From</span>
            <span class="playlist-name">{{ playingStation.name }}</span>
        </div>
        <img class="fit-img album" :class="fullClass" :src="currSongPlaying.imgUrl.medium || currSongPlaying.imgUrl"
            alt="">
        <button v-if="isFullscreen" class="close-full-mobile" @click="(isFullscreen = false)">
            <btn-down-svg />
        </button>

        <div class="player-section">

            <YouTube :src="`https://www.youtube.com/watch?v=${currSongPlaying.youtubeId}`" @ready="getDuration"
                @state-change="onStateChange" ref="youtube" />

            <div class="controls" :class="fullClass" @click="setFullInMobile">
                <div class="left-controls" :class="fullClass">
                    <img class="media-img fit-img" :class="fullClass"
                        :src="currSongPlaying.imgUrl.medium || currSongPlaying.imgUrl" :alt="currSongPlaying.title">
                    <div :class="fullClass" class="artist-details">
                        <span class="player-song-name">{{ currSongPlaying.title }}</span>
                    </div>
                    <button class="flex justify-center align-center" @click.stop="saveSong" :class="{ liked: isLiked }">
                        <heart-btn-svg v-if="isLiked" class="liked" />
                        <heart-empty-svg v-else />
                    </button>
                    <button class="flex justify-center align-center lyrics-btn" :class="{ active: songLyrics }">
                        <lyrics-btn-svg @click="isLyrics = !isLyrics" :class="{ liked: isLyrics }" />
                    </button>
                </div>

                <div class="center-controls" :class="fullClass">
                    <div class="top-center-controls" :class="fullClass">
                        <button @click="isShuffled = !isShuffled">
                            <random-svg class="random-btn" :style="shuffleStyle" />
                        </button>
                        <button @click="changeSong(-1)">
                            <prev-svg />
                        </button>
                        <button @click.stop="togglePlay" class="play-btn">
                            <play-svg class="play-svg" v-if="!isPlaying" />
                            <stop-svg class="stop-svg" v-else />
                        </button>
                        <button @click="changeSong(1)">
                            <next-svg />
                        </button>
                        <button @click="changeLoopType">
                            <loop-song-svg class="loop-song" v-if="(loopType === 2)" />
                            <loop-svg class="loop-song" v-else :style="loopStyle" />
                        </button>
                    </div>
                    <div class="bottom-center-controls" :class="fullClass">
                        <span class="time-progress-1">{{ formattedTime(currTime) }}</span>
                        <div class="progress-container">
                            <progress class="prog progress-bar" type="progress" :value="currTime" min="0"
                                :max="duration"></progress>
                            <input class="prog input-bar timestamp" id="fontController" type="range"
                                @input="setTimestamp" :value="currTime" min="0" :max="duration" />
                        </div>

                        <span class="time-progress-2">{{ formattedTime(duration) }}</span>
                    </div>
                </div>

                <div class="right-controls" :class="fullClass">

                    <button class="sound-btn" @click="toggleMute">
                        <sound-svg v-if="!isMute" />
                        <muted-svg v-else />
                    </button>
                    <div class="progress-container">
                        <progress class="prog progress-bar" :value="volume" max="100"></progress>
                        <input class="prog input-bar sound" type="range" @input="setVolume" max="100" />
                    </div>
                    <button @click="(isFullscreen = !isFullscreen)">
                        <full-svg v-if="!isFullscreen" />
                        <minimize-svg v-else />
                    </button>
                </div>
                <div class="mobile-lyrics-container" v-if="songLyrics && isMobileFullScreen">
                    <song-lyrics class="mobile-lyrics" :lyrics="songLyrics" />
                </div>
            </div>

        </div>
        <song-lyrics v-if="songLyrics && isLyrics" :lyrics="songLyrics" />
        <login-modal :isIosWarning="true" v-if="isPlaying && isIos && !isIosWarned"/>
    </section>
</template>

<script>
import { defineComponent } from 'vue'
import YouTube from 'vue3-youtube'
import { utilService } from '../services/util.service'
import { getLyrics } from '../services/lyrics.service'

import playSvg from '../assets/svgs/media-player-play.vue'
import stopSvg from '../assets/svgs/media-player-stop.vue'
import nextSvg from '../assets/svgs/media-player-next.vue'
import prevSvg from '../assets/svgs/media-player-prev.vue'
import randomSvg from '../assets/svgs/media-player-random.vue'
import soundSvg from '../assets/svgs/media-player-sound.vue'
import mutedSvg from '../assets/svgs/media-player-muted.vue'
import heartEmptySvg from '../assets/svgs/heart-empty-svg.vue'
import heartBtnSvg from '../assets/svgs/heart-btn-svg.vue'
import loopSvg from '../assets/svgs/media-player-loop.vue'
import fullSvg from '../assets/svgs/media-player-full.vue'
import minimizeSvg from '../assets/svgs/media-player-minimize.vue'
import loopSongSvg from '../assets/svgs/media-player-loop-song.vue'
import btnDownSvg from '../assets/svgs/btn-down-svg.vue'
import lyricsBtnSvg from '../assets/svgs/lyrics-btn-svg.vue'
import songLyrics from './song-lyrics.vue'

import loginModal from './login-modal.vue'

export default defineComponent({
    data() {
        return {
            isMute: false,
            isShuffled: false,
            isFullscreen: false,
            volume: 50,
            songList: [],
            currTime: 0,
            duration: null,
            timeInterval: '',
            loopType: 0,
            currSongPlaying: {},
            songLyrics: '',
            isLyrics: false,
            station: "",
            touchStartX: 0,
            touchStartY: 0,
        }
    },

    created() {
        this.songList = [...this.playingStation.songs]
        this.currSongPlaying = this.songList[this.playingSongIdx]
        window.addEventListener('popstate', this.onPopState, false)
    },

    computed: {
        shuffleStyle() {
            return (this.isShuffled) ? { fill: '#1ED760' } : {}
        },
        loopStyle() {
            return (!this.loopType) ? { fill: '#b3b3b3' } : {}
        },
        fullClass() {
            return (this.isFullscreen) ? 'full' : ''
        },
        playingStation() {
            return this.$store.getters.getPlayingStation
        },
        playingSongIdx() {
            return this.$store.getters.getPlayingSongIdx
        },
        isPlaying() {
            return this.$store.getters.isPlaying
        },
        loggedInUser() {
            return this.$store.getters.loggedinUser
        },
        isLiked() {
            return this.loggedInUser.likedSongs.some(song => song.youtubeId === this.currSongPlaying.youtubeId)
        },
        isMobileFullScreen() {
            return this.isFullscreen && window.innerWidth < 860
        },
        isIos() {
            return this.$store.getters.isIos
        },
        isIosWarned() {
            return this.$store.getters.isIosWarned
        },
    },

    methods: {
        onPopState(event) {
            if (this.isFullscreen) {
                this.isFullscreen = false
                this.$router.push(event.state.forward)
            }
        },
        startTouch(ev) {
            this.touchStartX = ev.changedTouches[0].screenX;
            this.touchStartY = ev.changedTouches[0].screenY;

        },
        endTouch(ev) {
            const touchEndX = ev.changedTouches[0].screenX;
            const touchEndY = ev.changedTouches[0].screenY;
            this.handleSwipe(this.touchStartX, this.touchStartY, touchEndX, touchEndY);
        },
        handleSwipe(startX, startY, endX, endY) {
            if (!this.isFullscreen) return
            if (Math.abs(endY - startY) < 60) {
                const diff = endX - startX
                if (diff > 80) {
                    this.changeSong(-1)
                }
                else if (diff < -80) {
                    this.changeSong(1)
                }
            }
        },
        async onStateChange(ev) {
            if (ev.data === 1) {
                this.getDuration()
                if (!this.songLyrics)
                    this.songLyrics = await getLyrics(this.currSongPlaying.title) || ''
            }
            else if (ev.data === -1) {
                this.songLyrics = ''
            }
            else if (ev.data === 0 &&
                this.playingSongIdx !== this.songList.length - 1 &&
                this.loopType !== 2) {
                this.changeSong(1)
            }
            else if (ev.data === 0 &&
                this.playingSongIdx === this.songList.length - 1 &&
                this.loopType === 0) {
                this.togglePlay()
            }
            else if (ev.data === 0 &&
                this.playingSongIdx === this.songList.length - 1 &&
                this.loopType === 1) {
                this.changeSong(1)
            }
            else if (ev.data === 0 &&
                this.loopType === 2) {
                this.$refs.youtube.loadVideoById(this.songList[this.playingSongIdx].youtubeId)
            }
            // else if (ev.data === 2 && this.isPlaying) {
            // }
        },

        togglePlay() {
            this.$store.commit({ type: 'toggleIsPlaying' })
        },

        toggleMute() {
            this.isMute ? this.$refs.youtube.unMute()
                : this.$refs.youtube.mute()
            this.isMute = !this.isMute
        },

        setVolume({ target }) {
            this.volume = target.value
            this.$refs.youtube.setVolume(this.volume)
        },

        changeSong(dir) {
            var newIdx = this.playingSongIdx
            if (this.isShuffled) {
                while (newIdx === this.playingSongIdx) {
                    newIdx = utilService.getRandomIntInclusive(0, this.songList.length - 1)
                }
            } else newIdx = (this.playingSongIdx + dir + this.songList.length) % this.songList.length

            this.$store.commit({ type: 'playStation', station: this.playingStation, idx: newIdx })
        },

        setTimestamp(ev) {
            this.currTime = ev.target.value
            this.$refs.youtube.seekTo(this.currTime)
        },

        updateCurrTime() {
            this.timeInterval = setInterval(() => {
                const currTime = this.$refs?.youtube?.getCurrentTime()
                if (currTime) {
                    this.currTime = Math.floor(currTime)
                }
            }, 1000)
        },

        getDuration() {
            this.duration = Math.floor(this.$refs.youtube.getDuration())
        },

        formattedTime(time) {
            const duration = time
            const minutes = ('minutes:,', Math.floor(duration / 60))
            var seconds = ('seconds:,', Math.floor(((duration / 60) % 1) * 60).toString())
            if (seconds.length < 2) {
                seconds = '0' + seconds
            }
            return minutes.toString() + ':' + seconds
        },

        updateCurrStation() {
            this.originalList = this.songList = this.playingStation.songs
            this.currSongPlaying = this.songList[this.playingSongIdx]
            if (!this.isPlaying) this.togglePlay()
        },

        changeLoopType() {
            this.loopType++
            if (this.loopType === 3) this.loopType = 0
        },

        setFullInMobile() {
            if (window.innerWidth < 750)
                this.isFullscreen = true
        },
        saveSong() {
            this.$store.dispatch({ type: 'saveSong', song: this.currSongPlaying })
        },
    },

    watch: {
        playingStation() {
            this.updateCurrStation()
        },
        isPlaying() {
            if (this.isPlaying) {
                this.$refs.youtube.playVideo()
                this.updateCurrTime()
            } else {
                this.$refs.youtube.pauseVideo()
                clearInterval(this.timeInterval)
            }
        },
        songLyrics() {
            if (!this.songLyrics) this.isLyrics = false
        },
        isFullscreen() {
            this.$refs.player.style.backgroundColor = this.isFullscreen ?
                this.playingStation.clr : ''
        }
    },

    components: {
        YouTube,
        playSvg,
        stopSvg,
        nextSvg,
        prevSvg,
        randomSvg,
        soundSvg,
        mutedSvg,
        heartEmptySvg,
        heartBtnSvg,
        loopSvg,
        fullSvg,
        minimizeSvg,
        loopSongSvg,
        btnDownSvg,
        lyricsBtnSvg,
        songLyrics,
        loginModal
    },
})
</script>

