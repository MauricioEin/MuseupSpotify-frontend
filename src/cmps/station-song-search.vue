<template>
    <section class="station-song-search flex">
        <div>
            <h1>Let's find something for your playlist</h1>
            <input v-model="searchStr" type="search" placeholder="Search for songs">
        </div>
        <div class="flex align-center">
            <button @click="this.$emit('closeSearch')"><x-btn-svg /></button>
        </div>
    </section>
</template>

<script>
import { utilService } from '../services/util.service';
import { stationService } from '../services/station.service';
import xBtnSvg from '../assets/svgs/x-btn-svg.vue';
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
        },
    },
    components: {
        xBtnSvg,
    }
}
</script>
