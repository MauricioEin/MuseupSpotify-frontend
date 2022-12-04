<template>
    <section class="song-list-header light">
        <div class="list-song-index">#</div>
        <div class="list-song-title">Title</div>
        <div></div>
        <div class="list-song-date">Date Added</div>
        <div class="list-song-length song-preview-actions"><small>
                <clock-svg />
            </small></div>
    </section>
</template>

<script>
import clockSvg from '../assets/svgs/clock-svg.vue'
export default {
    components: {
        clockSvg,
    }
}
</script>
