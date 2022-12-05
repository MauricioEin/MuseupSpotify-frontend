<template>
    <section class="media-player" :class="setFull">

        <img class="fit-img album" :class="setFull" :src="currSongPlaying.imgUrl" alt="">


        <div class="player-section">

            <YouTube :src="`https://www.youtube.com/watch?v=${currSongPlaying.youtubeId}`" @ready="getDuration"
                @state-change="onStateChange" ref="youtube" />

            <div class="controls" :class="setFull">

                <div class="left-controls" :class="setFull">
                    <img class="media-img fit-img" :class="setFull" :src="currSongPlaying.imgUrl" alt="">
                    <div :class="setFull" class="artist-details">
                        <a href="" class="player-song-name">{{ currSongPlaying.title.slice(0, 25) }}...</a>
                        <!-- <a href="" class="player-artist-name">Coldplay, BTS</a> -->
                    </div>
                    <button>
                        <heart-svg />
                    </button>
                </div>

                <div class="center-controls" :class="setFull">
                    <div class="top-center-controls">
                        <button @click="(isShuffled) ? restoreOriginalList() : shuffleList()">
                            <random-svg :style="shuffleStyle" />
                        </button>
                        <button @click="changeSong(-1)">
                            <prev-svg />
                        </button>
                        <button @click="togglePlay" class="play-btn">
                            <play-svg v-if="!isPlaying" />
                            <stop-svg v-else />
                        </button>
                        <button @click="changeSong(1)">
                            <next-svg />
                        </button>
                        <button @click="changeLoopType">
                            <loop-song-svg class="loop-song" v-if="(loopType === 2)"/>
                            <loop-svg v-else :style="loopStyle" />
                            <!-- {{ loopType.toString() }} -->
                        </button>
                    </div>
                    <div class="bottom-center-controls" :class="setFull">
                        <span class="time-progress">{{ formattedTime(currTime) }}</span>
                        <input class="timestamp" @input="setTimestamp" type="range" :value="currTime" min="0"
                            :max='duration'>
                        <progress :value="currTime" type="progress" min="0" :max='duration'></progress>
                        <span class="time-progress">{{ formattedTime(duration) }}</span>
                    </div>
                </div>

                <div class="right-controls" :class="setFull">
                    <button @click="toggleMute">
                        <sound-svg v-if="!isMute" />
                        <muted-svg v-else />
                    </button>
                    <input class="volume" @input="setVolume" type="range" min="0" max="100">
                    <progress class="prog" :value="volume" min="0" max="100"></progress>
                    <button @click="(isFullscreen = !isFullscreen)">
                        <full-svg v-if="!isFullscreen" />
                        <minimize-svg v-else />
                    </button>
                </div>

            </div>

        </div>
    </section>
</template>

<script>
import { defineComponent } from 'vue'
import YouTube from 'vue3-youtube'
import { utilService } from '../services/util.service'

import playSvg from '../assets/svgs/media-player-play.vue'
import stopSvg from '../assets/svgs/media-player-stop.vue'
import nextSvg from '../assets/svgs/media-player-next.vue'
import prevSvg from '../assets/svgs/media-player-prev.vue'
import randomSvg from '../assets/svgs/media-player-random.vue'
import soundSvg from '../assets/svgs/media-player-sound.vue'
import mutedSvg from '../assets/svgs/media-player-muted.vue'
import heartSvg from '../assets/svgs/media-player-heart.vue'
import loopSvg from '../assets/svgs/media-player-loop.vue'
import fullSvg from '../assets/svgs/media-player-full.vue'
import minimizeSvg from '../assets/svgs/media-player-minimize.vue'
import loopSongSvg from '../assets/svgs/media-player-loop-song.vue'

export default defineComponent({
    //[{title:'Coldplay - Universe', imgUrl:'https://upload.wikimedia.org/wikipedia/en/a/a2/Coldplay_-_My_Universe.png', youtubueId: 'nukZQTFsA10'}
    data() {
        return {
            isPlaying: false,
            isMute: false,
            isShuffled: false,
            isFullscreen: false,
            volume: 50,
            currSongIdx: this.playingSongIdx,
            originalList: [],
            songList: [],
            currTime: 0,
            duration: null,
            timeInterval: '',
            loopType: 0,
            currSongPlaying: {},
        }
    },

    created() {
        // const station = this.$store.getters.getPlayingStation
        // const songIdx = this.$store.getters.playingSongIdx
        this.originalList = this.songList = this.playingStation.songs
        this.currSongIdx = this.playingSongIdx
        // console.log(this.currSongIdx);
        this.currSongPlaying = this.songList[this.currSongIdx]
    },

    methods: {
        onStateChange(ev) {
            if (ev.data === 1) {
                this.getDuration()
            }

            if (ev.data === 0 &&
                this.currSongIdx !== this.songList.length - 1 &&
                this.loopType !== 2) {
                this.changeSong(1)
            }
            else if(ev.data === 0 &&
                    this.currSongIdx === this.songList.length - 1 &&
                    this.loopType === 1){
                this.changeSong(1)
            }
            else if (ev.data === 0 &&
                     this.loopType === 2) {
                this.$refs.youtube.loadVideoById(this.songList[this.currSongIdx].youtubeId)
            }

        },

        togglePlay() {
            this.$store.commit({ type: 'toggleIsPlaying' })
            // if (this.isPlaying) {
            //     this.$refs.youtube.pauseVideo()
            //     // this.isPlaying = false
            //     clearInterval(this.timeInterval)
            // } else {
            //     this.$refs.youtube.playVideo()
            //     // this.isPlaying = true
            //     this.updateCurrTime()
            // }
        },

        toggleMute() {
            if (this.isMute) {
                this.$refs.youtube.unMute()
                this.isMute = false
            } else {
                this.$refs.youtube.mute()
                this.isMute = true
            }
        },

        setVolume(ev) {
            const volume = ev.target.value
            this.volume = volume
            this.$refs.youtube.setVolume(volume)
        },

        changeSong(dir) {
            const newIdx = (this.currSongIdx + dir + this.songList.length) % this.songList.length
            // this gives us the calc for looping around the playlist
            this.$store.commit({ type: 'playStation', station: this.playingStation, idx: newIdx })
        },

        setTimestamp(ev) {
            const timeStamp = ev.target.value
            this.$refs.youtube.seekTo(timeStamp)
        },

        updateCurrTime() {
            this.timeInterval = setInterval(() => {
                const currTime = this.$refs?.youtube?.getCurrentTime()
                // console.log(currTime)
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

        shuffleList() {
            const formatted = Array.from(this.songList)
            const shuffled = utilService.shuffle(formatted)
            this.songList = shuffled
            this.isShuffled = true
        },

        restoreOriginalList() {
            this.songList = this.originalList
            this.isShuffled = false
        },

        setFullscreen() {

        },

        updateCurrStation() {
            this.originalList = this.songList = this.playingStation.songs
            this.currSongIdx = this.playingSongIdx
            this.currSongPlaying = this.songList[this.currSongIdx]
            if (!this.isPlayingInStore) {
                this.togglePlay()
            }
        },

        changeLoopType(){
            this.loopType++
            if(this.loopType === 3) this.loopType = 0
        },
    },

    computed: {
        shuffleStyle() {
            return (this.isShuffled) ? { fill: '#1ED760' } : {}
        },

        loopStyle() {
            return (this.loopType === 1) ? { fill: '#1ED760' } : {}
        },

        setFull() {
            return (this.isFullscreen) ? 'full' : ''
        },
        playingStation() {
            return this.$store.getters.getPlayingStation
        },

        playingSongIdx() {
            return this.$store.getters.getPlayingSongIdx
        },

        isPlayingInStore() {
            return this.$store.getters.isPlaying
        }
    },

    watch: {
        playingStation() {
            this.updateCurrStation()
        },
        playingSongIdx() {
            this.updateCurrStation()

        },
        isPlayingInStore() {
            this.isPlaying = this.isPlayingInStore
            // this.togglePlay()
        },

        isPlaying() {
            if (this.isPlaying) {
                this.$refs.youtube.playVideo()
                // this.isPlaying = true
                this.updateCurrTime()
            } else {
                this.$refs.youtube.pauseVideo()
                // this.isPlaying = false
                clearInterval(this.timeInterval)
            }
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
        heartSvg,
        loopSvg,
        fullSvg,
        minimizeSvg,
        loopSongSvg
    },
})
</script>

