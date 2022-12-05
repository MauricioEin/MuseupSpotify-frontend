<template>
    <section class="song-list">
        <song-list-header v-if="songs?.length" />
        <ul class="clean-list">
            <Container orientation="vertical" @drop="onDrop" drag-handle-selector=".column-drag-handle" :key="listKey">
                <Draggable v-for="(song, index) in songsCopy" :key="song.youtubeId">
                    <span class="column-drag-handle" style="float:left; padding:0 10px;">&#x2630;</span>
                    <song-preview class="draggable-item" @clicked="onSongClicked" @playing="id => playingSong = id"
                        :key="song._id" :song="song" :loggedInUser="loggedInUser" :index="index"
                        :clickedSong="clickedSong" :playingSong="playingSong" @play="$emit('play', index)"
                        @songAction="action => $emit(action, song)" :isLikedSongs="isLikedSongs || false" />
                </Draggable>
            </Container>
            <span v-for="song in songsCopy">{{ song.title }} ||| </span>
        </ul>
    </section>
</template>




<!-- <song-preview v-for="(song, index) in songs" @clicked="onSongClicked"
@playing="id => playingSong = id" :key="song._id" :song="song" :loggedInUser="loggedInUser"
:index="index" :clickedSong="clickedSong" :playingSong="playingSong"
@play="$emit('play', index)" @songAction="action => $emit(action, song)"
:isLikedSongs="isLikedSongs || false" /> -->


<script>
import { Container, Draggable } from "vue3-smooth-dnd";

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
        Container,
        Draggable
    },
    data() {
        return {
            clickedSong: '',
            playingSong: '',
            songsCopy: [...this.songs],
            items: [
                { id: 1, data: "Princess Mononoke" },
                { id: 2, data: "Spirited Away" },
                { id: 3, data: "My Neighbor Totoro" },
                { id: 4, data: "Howl's Moving Castle" }
            ],
            listKey: 0

        }
    },

    watch: {
        isClickOutside() {
            if (this.isClickOutside) this.clickedSong = ''
        },
        songs() {
            console.log('songs changed')
            this.songsCopy = [...this.songs]
            this.listKey++
        },
    },
    methods: {
        onSongClicked(id) {
            this.clickedSong = id
            this.$emit('songClicked')
        },
        onDrop(dropResult) {
            this.songsCopy = this.applyDrag(this.songsCopy, dropResult);
        },
        applyDrag(arr, dragResult) {
            const { removedIndex, addedIndex, payload } = dragResult;

            if (removedIndex === null && addedIndex === null) return arr;
            const result = [...arr];
            let itemToAdd = payload;

            if (removedIndex !== null) {
                itemToAdd = result.splice(removedIndex, 1)[0];
            }
            if (addedIndex !== null) {
                result.splice(addedIndex, 0, itemToAdd);
            }
            return result;
        }


    }
}
</script>
