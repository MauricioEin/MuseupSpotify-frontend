<template>
    <section class="mini-menu">
        <button v-if="isFull" class="close-menu flex" @click="$emit('closeMenu')" ><x-btn-svg/></button>
        <div v-if="isFull && songData" class="song-data">
            <div class="img-container">
                <img :src="songData.imgUrl" class="fit-img"/>
            </div>
        <p class="artist">{{songData.artist}}</p>
        <p>{{songData.title}}</p>
        </div>
        <button v-for="action in actions" :key="action" @click.stop="$emit(makeEventName(action))">
            {{ action }}
        </button>
    </section>
</template>

<script>
import { withModifiers } from 'vue';
import xBtnSvg from '../assets/svgs/x-btn-svg.vue'

export default {
    props: ['actions', 'songData'],
    methods: {
        makeEventName(action) {
            var words = action.split(' ')
            words = [words[0].toLowerCase(), ...words.slice(1).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())]
            return words.join('')
        }
    },
    computed:{
        isFull(){
            return window.innerWidth < 860 
        }
    },
    components:{
        xBtnSvg
    }
}
</script> 

