<template>
    <section class="main-search">
        <h1>Search</h1>
        <div class="input-container">
            <search-icon />
            <input v-model="searchStr" type="search" spellcheck="false" placeholder="What do you want to listen to?">
        </div>
    </section>
</template>

<script>
import { stationService } from '../services/station.service'
import { utilService } from '../services/util.service'
import mainSearchList from '../cmps/main-search-list.vue'
import searchIcon from '../assets/svgs/search-icon.vue'

export default {
    data() {
        return {
            searchStr: '',
            searchedSongs: null
        }
    },
    methods: {
        async setSearchStr() {
            if (!this.searchStr) {
                this.$store.commit({ type: 'clearMainSearch' })
                return
            }
            this.searchedSongs = await stationService.searchSongs(this.searchStr)
            this.$store.commit({ type: 'setSearchedSongs', searchedSongs: this.searchedSongs })
        },

    },
    created() {
        this.setSearchStr = utilService.debounce(this.setSearchStr)
    },
    unmounted() {
        this.$store.commit({ type: 'clearMainSearch' })
    },
    watch: {
        searchStr() {
            this.setSearchStr()
        }
    },
    components: {
        mainSearchList,
        searchIcon

    }
}
</script>

<style lang="scss" scoped>

</style>
