<template>
    <section class="main-search">
        <input v-model="searchStr" type="search" placeholder="What do you want to listen to?">
    </section>
</template>

<script>
import { stationService } from '../services/station.service';
import { utilService } from '../services/util.service';
import mainSearchList from '../cmps/main-search-list.vue'
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
    watch: {
        searchStr() {
            this.setSearchStr()
        }
    },
    components: {
        mainSearchList
    }
}
</script>

<style lang="scss" scoped>

</style>
