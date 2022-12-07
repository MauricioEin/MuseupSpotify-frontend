<template>
    <section class="mini-menu">
        <button v-for="action in actions" :key="action" @click="$emit(makeEventName(action))">
            {{ action }}
        </button>
    </section>
</template>

<script>
import { withModifiers } from 'vue';

export default {
    props: ['actions'],
    methods: {
        makeEventName(action) {
            var words = action.split(' ')
            words = [words[0].toLowerCase(), ...words.slice(1).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())]
            return words.join('')
        }


    }
}
</script> 

