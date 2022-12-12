<template>
    <section class="mini-menu">
        <button v-if="isFull" class="close-menu flex"
         @click="$emit('closeMenu')"><x-btn-svg /></button>
        <div v-if="isFull && visualData" class="visual-data" :class="{'search-data':isSearch}">
            <div class="img-container" >
                <img v-if="visualData.imgUrl" :src="visualData.imgUrl" class="fit-img" />
                <user-portrait v-else  class="fit-img" />
            </div>
            <p class="title">{{ visualData.text1 }}</p>
            <p>{{ visualData.text2 }}</p>
        </div>
        <button v-for="action in actions" :key="action" @click.stop="$emit(makeEventName(action))">
            {{ action }}
        </button>
    </section>
</template>

<script>
import { withModifiers } from 'vue';
import xBtnSvg from '../assets/svgs/x-btn-svg.vue'
import userPortrait from '../assets/svgs/user-portrait.vue'


export default {
    props: ['actions', 'visualData', 'isSearch'],
    methods: {
        makeEventName(action) {
            var words = action.split(' ')
            words = [words[0].toLowerCase(), ...words.slice(1).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())]
            return words.join('')
        }
    },
    computed: {
        isFull() {
            return window.innerWidth < 860
        }
    },
    components: {
        xBtnSvg,
        userPortrait
    }
}
</script> 

