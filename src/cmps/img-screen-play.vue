<template>
    <div @click="this.$emit('playSong')" class="img-screen-play">
        <play-btn-svg />
    </div>
</template>

<script>
import playBtnSvg from '../assets/svgs/play-btn-svg.vue'
export default {
    components: {
        playBtnSvg
    }
}
</script>
