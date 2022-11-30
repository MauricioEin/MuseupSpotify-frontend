<template>
    <section class="main-search-list">
        <h1>Tracks</h1>
        <ul class="clean-list">
            <li v-for="song in songs" :key="song.id">
                <search-song-preview :song="song" />
            </li>
        </ul>
    </section>
</template>

<script>
import searchSongPreview from './search-song-preview.vue';
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
        searchSongPreview
    }
}
</script>

<style lang="scss" scoped>

</style>