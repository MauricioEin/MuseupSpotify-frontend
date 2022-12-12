<template>
    <section class="mini-menu">
        <button v-if="isFull" class="close-menu flex" @click="$emit('closeMenu')"><x-btn-svg /></button>
        <div v-if="isFull && visualData" class="visual-data">
            <div class="img-container">
                <img :src="visualData.imgUrl" class="fit-img" />
            </div>
            <p class="title">{{ visualData.text1 }}</p>
            <p>{{ visualData.text2 }}</p>
        </div>

        <button @click="queueStation">{{ queueAction }}</button>
        <button @click="$emit('follow')">{{ followAction }}</button>
        <button @click="$emit('edit')">Edit details</button>
        <button @click="$emit('remove')">Delete</button>
    </section>
</template>

<script>
import xBtnSvg from '../assets/svgs/x-btn-svg.vue'


export default {
    props: ['isFollowed', 'isQueued', 'visualData'],

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

