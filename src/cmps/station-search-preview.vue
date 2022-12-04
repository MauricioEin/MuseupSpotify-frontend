<template>
    <li class="station-search-preview" @click.stop="$emit('clicked', song.id)" :class="{ clicked: isClicked}">
        <div class="song-img-container">
            <div class="song-img">
                <img :src="imgUrl" alt="">
            </div>
            <div class="play-pause-btn" v-if="isOnPlayer && isPlayerOn" @click="pauseSong">
                <media-player-stop />
            </div>
            <div class="play-pause-btn" v-else @click="playSong">
                <play-btn-svg />
            </div>
        </div>
        <div class="song-title">
            <span class="artist-name"> {{ song.title.slice(0, titleBreakIdx) }}</span>
            {{ song.title.slice(titleBreakIdx) }}
        </div>
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
        },
        clickedSong: {
            type: String
        },
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
        },
        titleBreakIdx() {
            var idx = this.song.title.indexOf('-')
            if (idx === -1) idx = this.song.title.indexOf('|')
            return idx === -1 ? 0 : idx
        },
        isClicked() {
            return this.clickedSong === this.song.id
        },
    },
    created() {
        window.addEventListener('click', () => this.$emit('clicked', ''));
    },
    methods: {
        playSong() {
            this.$store.commit({ type: 'toggleIsPlayed' })
            this.$store.commit({ type: 'playSong', song: JSON.parse(JSON.stringify(this.song)) })
        },
        pauseSong() {
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