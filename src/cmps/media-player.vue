<template>
    <YouTube 
        src="https://www.youtube.com/watch?v=tCXGJQYZ9JA" 
        @ready="onReady"
        ref="youtube" />

        <div class="controls">
            <button @click="changeSong(-1)">Previous song</button>
            <button @click="togglePlay">{{ (isPlayed) ? 'Pause' : 'Play' }}</button>
            <!-- <button @click="this.$refs.youtube.pauseVideo()">Pause</button> -->
            <button @click="changeSong(1)">Next song</button>
            <button @click="toggleMute">{{ (isMute) ? 'Unmute' : 'Mute' }}</button>
            <label>
                TimeStamp:
            </label>
            <input v-if="isLoaded" @input="setTimestamp"  type="range" :value="currTime" min="0" :max='songDuration'>
            <input v-else type="range" :value="currentTime">
            <label for="">

                Volume:
            </label>
            <input @input="setVolume" type="range" min="0" max="100">
            <span v-if="isLoaded">Length: {{ songLength }}</span>
            <button @click="cue">Cue Song</button>
            <!-- <button @click="this.$refs.youtube.getVideoUrl()">Copy Link</button> -->
            <button @click="currentTime">GetCurrTime</button>
            <span>currTime: {{ currTime }}</span>
        </div>
</template>

<script>
import { defineComponent } from 'vue'
import YouTube from 'vue3-youtube'

export default defineComponent({

    data(){
        return{
            isLoaded: false,
            song: '',
            isPlayed: false,
            isMute: false,
            currSongIdx: 0,
            songList:['1w7OgIMMRc4', 'jNQXAC9IVRw','-tWhPv2U6aQ'],
            currTime: '',
            songDuration: '',
        }
    },

    mounted(){
        
        // setTimeout(()=>{
            this.loadPlaylist()
            // this.currentTime()
        // },20)
    },
    
    methods: {

        loadPlaylist(){

            //For playing youtube native playlist:
            // try{

                // setTimeout(()=>{
                //     console.log('L');
                //     this.$refs.youtube.loadPlaylist({
                //     list:  'PLPCwOARniRc5tzHxrB-ZKkQVK3pTZ-9OU',
                //     listType: 'playlist'
                // })
                // }, 2000)


            // }catch(err){
                // console.log(err);
            // }
        },

        onReady() {
            // this.$refs.youtube.playVideo()
            this.loaded = true
            // this.songLength
        },

        togglePlay(){
            if(this.isPlayed){
                this.$refs.youtube.pauseVideo() 
                this.isPlayed = false
            }else{
                this.$refs.youtube.playVideo() 
                this.isPlayed = true
                this.currentTime()
            }
            this.isLoaded = true

            console.log(this.isPlayed);
        },
        
        toggleMute(){
            console.log('works');
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
            if(dir > 0){
                // this.$refs.youtube.nextVideo()
                this.currSongIdx += 1
                console.log(this.currSongIdx);
                this.$refs.youtube.loadVideoById(this.songList[this.currSongIdx])
            }else{
                this.currSongIdx -= 1
                this.$refs.youtube.loadVideoById(this.songList[this.currSongIdx])
                // this.$refs.youtube.previousVideo()
            }
            this.isPlayed = true
            // Video URL expample http://www.youtube.com/v/VIDEO_ID?version=3
            // this.$refs.youtube.loadPlaylist(this.songList)
            // this.$refs.youtube.playVideoAt(0)
        },

        setTimestamp(e){
            const timeStamp = e.target.value
            this.$refs.youtube.seekTo(timeStamp)
            console.log(timeStamp);
        },

        cue(){
            this.$refs.youtube.cueVideoById('gEPmA3USJdI')
        },

        currentTime(){
            if(this.isPlayed){
                setInterval(()=>{
                    // console.log(Math.floor(this.$refs.youtube.getCurrentTime()).toString());
                    this.currTime = Math.floor(this.$refs.youtube.getCurrentTime())
                },1000)
            }
            // return Math.floor(this.$refs.youtube.getCurrentTime()).toString()
        }
    },

    computed:{
        songLength(){
            const duration = Math.floor(this.$refs.youtube.getDuration())
            console.log('NewSong',duration);

            // if(duration < 60){
            //     return '0:' + duration.toString()
            // }
            
            const minutes = ('minutes:,', Math.floor(duration / 60))
            var seconds = ('seconds:,', Math.floor(((duration / 60) % 1) * 60).toString());
            console.log('min', minutes, 'sec', seconds);
            // if(seconds.length < 2){
            //     seconds = '0' + seconds
            // }
            // console.log('duration', minutes, ':', seconds);
            // return minutes + ':' + seconds
            return minutes.toString() + ':' + seconds
        },

        getDuration(){

            // setInterval(()=>{
                const duration = Math.floor(this.$refs.youtube.getDuration())
                console.log(duration / 60);
                this.songDuration = duration
                console.log(duration);
                return duration.toString()
            // },1000)
        }
    },
    

    components: { YouTube },
})
</script>

<style>
    .controls{
        position: absolute;
        bottom: 0;
        left: 0;
    }
</style>