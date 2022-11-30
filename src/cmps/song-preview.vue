<template>
    <li class="song-preview">
        <!-- <div class="song-preview-info"> -->
        <div class="song-index">{{ index + 1 }}</div>
        <div class="song-img-container">
            <img :src="song.imgUrl" alt="">
        </div>
        <div class="song-title">{{ song.title }}</div>
        <!-- </div> -->
        <div class="song-created-at">{{ dateAdded }}</div>
        <div class="song-preview-actions">
            <button class="btn-like-song"><heart-empty-svg /></button>
            <div class="song-length">3:13</div>
            <button class="btn-more-options"><more-options-svg></more-options-svg></button>
        </div>
    </li>
</template>

<script>
import heartEmptySvg from '../assets/svgs/heart-empty-svg.vue';
import moreOptionsSvg from '../assets/svgs/more-options-svg.vue'
export default {
    props: {
        song: {
            type: Object
        },
        index: {
            type: Number
        }
    },
    computed: {
        dateAdded() {
            const d = new Date(this.song.createdAt)
            return d.toLocaleDateString('he-IL')
        }
    },
    components: {
        heartEmptySvg,
        moreOptionsSvg
    }
}
</script>

<style lang="scss" scoped>

</style>