<template>
    <section class="mini-menu">
        <button v-if="isFull" class="close-menu flex" @click="$emit('closeMenu')"><x-btn-svg /></button>
        <button @click="queueStation">{{ queueAction }}</button>
        <button @click="$emit('follow')">{{ followAction }}</button>
        <button @click="$emit('edit')">Edit details</button>
        <button @click="$emit('remove')">Delete</button>
    </section>
</template>

<script>
import xBtnSvg from '../assets/svgs/x-btn-svg.vue'


export default {
    props: ['isFollowed', 'isQueued'],

    computed: {
        followAction() {
            return this.isFollowed ? 'Unfollow playlist' : 'Follow playlist'
        },

        queueAction() {
            return this.isQueued ? 'Remove from queue' : 'Add to queue'
        },
        isFull() {
            return window.innerWidth < 860
        }

    },
    methods: {
        queueStation() {
            if (this.isQueued) {
                this.$emit('removeStationQueue')
            } else {
                this.$emit('queue')
            }
        }
    },
    components: { xBtnSvg }
}
</script>

