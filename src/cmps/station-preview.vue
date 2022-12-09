<template>
    <li v-if="station" ref="stationCard" class="station-card" @click="goToStation(station._id)">
        <img :src="getStationImg(station)" alt="" class="station-img">
        <div class="card-details">
            <p class="station-title cut-text">
                {{ station.name }}
            </p>
            <p v-if="station.desc" class="station-desc">{{ station.desc }}</p>
            <p v-else class="station-desc cut-text">By {{ station.owner.username }}</p>
            <button v-if="(station.firstSong)" class="btn-play-playlist" @click.stop="toggleStation(station)">
                <pause-btn v-if="isCurrStationPlayed(station)" />
                <play-btn v-else />
            </button>

        </div>
    </li>
</template>

<script>
import playBtn from '../assets/svgs/play-btn-svg.vue'
import pauseBtn from '../assets/svgs/media-player-stop.vue'

export default {

    props: {
        station: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            isLoading: true
        }
    },
    methods: {
        toggleStation(station) {
            if (!this.isCurrStationPlayed(station) && this.isPlaying ||
                !this.isCurrStationPlayed(station) && !this.isPlaying) {
                this.playStation(station)
            } else this.toggleIsPlaying()
        },

        getStationImg(station) {
            return station.imgUrl || station?.firstSong?.imgUrl.medium || 'https://i.ibb.co/RChzLhY/2022-12-03-132853.jpg'
        },

        goToStation(id) {
            this.$router.push({ path: `/station/${id}` })
        },

        playStation(station) {
            this.$store.commit({ type: 'toggleIsPlaying' })
            this.$store.commit({ type: 'playSong', song: JSON.parse(JSON.stringify(station.firstSong)), stationId: station._id })
            this.$store.dispatch({ type: 'playFromHomePage', station })
        },

        toggleIsPlaying() {
            this.$store.commit('toggleIsPlaying')
        },

        isCurrStationPlayed(station) {
            return (this.isPlaying && station._id === this.getPlayingStation._id)
        },
    },

    computed: {
        isPlaying() {
            return this.$store.getters.isPlaying
        },

        getPlayingStation() {
            return this.$store.getters.getPlayingStation
        },

        loggedInUser() {
            return this.$store.getters.loggedInUser
        },

    },

    components: {
        playBtn,
        pauseBtn
    }
}
</script>