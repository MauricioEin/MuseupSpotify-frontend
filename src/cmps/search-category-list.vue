<template>
    <section class="search-category-list content-layout">
        <h1>Browse all</h1>
        <div class="category-container">
            <search-category-card v-for="i in 25" :key="i" :style="{ 'background-color': colors[i - 1] }"
                :label="labels[i - 1]" :imgIdx="i" @click="$router.push('/collection/all')" />
        </div>
    </section>
</template>

<script>
import searchCategoryCard from './search-category-card.vue'

export default {

    data() {
        return {
            labels: ['2022 Wrapped', 'Podcasts', 'Made For You', 'New Releases', 'Pop', 'Hip-Hop', 'Rock', 'Latin', 'Charts', 'Live Events', 'Dance', 'Mood', 'Indie', 'Workout', 'Discover', 'Country', 'R&B', 'K-pop', 'Chill', 'Sleep', 'Party', 'At Home', 'Decades', 'Romance', 'Metal'],
            colors: ['#8400e7', '#e13300', '#1e3264', '#e8115b', '#148a08', '#bc5900', '#e91429', '#e1118c', '#8d67ab', '#7358ff', '#d84000', '#e1118c', '#e91429', '#777777', '#8d67ab', '#d84000', '#dc148c', '#148a08', '#d84000', '#1e3264', '#537aa1', '#537aa1', '#ba5d07', '#8c1932', '#e91429'],

        }
    },

    components: {
        searchCategoryCard

    }
}
</script>

<style lang="scss" scoped>

</style>