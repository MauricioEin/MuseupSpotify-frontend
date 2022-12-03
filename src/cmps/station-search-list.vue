<template>
    <section class="station-search-list">
        <ul class="clean-list">
            <station-search-preview @addSongToStation="addSongToStation" v-for="song in songs" :song="song"
                :key="song.id" />
        </ul>
    </section>
</template>

<script>
import stationSearchPreview from './station-search-preview.vue';
export default {
    props: {
        songs: {
            type: Array,
            required: true
        }
    },
    components: {
        stationSearchPreview
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