<template>
    <section class="song-list">

        <!-- <ul>
            <li>
                <div>#</div>
                <div>Title</div>
                <div>Date Added</div>
                <div>Time:</div>
            </li>
            <li v-for="song in songs">
                <song-preview :song="song" />
            </li>
        </ul> -->
        <table>
            <thead>
                <td>#</td>
                <td>Title</td>
                <td>Date Added</td>
                <td>Song length (svg)</td>
            </thead>
            <tr v-for="(song, index) in songs" :key="song._id">
                <song-preview :song="song" :index="index" />
            </tr>
        </table>
    </section>
</template>

<script>
import songPreview from '../cmps/song-preview.vue'
export default {
    props: {
        songs: {
            type: Array,
            required: true
        }
    },
    components: {
        songPreview
    }
}
</script>

<style lang="scss" scoped>

</style>