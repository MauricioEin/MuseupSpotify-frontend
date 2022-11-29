<template>
    <td>
        {{ index + 1 }}
    </td>
    <td>
        IMG
    </td>
    <td>
        {{ song.title }}
    </td>
    <td>
        {{ dateAdded }}
    </td>
    <!-- <td>
        {{ song.length }}
    </td> -->
</template>

<script>
export default {
    props: {
        song: {
            type: Object
        },
        index: {
            type: Number
        }
    },
    computed: {
        dateAdded() {
            const d = new Date(this.song.createdAt)
            return d.toLocaleDateString('he-IL')
        }
    }
}
</script>

<style lang="scss" scoped>

</style>