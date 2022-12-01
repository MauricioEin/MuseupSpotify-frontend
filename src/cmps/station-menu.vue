<template>
    <section class="station-menu">
        <button @click="$emit('queue')">Add to queue</button>
        <button @click="$emit('follow')">{{ followAction }}</button>
        <button @click="$emit('edit')">Edit details</button>
        <button @click="$emit('remove')">Delete</button>
    </section>
</template>

<script>
export default {
    props: ['isFollowed'],
    computed: {
        followAction() {
            return this.isFollowed ? 'Remove from library' : 'Add to library'
        }
    }
}
</script>

