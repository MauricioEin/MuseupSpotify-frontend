<template>
    <section class="song-list">
        <song-list-header v-if="items?.length" />
        <draggable v-model="items">

            <template v-slot:item="{ item }">
                <song-preview :key="item.id" :song="item" :index="items.indexOf(item)"
                    @play="$emit('play', items.indexOf(item))" :loggedInUser="loggedInUser" :clickedSong="clickedSong"
                    :playingSong="playingSong" :isLikedSongs="isLikedSongs || false" @clicked="onSongClicked"
                    @playing="id => playingSong = id" @songAction="action => $emit(action, item)" />
            </template>
        </draggable>
    </section>
</template>

<script>
import Draggable from 'vue3-draggable'

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
        loggedInUser: { type: Object },
        isLikedSongs: { type: Boolean }

    },
    components: {
        songPreview,
        songListHeader,
        Draggable
    },
    data() {
        return {
            clickedSong: '',
            playingSong: '',
            items: JSON.parse(JSON.stringify(this.songs))
        }
    },

    watch: {
        isClickOutside() {
            if (this.isClickOutside) this.clickedSong = ''
        },
        items() {
            if (JSON.stringify(this.items) !== JSON.stringify(this.songs))
            {
                this.$emit('reorder', { songs: this.items })
                console.log('reordered!')
            }
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
