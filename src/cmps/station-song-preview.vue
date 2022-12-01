<template>
    <li class="station-song-preview">
        <div class="song-img-container">
            <img :src="imgUrl" alt="">
            <img-screen-play @playSong="playSong" />
        </div>
        <div class="song-title">{{ song.title }}</div>
        <button @click="addSongToStation" class="btn-add-song">Add</button>
    </li>
</template>

<script>
import imgScreenPlay from './img-screen-play.vue';

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
        }
    },
    components: {
        imgScreenPlay
    },
    methods: {
        playSong() {
            const { id, youtubeId, title, imgUrl } = this.song
            const miniSong = {
                id,
                youtubeId,
                title,
                imgUrl: imgUrl.medium
            }

        },
        addSongToStation() {
            this.$emit('addSongToStation', JSON.parse(JSON.stringify(this.song)))
        },

    }
}
</script>

<style lang="scss" scoped>

</style>