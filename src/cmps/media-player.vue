<template>
    <YouTube 
        src="https://www.youtube.com/watch?v=jNQXAC9IVRw" 
        @ready="onReady"
        ref="youtube" />
        <button @click="changeSong(-1)">Previous song</button>
        <button @click="togglePlay">{{ (isPlayed) ? 'Pause' : 'Play' }}</button>
        <!-- <button @click="this.$refs.youtube.pauseVideo()">Pause</button> -->
        <button @click="changeSong(1)">Next song</button>
        <button @click="toggleMute">{{ (isMute) ? 'Unmute' : 'Mute' }}</button>
        TimeStamp:
        <input v-if="loaded" @input="setTimestamp" type="range" min="0" :max='getDuration'>
        Volume:
        <input @input="setVolume" type="range" min="0" max="100">
        <span v-if="loaded">Duration: {{ songLength }}</span>
        <!-- <button @click="this.$refs.youtube.getVideoUrl()">Copy Link</button> -->
</template>

<script>
import { defineComponent } from 'vue'
import YouTube from 'vue3-youtube'

export default defineComponent({

    data(){
        return{
            loaded: false,
            song: '',
            isPlayed: false,
            isMute: false,
            songList:['1w7OgIMMRc4', 'jNQXAC9IVRw'],
        }
    },

    created(){
        console.log(this.$refs.youtube); 
        console.log(this.song);
        setTimeout(()=>{

            this.loadPlaylist()
        },20)
    },
    
    methods: {

        loadPlaylist(){
            try{

                this.$refs.youtube.loadPlaylist(['1w7OgIMMRc4', 'jNQXAC9IVRw'])
            }catch(err){
                console.log(err);
            }
        },

        onReady() {
            // this.$refs.youtube.playVideo()
            this.loaded = true
        },

        togglePlay(){
            if(this.isPlayed){
                this.$refs.youtube.pauseVideo() 
                this.isPlayed = false
            }else{
                this.$refs.youtube.playVideo() 
                this.isPlayed = true
            }
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
            console.log('clicked');
            // Video URL expample http://www.youtube.com/v/VIDEO_ID?version=3
            // this.$refs.youtube.loadPlaylist(this.songList)
            this.$refs.youtube.loadVideoById('gEPmA3USJdI')
        },

        setTimestamp(e){
            const timeStamp = e.target.value
            this.$refs.youtube.seekTo(timeStamp)
            console.log(timeStamp);
        }
    },

    computed:{
        songLength(){
            const duration = Math.floor(this.$refs.youtube.getDuration())
            console.log(duration);

            if(duration < 60){
                return '0:' + duration.toString()
            }
            
            const minutes = ('minutes:,', Math.floor(duration / 60).toString());
            var seconds = ('seconds:,', Math.floor(((duration / 60) % 1) * 100).toString());
            if(seconds.length < 2){
                seconds = '0' + seconds
            }
            console.log('duration', minutes, ':', seconds);
            return minutes + ':' + seconds
        },

        getDuration(){
            const duration = Math.floor(this.$refs.youtube.getDuration())
            return duration
        }
    },

    components: { YouTube },
})
</script>