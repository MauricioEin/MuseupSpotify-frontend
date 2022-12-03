<template>
    <section class="media-player" :class="setFull">

        <img class="fit-img album " :class="setFull" :src="currSongPlaying.imgUrl" alt="">


        <div class="player-section">

            <YouTube :src="`https://www.youtube.com/watch?v=${currSongPlaying.youtubeId}`" @ready="getDuration"
                @state-change="onStateChanged" ref="youtube" />

            <div class="controls" :class="setFull">

                <div class="left-controls" :class="setFull">
                    <img :class="setFull" :src="currSongPlaying.imgUrl" alt="">
                    <div :class="setFull" class="artist-details">
                        <a href="" class="player-song-name">{{ currSongPlaying.title.slice(0, 25)}}...</a>
                        <!-- <a href="" class="player-artist-name">Coldplay, BTS</a> -->
                    </div>
                    <button><heart-svg /></button>
                </div>

                <div class="center-controls" :class="setFull">
                    <div class="top-center-controls">
                        <button @click="(isShuffled) ? restoreOriginalList() : shuffleList()"><random-svg
                                :style="shuffleStyle" /></button>
                        <button @click="changeSong(-1)"><prev-svg /></button>
                        <button @click="togglePlay" class="play-btn"> <play-svg v-if="!isPlayed" /> <stop-svg
                                v-else /></button>
                        <button @click="changeSong(1)"><next-svg /></button>
                        <button @click="(isLoop = !isLoop)"><loop-svg :style="loopStyle" /></button>
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
                    <button @click="toggleMute"><sound-svg v-if="!isMute" /> <muted-svg v-else /> </button>
                    <input class="volume" @input="setVolume" type="range" min="0" max="100">
                    <progress class="prog" :value="volume" min="0" max="100"></progress>
                    <button @click="(isFullscreen = !isFullscreen)"><full-svg v-if="!isFullscreen" /> <minimize-svg
                            v-else /></button>
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

export default defineComponent({
    //[{title:'Coldplay - Universe', imgUrl:'https://upload.wikimedia.org/wikipedia/en/a/a2/Coldplay_-_My_Universe.png', youtubueId: 'nukZQTFsA10'}
    data() {
        return {
            isPlayed: false,
            isMute: false,
            isLoop: false,
            isShuffled: false,
            isFullscreen: false,
            volume: 50,
            currSongIdx: this.getPlayingSongIdx,
            originalList: [],
            songList: [],
            currTime: 0,
            duration: null,
            timeInterval: '',
            currSongPlaying: {}
        }
    },

    created() {
        // const station = this.$store.getters.getPlayingStation
        // const songIdx = this.$store.getters.getPlayingSongIdx
        this.originalList = this.songList = this.getStation
        this.currSongIdx = this.getPlayingSongIdx
        // console.log(this.currSongIdx);
        this.currSongPlaying = this.songList[this.currSongIdx]
    },

    methods: {
        onStateChanged(e) {
            if (e.data === 1) {
                this.getDuration()
            }

            if (e.data === 0 && !this.isLoop) {
                this.changeSong(1)
            } else if (e.data === 0 && this.isLoop) {
                console.log('here', this.songList[this.currSongIdx]);
                this.$refs.youtube.loadVideoById(this.songList[this.currSongIdx].youtubeId)
            }

        },

        togglePlay() {
            if (this.isPlayed) {
                this.$refs.youtube.pauseVideo()
                this.isPlayed = false
                clearInterval(this.timeInterval)
            } else {
                this.$refs.youtube.playVideo()
                this.isPlayed = true
                this.updateCurrTime()
            }
            this.$store.commit({ type: 'toggleIsPlayed' })
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

        setVolume(e) {
            const volume = e.target.value
            this.volume = volume
            this.$refs.youtube.setVolume(volume)
        },

        changeSong(dir) {
            this.currSongIdx += dir

            if (this.currSongIdx < 0) this.currSongIdx = this.songList.length - 1
            if (this.currSongIdx === this.songList.length) this.currSongIdx = 0
            console.log(this.currSongIdx);
            console.log(this.songList[this.currSongIdx]);
            this.$refs.youtube.loadVideoById(this.songList[this.currSongIdx].youtubeId)
            this.currSongPlaying = this.songList[this.currSongIdx]
            this.isPlayed = true
            clearInterval(this.timeInterval)
            this.updateCurrTime()

            // Video URL expample http://www.youtube.com/v/VIDEO_ID?version=3

        },

        setTimestamp(e) {
            const timeStamp = e.target.value
            this.$refs.youtube.seekTo(timeStamp)
        },

        updateCurrTime() {
            this.timeInterval = setInterval(() => {
                const currTime = this.$refs?.youtube?.getCurrentTime()
                console.log(currTime);
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
            var seconds = ('seconds:,', Math.floor(((duration / 60) % 1) * 60).toString());
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

            console.log(this.songList);
        },

        restoreOriginalList() {
            this.songList = this.originalList
            this.isShuffled = false
        },

        setFullscreen() {

        },

        updateCurrStation() {
            this.originalList = this.songList = this.getStation
            this.currSongIdx = this.getPlayingSongIdx
            this.currSongPlaying = this.songList[this.currSongIdx]
            if (!this.isPlayed) {
                this.togglePlay()
            }
        }
    },

    computed: {
        shuffleStyle() {
            return (this.isShuffled) ? { fill: '#1ED760' } : {}
        },

        loopStyle() {
            return (this.isLoop) ? { fill: '#1ED760' } : {}
        },

        setFull() {
            return (this.isFullscreen) ? 'full' : ''
        },
        getStation() {
            return this.$store.getters.getPlayingStation
        },

        getPlayingSongIdx() {
            return this.$store.getters.getPlayingSongIdx
        },

        isPlaying() {
            return this.$store.getters.isPlayed
        }
    },

    watch: {
        getStation() {
            this.updateCurrStation()
        },
        isPlaying() {
            this.isPlayed = this.isPlaying
            this.togglePlay()
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
        minimizeSvg
    },
})
</script>

