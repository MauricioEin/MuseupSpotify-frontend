<template>
    <li class="station-search-preview">
        <div class="song-img-container">
            <div class="song-img">
                <img :src="imgUrl" alt="">
            </div>
            <div class="play-pause-btn" v-if="isOnPlayer && isPlayerOn" @click="pauseSong">
                <media-player-stop  />
            </div>
            <div class="play-pause-btn" v-else @click="playSong">
                <play-btn-svg/>
            </div>
        </div>
        <div class="song-title">{{ song.title }}</div>
        <button @click="addSongToStation" class="btn-add-song">Add</button>
    </li>
</template>

<script>
import imgScreenPlay from './img-screen-play.vue';
import playBtnSvg from '../assets/svgs/play-btn-svg.vue';
import mediaPlayerStop from '../assets/svgs/media-player-stop.vue';


export default {
    props: {
        song: {
            type: Object,
            required: true
        }
    },
    computed: {
        imgUrl() {
            return this.song.imgUrl.medium || this.song.imgUrl
        },
        nowPlayingSong() {
            return this.$store.getters.playingSong
        },
        isOnPlayer() {
            return this.nowPlayingSong.youtubeId === this.song.id
        },
        isPlayerOn() {
            return this.$store.getters.isPlayed
        }
    },
    methods: {
        playSong() {
            this.$store.commit({ type: 'toggleIsPlayed' })
            this.$store.commit({ type: 'playSong', song: JSON.parse(JSON.stringify(this.song)) })
        },
        pauseSong(){
            this.$store.commit({ type: 'toggleIsPlayed' })

        },
        addSongToStation() {
            this.$emit('addSongToStation', JSON.parse(JSON.stringify(this.song)))
        },
    },
    components: {
        imgScreenPlay,
        playBtnSvg,
        mediaPlayerStop,

    },

}
</script>

<style lang="scss" scoped>

</style>