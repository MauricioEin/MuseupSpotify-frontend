<template>
    <section class="main-search-list">
        <section class="main-search-list-header">
            <div class="list-song-index">#</div>
            <div class="list-song-title">Title</div>
            <div></div>
            <div class="list-song-length song-preview-actions">
                <small><clock-svg /></small>
            </div>
        </section>
        <ul class="clean-list">
            <li v-for="(song, index) in songs" :key="song._id">
                <search-song-preview :index="index" :song="song" />
            </li>
        </ul>
    </section>
</template>

<script>
import searchSongPreview from './search-song-preview.vue';
import songListHeader from './song-list-header.vue';
import clockSvg from '../assets/svgs/clock-svg.vue';
export default {
    props: {
        songs: {
            type: Array,
            required: true
        }
    },
    methods: {

    },
    created() {

    },
    components: {
        searchSongPreview,
        songListHeader,
        clockSvg,
    }
}
</script>

<style lang="scss" scoped>

</style>