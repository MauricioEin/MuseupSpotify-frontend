<template>
    <YouTube 
        src="https://www.youtube.com/watch?v=tCXGJQYZ9JA" 
        @ready="getDuration"
        @state-change="onSongLoaded"
        ref="youtube" />

        <div class="controls">
            <button @click="randomSong"><random-svg/></button>
            <button @click="changeSong(-1)"><prev-svg/></button>
            <button @click="togglePlay"> <play-svg v-if="!isPlayed"/> <stop-svg v-else /></button>
            <button @click="changeSong(1)"><change-svg/></button>
            <button @click="toggleMute"><sound-svg v-if="!isMute"/> <muted-svg v-else/> </button>
            
            <input @input="setVolume" type="range" min="0" max="100">
            <label>
                TimeStamp:
                <input v-if="currTime" @input="setTimestamp"  type="range" :value="currTime" min="0" :max='duration'>
            </label>
            <span v-if="currTime">Length: {{ formattedTime(duration) }}</span>
            <span>currTime: {{ formattedTime(currTime) }}</span>
        </div>
</template>

<script>
import { defineComponent } from 'vue'
import YouTube from 'vue3-youtube'
import { utilService } from '../services/util.service'

import playSvg from '../assets/svgs/media-player-play.vue'
import stopSvg from '../assets/svgs/media-player-stop.vue'
import changeSvg from '../assets/svgs/media-player-change.vue'
import prevSvg from '../assets/svgs/media-player-prev.vue'
import randomSvg from '../assets/svgs/media-player-random.vue'
import soundSvg from '../assets/svgs/media-player-sound.vue'
import mutedSvg from '../assets/svgs/media-player-muted.vue'

export default defineComponent({

    data(){
        return{
            isPlayed: false,
            isMute: false,
            currSongIdx: 0,
            songList:['1w7OgIMMRc4', 'jNQXAC9IVRw','-tWhPv2U6aQ'],
            currTime: 0,
            duration: null,
            timeInterval: '',
        }
    },
    
    methods: {
        
        onSongLoaded(e){    
            // clearInterval(this.timeInterval)      
            if(e.data === 1){
                this.getDuration()
                updateCurrTime() 
            }

            
        },

        togglePlay(){
            if(this.isPlayed){
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
            }else{
                this.$refs.youtube.mute()
                this.isMute = true 
            }
        },

        setVolume(e){
           const volume = e.target.value
           this.$refs.youtube.setVolume(volume)
        },

        changeSong(dir){
            this.currSongIdx += dir
            this.$refs.youtube.loadVideoById(this.songList[this.currSongIdx])
          
            this.isPlayed = true
            
            // Video URL expample http://www.youtube.com/v/VIDEO_ID?version=3
           
        },

        setTimestamp(e){
            const timeStamp = e.target.value
            this.$refs.youtube.seekTo(timeStamp)
        },

        updateCurrTime(){
            // if(this.isPlayed){
                this.timeInterval = setInterval(()=>{
                        const currTime = this.$refs?.youtube?.getCurrentTime()
                        console.log(currTime);
                        if(currTime){
                            this.currTime = Math.floor(currTime)
                        } 
                },1000)         
            // }
        },

        getDuration(){
            // setTimeout(()=>{
                console.log(this.$refs.youtube.getDuration());
                console.log('Loaded');
                this.duration = Math.floor(this.$refs.youtube.getDuration())
            // },800)
        },
       
        formattedTime(time){
            const duration = time
            const minutes = ('minutes:,', Math.floor(duration / 60))
            var seconds = ('seconds:,', Math.floor(((duration / 60) % 1) * 60).toString());
            // if(seconds.length < 2){
            //    seconds = '0' + seconds 
            // } 
            return minutes.toString() + ':' + seconds
        },

        randomSong(){
            const randomRange = this.songList.length - 1
            const randIdx = utilService.getRandomIntInclusive(0, randomRange)
            this.$refs.youtube.loadVideoById(this.songList[randIdx])
        },
    },

    computed:{
        playBtnStyle(){
            // return (this.isPlayed) ? <play-svg /> : <stop-svg/>
        }
    },

    components: {
        YouTube,
        playSvg,
        stopSvg,
        changeSvg,
        prevSvg,
        randomSvg,
        soundSvg,
        mutedSvg,
        },
})
</script>

<style>
    .controls{
        position: absolute;
        bottom: 0;
        left: 0;
    }
</style>