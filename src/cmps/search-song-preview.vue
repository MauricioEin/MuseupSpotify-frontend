<template>
    <section class="search-song-preview">
        <div class="song-index">
            <span>
                {{ index + 1 }}
            </span>
            <div v-if="!isPlaying" @click="playSong" title="Play song">
                <play-btn-svg />
            </div>
            <div v-else @click="pauseSong">
                <media-player-stop />
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
    data() {
        return {
            isPlayed: false,

        }
    },
    methods: {
        toggleLike() {
            this.$refs['search-like-btn'].classList.toggle('liked')
        },
        playSong() {
            this.$emit('songSelected', this.song.id)
            this.$store.commit({ type: 'playSong', song: JSON.parse(JSON.stringify(this.song)) })
            this.$store.commit({ type: 'toggleIsPlayed' })
            this.isPlayed = true
        },
        pauseSong() {
            this.$store.commit({ type: 'toggleIsPlayed' })
            this.isPlayed = false
        }
    },
    computed: {
        isPlaying() {
            return this.song.id === this.playingSongId
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

<style lang="scss" scoped>

</style>