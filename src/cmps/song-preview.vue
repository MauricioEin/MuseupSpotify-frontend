<template>
    <li class="song-preview" @click.stop="$emit('clicked', song.id)" :class="{ clicked: isClicked }">
        <!-- <div class="song-preview-info"> -->
        <div class="song-index">{{ index + 1 }}</div>
        <div class="song-img-container">
            <img :src="imgUrl" alt="">
        </div>
        <div class="song-title">{{ song.title }}</div>
        <!-- </div> -->
        <div class="song-created-at">{{ dateAdded }}</div>
        <div class="song-preview-actions">
            <button class="btn-like-song" @click="onMiniMenu('saveSong')" :class="{ liked: isLiked }">
                <heart-btn-svg v-if="isLiked" class="liked" />
                <heart-empty-svg v-else />
            </button>
            <div class="song-length">{{ song.length }}
                <mini-menu v-if="isMiniMenu && isClicked" ref="miniMenu" :actions="songActions"
                    @savetoyourlikedsongs="onMiniMenu('saveSong')" />

            </div>
            <button class="btn-more-options" @click="toggleMiniMenu">
                <more-options-svg />
            </button>
        </div>
    </li>


</template>

<script>
import heartEmptySvg from '../assets/svgs/heart-empty-svg.vue'
import heartBtnSvg from '../assets/svgs/heart-btn-svg.vue'
import moreOptionsSvg from '../assets/svgs/more-options-svg.vue'
import miniMenu from '../cmps/mini-menu.vue'


export default {
    props: {
        song: {
            type: Object
        },
        index: {
            type: Number
        },
        clickedSong: {
            type: String
        },
        loggedInUser: { type: Object }
    },
    emits: ['clicked'],
    data() {
        return {
            isMiniMenu: false,
        }
    },
    created() {
        window.addEventListener('click', () => this.$emit('clicked', ''));
    },
    computed: {
        dateAdded() {
            const d = new Date(this.song.createdAt)
            return d.toLocaleDateString('he-IL')
        },
        imgUrl() {
            return this.song.imgUrl.medium || this.song.imgUrl
        },
        isClicked() {
            return this.clickedSong === this.song.id
        },
        isLiked() {
            return this.loggedInUser.likedSongs.some(song => song.id === this.song.id)
        },
        songActions() {
            return ['Add to queue', this.isLiked ? 'Remove from your Liked Songs' : 'Save to your Liked Songs', 'Add to playlist', 'Share']
        }

    }, methods: {
        toggleMiniMenu() {
            this.isMiniMenu = !this.isMiniMenu
        },
        onMiniMenu(action) {
            this.isMiniMenu = false
            console.log(action)
            this.$emit('songAction', action)
        }
    },
    watch: {
        isClicked() {
            if (!this.isClicked) this.isMiniMenu = false
        },
        isMiniMenu() {
            // console.log('MINI', this.$refs)
            // if (this.isMiniMenu) this.$refs?.miniMenu?.addEventListener('click', ()=>this.isMiniMenu=false)
        }
    },
    components: {
        heartEmptySvg,
        heartBtnSvg,
        moreOptionsSvg,
        miniMenu
    }
}

</script>

<style lang="scss" scoped>

</style>