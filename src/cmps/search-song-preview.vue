<template>
    <section class="search-song-preview">
        <div class="song-index">
            <span>
                {{ index + 1 }}
            </span>
            <div v-if="isOnPlayer&& isPlayerOn" @click="pauseSong">
                <media-player-stop />
            </div>
            <div v-else @click="playSong" title="Play song">
                <play-btn-svg />
            </div>
        </div>

        <div class="song-img-container">
            <img :src="song.imgUrl.medium" alt="">
        </div>
        <small class="song-title">{{ song.title }}</small>
        <div class="song-preview-actions">
            <button @click="toggleLike" class="btn-like-song" ref="search-like-btn"><heart-empty-svg /></button>
            <div class="song-length">{{ song.length }}</div>
            <button class="btn-more-options"><more-options-svg /></button>
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
        }
    },

    computed: {
        nowPlayingSong() {
            return this.$store.getters.playingSong
        },
        isOnPlayer() {
            return this.nowPlayingSong.youtubeId === this.song.id
        },
        isPlayerOn(){
            return this.$store.getters.isPlayed
        }

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

