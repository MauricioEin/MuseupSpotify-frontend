<template>
    <section class="song-list">
        <ul>
            <song-preview v-for="(song, index) in songs" :song="song" :index="index" :key="song._id" />
        </ul>
    </section>
</template>

<script>
import songPreview from '../cmps/song-preview.vue'
export default {
    props: {
        songs: {
            type: Array,
            required: true
        }
    },
    components: {
        songPreview
    }
}
</script>

<style lang="scss" scoped>

</style>