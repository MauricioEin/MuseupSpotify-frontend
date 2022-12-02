<template>
    <section class="mini-menu">
        <button v-for="action in actions" :key="action"
         @click="$emit(`${action.split(' ').join('').toLowerCase()}`)">
         {{ action }}
        </button>
    </section>
</template>

<script>
export default {
    props: ['actions'],
}
</script> 

