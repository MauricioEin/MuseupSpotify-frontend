<template>
    <section class="station-song-list">
        <ul class="clean-list">
            <station-song-preview v-for="song in songs" :song="song" :key="song.id" />
        </ul>
    </section>
</template>

<script>
import stationSongPreview from './station-song-preview.vue';
export default {
    props: {
        songs: {
            type: Array,
            required: true
        }
    },
    components: {
        stationSongPreview
    }
}
</script>

<style lang="scss" scoped>

</style>