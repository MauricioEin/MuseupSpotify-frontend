<template>
    <section class="search-song-preview" @click.stop="$emit('clicked', song.id)"
        :class="{ clicked: isClicked, playing: isOnPlayer }">
        <div class="song-index">
            <img v-if="isOnPlayer && isPlayerOn" src="../assets/gifs/equaliser-animated.gif" />
            <span v-else class="index-number"> {{ index + 1 }} </span>
            <div v-if="isOnPlayer && isPlayerOn" @click.stop="pauseSong">
                <media-player-stop />
            </div>
            <div v-else @click.stop="playSong" title="Play song">
                <play-btn-svg />
            </div>
        </div>

        <div class="song-img-container">
            <img :src="song.imgUrl.medium" alt="">
        </div>
        <div class="song-title">
            <span class="artist-name"> {{ song.title.slice(0, titleBreakIdx) }}</span>
            {{ song.title.slice(titleBreakIdx) }}
        </div>
        <div class="song-preview-actions">
            <button class="btn-like-song" @click="saveSong" :class="{ liked: isLiked }">
                <heart-btn-svg v-if="isLiked" class="liked" />
                <heart-empty-svg v-else />
            </button>
            <div class="song-length"> {{ song.length }}
                <mini-menu v-if="isMiniMenu && isClicked" ref="miniMenu" :actions="songActions"
                    @saveToYourLikedSongs="saveSong" 
                    @removeFromYourLikedSongs="saveSong" />

            </div>
            <button class="btn-more" @click="toggleMiniMenu">
                <more-options-svg />
            </button>
        </div>
    </section>
</template>

<script>
import moreOptionsSvg from '../assets/svgs/more-options-svg.vue'
import heartEmptySvg from '../assets/svgs/heart-empty-svg.vue'
import heartBtnSvg from '../assets/svgs/heart-btn-svg.vue'
import playBtnSvg from '../assets/svgs/play-btn-svg.vue'
import mediaPlayerStop from '../assets/svgs/media-player-stop.vue'

import miniMenu from '../cmps/mini-menu.vue'


export default {
    props: {
        song: {
            type: Object
        },
        index: {
            type: Number
        },
        playingSongId: {
            type: String
        },
        clickedSong: {
            type: String
        },
        loggedInUser: {
            type: Object
        },
    },
    created() {
        window.addEventListener('click', this.emitClicked)
    },
    unmounted() {
        window.removeEventListener('click', this.emitClicked)

    },
    data() {
        return {
            isMiniMenu: false,

        }
    },
    computed: {
        nowPlayingSong() {
            return this.$store.getters.playingSong
        },
        isOnPlayer() {
            return this.nowPlayingSong.youtubeId === this.song.id
        },
        isPlayerOn() {
            return this.$store.getters.isPlaying
        },
        isClicked() {
            return this.clickedSong === this.song.id
        },
        titleBreakIdx() {
            var idx = this.song.title.indexOf('-')
            if (idx === -1) idx = this.song.title.indexOf('|')
            return idx === -1 ? 0 : idx
        },
        isLiked() {
            return this.loggedInUser.likedSongs.some(song => song.id === this.song.id)
        },
        songActions() {
            return ['Add to queue', this.isLiked ? 'Remove from your Liked Songs' : 'Save to your Liked Songs', 'Add to a playlist', 'Share']
        },
    },
    methods: {
        playSong() {
            this.$store.commit({ type: 'toggleIsPlaying' })
            this.$store.commit({ type: 'playSong', song: JSON.parse(JSON.stringify(this.song)) })
        },
        pauseSong() {
            this.$store.commit({ type: 'toggleIsPlaying' })
        },
        emitClicked() {
            this.$emit('clicked', '')
        },
        saveSong() {
            this.$store.dispatch({ type: 'saveSong', song: this.song })
        },
        toggleMiniMenu() {
            this.isMiniMenu = !this.isMiniMenu
        },



    },
    watch: {
        isClicked() {
            if (!this.isClicked) this.isMiniMenu = false
        },

    },
    components: {
        moreOptionsSvg,
        heartEmptySvg,
        heartBtnSvg,
        playBtnSvg,
        mediaPlayerStop,
        miniMenu,
    }
}
</script>

