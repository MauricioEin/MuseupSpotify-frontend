<template>
    <li class="song-preview flex">
        <div class="song-preview-info flex">
            <div class="song-index">{{ index + 1 }}</div>
            <div class="song-img-container">
                <img :src="song.imgUrl" alt="">
            </div>
            <div class="song-title">{{ song.title }}</div>
        </div>
        <div class="song-created-at">{{ dateAdded }}</div>
        <div class="song-length">3:13</div>
    </li>
</template>

<script>
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
    }
}
</script>

<style lang="scss" scoped>

</style>