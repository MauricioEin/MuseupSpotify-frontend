<template>
    <section class="song-list">
        <ul class="clean-list">
            <song-preview v-for="(song, index) in songs" @clicked="onSongClicked" @playing="id => playingSong = id"
                :key="song._id" :song="song" :loggedInUser="loggedInUser" :index="index" :clickedSong="clickedSong"
                :playingSong="playingSong" @songAction="action => $emit(action, song)" />
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
        },
        isClickOutside: {
            type: Boolean
        },
        loggedInUser: { type: Object }
    },
    components: {
        songPreview
    },
    data() {
        return {
            clickedSong: '',
            playingSong: ''
        }
    },

    watch: {
        isClickOutside() {
            if (this.isClickOutside) this.clickedSong = ''
        }
    },
    methods: {
        onSongClicked(id) {
            this.clickedSong = id
            this.$emit('songClicked')
        },
    }
}
</script>

<style lang="scss" scoped>

</style>