<template>
    <section class="mini-menu">
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
            return this.isFollowed ? 'Unfollow playlist' : 'Follow playlist'
        }
    }
}
</script>

