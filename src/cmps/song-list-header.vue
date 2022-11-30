<template>
    <section class="song-list-header">
        <div class="list-song-index">#</div>
        <div class="list-song-title"><small>Title</small></div>
        <div></div>
        <div class="list-song-date"><small>Date Added</small></div>
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
