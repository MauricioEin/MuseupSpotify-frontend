<template>
    <section class="song-list">
        <song-list-header v-if="songs?.length" />
        <ul class="clean-list">
            <song-preview v-for="(song, index) in songs" @clicked="onSongClicked" @playing="id => playingSong = id"
                :key="song._id" :song="song" :loggedInUser="loggedInUser" :index="index" :clickedSong="clickedSong"
                :playingSong="playingSong" @play="$emit('play', index)" @songAction="action => $emit(action, song)" />
        </ul>
    </section>
</template>

<script>
import songPreview from '../cmps/song-preview.vue'
import songListHeader from './song-list-header.vue'
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
        songPreview,
        songListHeader
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
