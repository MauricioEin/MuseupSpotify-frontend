<template>
    <section class="search-song-preview">
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

export default {
    props: {
        song: {
            type: Object
        },
    },
    methods: {
        toggleLike() {
            this.$refs['search-like-btn'].classList.toggle('liked')
        }
    },
    computed: {

    },
    components: {
        moreOptionsSvg,
        heartEmptySvg
    }
}
</script>

<style lang="scss" scoped>

</style>