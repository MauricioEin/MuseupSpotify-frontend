<template>
    <section @click.stop="goToLikedSongs" class="liked-songs-card">
        <div class="img-container">
            <img src="../assets/img/likedSongs.png" alt="">
        </div>
        <div class="liked-songs-info">
            <div class="liked-songs-previews">{{ songsPreviews }}</div>
            <h1>Liked Songs</h1>
            <p>{{ songsCount }} liked songs</p>
        </div>
        <!-- <button v-if="(songsCount)" class="btn-play-playlist" @click.stop="toggleStation(loggedinUser.likedSongs)">
            <pause-btn v-if="isCurrStationPlayed(station)" />
            <play-btn v-else />
        </button> -->
    </section>
</template>

<script>
export default {
    methods: {
        goToLikedSongs() {
            this.$router.push('/collection/tracks')
        }
    },
    computed: {
        loggedinUser() {
            return this.$store.getters.loggedinUser
        },
        songsCount() {
            return this.loggedinUser.likedSongs.length
        },
        songsPreviews() {
            return this.loggedinUser.likedSongs.map(song => {
                return song.title.split(' ').slice(0, 5).join(' ')
            }).join(' • ')
        }
    }
}
</script>