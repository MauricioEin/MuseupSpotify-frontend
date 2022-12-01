<template>
    <section class="station-song-list">
        <ul class="clean-list">
            <station-song-preview @addSongToStation="addSongToStation" v-for="song in songs" :song="song"
                :key="song.id" />
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
    },
    methods: {
        addSongToStation(song) {
            this.$emit('addSongToStation', song)
        }
    }
}
</script>

<style lang="scss" scoped>

</style>