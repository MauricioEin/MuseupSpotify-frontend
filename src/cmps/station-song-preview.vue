<template>
    <li class="station-song-preview">
        <div class="song-img-container">
            <img :src="imgUrl" alt="">
            <img-screen-play @playSong="playSong" />
        </div>
        <div class="song-title">{{ song.title }}</div>
        <button class="btn-add-song">Add</button>
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
            return this.song.imgUrl.medium
        }
    },
    components: {
        imgScreenPlay
    },
    methods: {
        playSong() {
            console.log('Play song:', this.song.id);
        }
    }
}
</script>

<style lang="scss" scoped>

</style>