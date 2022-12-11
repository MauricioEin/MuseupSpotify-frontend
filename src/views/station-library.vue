<template>
    <section class="station-library content-layout">

        <header class="station-library-header">
            <h1>All playlists</h1>
        </header>
        <ul class="station-library-list">

            <station-preview v-for="station in stations" :station="station" :key="station._id" />
        </ul>
    </section>
</template>

<script>
import stationPreview from '../cmps/station-preview.vue';
export default {
    data() {
        return {
        }
    },

    computed: {
        stations() {
            // return this.$store.getters.stations.filter(station => station.owner.username === 'MuseUp')
            return this.$store.getters.stations
        }
    },

    created() {
        window.scrollTo(0, 0)
    },

    components: {
        stationPreview
    }
}
</script>

<style lang="scss" scoped>

</style>