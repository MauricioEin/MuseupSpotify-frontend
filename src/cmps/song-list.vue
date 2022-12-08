<template>
    <section class="song-list">
        <song-list-header v-if="songs?.length" />
        <ul class="clean-list">
            <Container orientation="vertical" @drop="onDrop" drag-handle-selector=".column-drag-handle" :key="listKey">
                <Draggable v-for="(song, index) in songsCopy" :key="song.youtubeId" style="overflow:initial;position:relative">
                    <song-preview class="draggable-item" @songClicked="onSongClicked(index)" @playing="id => playingSong = id"
                        :key="song._id" :song="song" :loggedInUser="loggedInUser" :index="index" :dropKey="dropKey"
                        :clickedSong="clickedSong" :playingSong="playingSong" @play="$emit('play', index)"
                        @songAction="action => $emit(action, song)" :isLikedSongs="isLikedSongs || false" />
                </Draggable>
            </Container>
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
            listKey: 0,
            dropKey:0,

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
        songsCopy() {
            if (JSON.stringify(this.songsCopy) !== JSON.stringify(this.songs)) {
                this.$emit('reorder', { songs: this.songsCopy })
                console.log('reordered!')
            }
        }
    },
    methods: {
        onSongClicked(idx) {
            // this.clickedSong = id
            this.$emit('songClicked', idx)
            // console.log(index);
            // console.log(id);
            // console.log('hi', song);
            // this.$emit('play', index)
        },
        onDrop(dropResult) {
            this.songsCopy = this.applyDrag(this.songsCopy, dropResult);
            this.dropKey++
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
