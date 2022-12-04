<template>
    <section class="search-song-preview" @click.stop="$emit('clicked', song.id)"
        :class="{ clicked: isClicked, playing: isOnPlayer }">
        <div class="song-index">
            <img v-if="isOnPlayer && isPlayerOn" src="../assets/gifs/equaliser-animated.gif" />
            <span v-else class="artist-name"> {{ index + 1 }} </span>
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
            <button @click="toggleLike" class="btn-like-song" ref="search-like-btn">
                <heart-empty-svg />
            </button>
            <div class="song-length">{{ song.length }}</div>
            <button class="btn-more-options">
                <more-options-svg />
            </button>
        </div>
    </section>
</template>

<script>
import moreOptionsSvg from '../assets/svgs/more-options-svg.vue';
import heartEmptySvg from '../assets/svgs/heart-empty-svg.vue';
import playBtnSvg from '../assets/svgs/play-btn-svg.vue';
import mediaPlayerStop from '../assets/svgs/media-player-stop.vue';

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
    },
created(){
    window.addEventListener('click', () => this.$emit('clicked', ''));
},
    computed: {
        nowPlayingSong() {
            return this.$store.getters.playingSong
        },
        isOnPlayer() {
            return this.nowPlayingSong.youtubeId === this.song.id
        },
        isPlayerOn() {
            return this.$store.getters.isPlayed
        },
        isClicked() {
            return this.clickedSong === this.song.id
        },
        titleBreakIdx() {
            var idx = this.song.title.indexOf('-')
            if (idx === -1) idx = this.song.title.indexOf('|')
            return idx === -1 ? 0 : idx
        },


    },
    methods: {
        toggleLike() {
            this.$refs['search-like-btn'].classList.toggle('liked')
        },
        playSong() {
            this.$store.commit({ type: 'toggleIsPlayed' })
            this.$store.commit({ type: 'playSong', song: JSON.parse(JSON.stringify(this.song)) })
        },
        pauseSong() {
            this.$store.commit({ type: 'toggleIsPlayed' })
        }
    },
    // watch: {
    //     isPlaying() {
    //         this.isPlayed = this.isPlaying
    //         console.log('this.isPlayed', this.isPlayed)
    //     }
    // },
    components: {
        moreOptionsSvg,
        heartEmptySvg,
        playBtnSvg,
        mediaPlayerStop,
    }
}
</script>

