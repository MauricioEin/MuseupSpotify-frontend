<template>
    <section class="mini-menu">
        <button v-for="action in actions" :key="action"
         @click="$emit(`${action.split(' ').join('').toLowerCase()}`)">
         {{ action }}
        </button>
    </section>
</template>

<script>
import { withModifiers } from 'vue';

export default {
    props: ['actions'],
    methods:{
        makeEventName(action){
            // `${action.split(' ').map(word=>
            // .join('').toLowerCase()}`
        }

    }
}
</script> 

