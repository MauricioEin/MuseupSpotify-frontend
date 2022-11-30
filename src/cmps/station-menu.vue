<template>
    <section class="station-menu" @click="">
        <button @click="$emit('queue')">Add to queue</button>
        <button @click="$emit('follow')">Add to profile</button>
        <button @click="$emit('edit')">Edit details</button>
        <button @click="$emit('remove')">Delete</button>
    </section>
</template>

<script>
export default {
}
</script>

