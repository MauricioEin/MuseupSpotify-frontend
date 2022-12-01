<template>
    <section class="media-player">
        <YouTube 
            src="https://www.youtube.com/watch?v=tCXGJQYZ9JA" 
            @ready="getDuration"
            @state-change="onStateChanged"
            ref="youtube" />
    
            <div class="controls">
    
                <div class="left-controls">
                    <img src="https://upload.wikimedia.org/wikipedia/he/a/a2/Coldplay_-_My_Universe.png" alt="">
                    <div class="artist-details">
                        <a href="" class="player-song-name">My Universe</a>
                        <a href="" class="player-artist-name">Coldplay, BTS</a>
                    </div>
                    <heart-svg/>
                </div>
    
                <div class="center-controls">
                    <div class="top-center-controls">
                        <button @click="randomSong"><random-svg/></button>
                        <button @click="changeSong(-1)"><prev-svg/></button>
                        <button @click="togglePlay" class="play-btn"> <play-svg v-if="!isPlayed"/> <stop-svg v-else /></button>
                        <button @click="changeSong(1)"><next-svg/></button>
                        <button><loop-svg/></button>
                    </div>
                    <div class="bottom-center-controls">
                        <span class="time-progress">{{ formattedTime(currTime) }}</span>
                        <input @input="setTimestamp"  type="range" :value="currTime" min="0" :max='duration'>                   
                        <span class="time-progress">{{ formattedTime(duration) }}</span>
                    </div>
                </div>
    
                <div class="right-controls">
                    <button @click="toggleMute"><sound-svg v-if="!isMute"/> <muted-svg v-else/> </button>
                    <input @input="setVolume" type="range" min="0" max="100">
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

export default defineComponent({

    data(){
        return{
            isPlayed: false,
            isMute: false,
            isLoop: false,
            currSongIdx: 0,
            songList:['1w7OgIMMRc4', 'jNQXAC9IVRw','-tWhPv2U6aQ'],
            currTime: 0,
            duration: null,
            timeInterval: '',
        }
    },
    
    methods: {
        onStateChanged(e){    
            if(e.data === 1){
                this.getDuration()
            }

            if(e.data === 0){
                this.changeSong(1)
            }

        },

        togglePlay() {
            if (this.isPlayed) {
                this.$refs.youtube.pauseVideo()
                this.isPlayed = false
                clearInterval(this.timeInterval)
            }else{
                this.$refs.youtube.playVideo() 
                this.isPlayed = true
                this.updateCurrTime()
            }
        },
        
        toggleMute(){
            if (this.isMute){
                this.$refs.youtube.unMute() 
                this.isMute = false
            } else {
                this.$refs.youtube.mute()
                this.isMute = true
            }
        },

        setVolume(e) {
            const volume = e.target.value
            this.$refs.youtube.setVolume(volume)
        },

        changeSong(dir){
            this.currSongIdx += dir
            this.$refs.youtube.loadVideoById(this.songList[this.currSongIdx])
          
            this.isPlayed = true
            clearInterval(this.timeInterval)
            this.updateCurrTime()

            // Video URL expample http://www.youtube.com/v/VIDEO_ID?version=3
           
        },

        setTimestamp(e) {
            const timeStamp = e.target.value
            this.$refs.youtube.seekTo(timeStamp)
        },

        updateCurrTime(){
                this.timeInterval = setInterval(()=>{
                        const currTime = this.$refs?.youtube?.getCurrentTime()
                        console.log(currTime);
                        if(currTime){
                            this.currTime = Math.floor(currTime)
                        }
                },1000)         
        },

        getDuration(){
                this.duration = Math.floor(this.$refs.youtube.getDuration())
        },
       
        formattedTime(time){
            const duration = time
            const minutes = ('minutes:,', Math.floor(duration / 60))
            var seconds = ('seconds:,', Math.floor(((duration / 60) % 1) * 60).toString());
            if(seconds.length < 2){
               seconds = '0' + seconds 
            } 
            return minutes.toString() + ':' + seconds
        },

        randomSong(){
            const randomRange = this.songList.length - 1
            const randIdx = utilService.getRandomIntInclusive(0, randomRange)
            this.$refs.youtube.loadVideoById(this.songList[randIdx])
        },
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
        loopSvg
        },
})
</script>

